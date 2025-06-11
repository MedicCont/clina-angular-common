import {
  Component,
  HostListener,
  Input,
  OnInit,
  Renderer2,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment-timezone';
import { ClinicLocationDto } from '../../dtos/clinic-locations.dto';
import { CoordinatesDto } from '../../dtos/coordinates.dto';
import { PlaceDto } from '../../dtos/place.dto';
import { SearchInput } from '../../dtos/search-input.dto';
import { PlaceTypeEnum } from '../../enums/place-type.enum';
import { ClinicLocationsGetService } from '../../services/clinic-locations-get.service';
import { NavbarService } from '../../services/navbar.service';
import { PlatformUtils } from '../../services/platform.util';
import { DropdownItem } from '../location-dropdown/location-dropdown.component';

@Component({
  selector: 'clina-navbar-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class NavbarSearchComponent implements OnInit {
  @Input() isRunningInSaaS: boolean = false;

  showSearch = false;

  searchInput?: SearchInput;

  cities: PlaceDto[] = [];
  neighborhoods: PlaceDto[] = [];
  googlePlaces: PlaceDto[] = [];
  ceps: PlaceDto[] = [];
  locationsList: any[] = [];
  locationSelected?: PlaceDto;
  loadingGooglePlaces = false;
  googlePlacesTimeout: any;
  keyword: string = '';

  loadingCoordinates: boolean = false;

  date?: Date;
  neighborhood: string = '';


  public get locationSelectedToDrop(): DropdownItem {
    return {
      label: this.locationSelected?.label as string,
      value: this.locationSelected?.label as string,
    };
  }

  constructor(
    private readonly renderer: Renderer2,
    private readonly navbarService: NavbarService,
    private readonly clinicLocationsGetService: ClinicLocationsGetService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) { }

  @HostListener('document:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === 27) {
      this.close();
    }
  }

  ngOnInit() {
    this.navbarService
    .getLocations()
    .toPromise()
    .then((response: ClinicLocationDto[] | undefined) => {
      if (response) {  
        response.forEach(clinicLocationDto => {
          clinicLocationDto.cities.forEach(clinicLocationCityDto => {
            this.cities.push({
              type: PlaceTypeEnum.CITY,
              label: clinicLocationCityDto.city + ' - ' + clinicLocationDto.state,
              city: clinicLocationCityDto.city,
              state: clinicLocationDto.state,
              radius: 50000,
            });
            clinicLocationCityDto.neighborhoods.forEach(neighborhood => {
              this.neighborhoods.push({
                type: PlaceTypeEnum.NEIBHBORHOOD,
                label: neighborhood + ' - ' + clinicLocationCityDto.city + ' - ' + clinicLocationDto.state,
                neighborhood: neighborhood,
                city: clinicLocationCityDto.city,
                state: clinicLocationDto.state,
                radius: 20000,
              });
            });
          })
        });
    
        this.locationsList = this.cities;
        this.setupFilter();
      }
    });
}

  changeLocationKeyword(event: any): void {
    clearTimeout(this.googlePlacesTimeout);

    const keyword = event;
    this.keyword = keyword;

    if (keyword.length < 3) {
      this.locationsList = this.cities;
      return;
    }

    const cities = this.cities.filter(
      (city) => city.city && city.city.toLowerCase().indexOf(keyword.toLowerCase()) > -1,
    );

    const neighborhoods = this.neighborhoods.filter(
      (neighborhood) => neighborhood.neighborhood && neighborhood.neighborhood.toLowerCase().indexOf(keyword.toLowerCase()) > -1,
    );

    if (cities.length || neighborhoods.length) {
      this.locationsList = neighborhoods.concat(cities);
      return;
    }

    this.googlePlacesTimeout = setTimeout(() => {
      this.loadingGooglePlaces = true;
      this.locationsList = [];
      this.navbarService.getAddressAutoComplete(keyword).subscribe({
        next: (res) => {
          this.loadingGooglePlaces = false;
          this.locationsList = res.predictions.map((prediction: any) => ({
            type: PlaceTypeEnum.GOOGLE_PLACES,
            label: 'Próximo a ' + prediction.description,
            placeId: prediction.place_id,
            radius: 20000,
          }));
        },
      });
    }, 1000);
  }

  async selectLocation(event: any) {
    if (!event) {
      this.locationSelected = undefined;
      this.changeLocationKeyword('');
      return;
    }

    this.locationSelected = event;
    await this.getCoordinates();
  }

  async getCoordinates() {
    if (!this.locationSelected) return;

    this.locationSelected.lat = undefined;
    this.locationSelected.lng = undefined;

    this.loadingCoordinates = true;

    if (this.locationSelected.type === PlaceTypeEnum.GOOGLE_PLACES) {
      return await this.navbarService
        .getCoordinatesByPlaceId(this.locationSelected.placeId as string)
        .toPromise()
        .then((coordinates: CoordinatesDto) => {
          if (this.locationSelected) {
            this.locationSelected.lat = coordinates.lat;
            this.locationSelected.lng = coordinates.lng;
          }
        })
        .finally(() => (this.loadingCoordinates = false));
    }

    await this.navbarService
      .getCoordinates(
        this.locationSelected.city as string,
        this.locationSelected.state as string,
        this.locationSelected.neighborhood || undefined
      )
      .toPromise()
      .then((coordinates: CoordinatesDto) => {
        if (this.locationSelected) {
          this.locationSelected.lat = coordinates.lat;
          this.locationSelected.lng = coordinates.lng;
        }
      })
      .finally(() => (this.loadingCoordinates = false));
  }

  setupFilter() {
    if (PlatformUtils.isBrowser()) {
      // Função para verificar se os filtros no localStorage estão expirados
      const isFilterExpired = () => {
        const savedFilterDate = localStorage.getItem('filterDate');
        if (!savedFilterDate) return true; // Se não houver data salva, considera expirado
        const savedDate = new Date(savedFilterDate);
        const currentDate = new Date();
        return savedDate.getDate() !== currentDate.getDate(); // Verifica se é o mesmo dia
      };

      // Função para atualizar os filtros no localStorage
      const updateLocalStorageFilters = (filters: SearchInput) => {
        localStorage.setItem('filterDate', new Date().toISOString());
        localStorage.setItem('savedFilters', JSON.stringify(filters));
      };


      // Função para obter os filtros salvos no localStorage
      const getSavedFilters = (): SearchInput | null => {
        const savedFiltersStr = localStorage.getItem('savedFilters');
        return savedFiltersStr ? JSON.parse(savedFiltersStr) : null;
      };

      this.route.queryParams.subscribe({
        next: (paramsList) => {
          const savedFilters = getSavedFilters();
          const hasLocalization =
            paramsList?.['lat'] && paramsList?.['lng'] && paramsList?.['radius'];
          if (paramsList && Object.keys(paramsList).length > 0) {
            // Filtros da URL
            this.searchInput = {
              start: paramsList?.['begin'] ?? moment().startOf('day').format(),
              end: paramsList?.['end'] ?? moment().add(6, 'days').format(),
              city: paramsList?.['city'],
              neighborhood: paramsList?.['neighborhood'],
              state: paramsList?.['state'],
              radius: Number(hasLocalization ? paramsList?.['radius'] : 0),
              lat: parseFloat(hasLocalization ? paramsList?.['lat'] : 0),
              lng: parseFloat(hasLocalization ? paramsList?.['lng'] : 0),
              page: Number(paramsList?.['page'] ?? 1),
              take: Number(paramsList?.['take'] ?? 12),
              roomTypes: paramsList?.['roomTypes'] ?? [],
              roomAmenities: paramsList?.['roomAmenities'] ?? [],
              clinicAmenities: paramsList?.['clinicAmenities'] ?? [],
              equipments: paramsList?.['equipments'] ?? [],
              maxValue: Number(paramsList?.['maxValue']),
              hasDiscount: paramsList?.['hasDiscount'] === 'true',
            };
            updateLocalStorageFilters(this.searchInput);
          } else if (savedFilters && !isFilterExpired()) {
            // Filtros salvos no localStorage se não houver filtros na URL
            this.searchInput = savedFilters;
          } else {
            // Valores padrão se não houver filtros na URL e os salvos no localStorage estão expirados
            this.searchInput = {
              start: moment().format(),
              end: moment().add(6, 'days').format(),
              city: undefined,
              neighborhood: '',
              state: undefined,
              radius: 0,
              lat: 0,
              lng: 0,
              page: 1,
              take: 12,
              roomTypes: [],
              roomAmenities: [],
              clinicAmenities: [],
              equipments: [],
              maxValue: undefined,
              hasDiscount: false,
            };
            updateLocalStorageFilters(this.searchInput);
          }

          // Verifica se os parâmetros da URL são diferentes dos filtros atuais e, se forem, atualiza os filtros
          const queryParamsKeys = Object.keys(paramsList);
          const filterKeys = Object.keys(this.searchInput);
          // if (
          //   queryParamsKeys.some(
          //     (key) =>
          //       filterKeys.includes(key) &&
          //       this.searchInput[key as keyof SearchInput] !== paramsList[key]
          //   )
          // ) {
          //   updateLocalStorageFilters(this.searchInput);
          // }

          // Atualize a interface com os filtros
          this.clearFilters();
          this.configFilter(this.searchInput);
        },
      });
    }
  }

  clearFilters() {
    this.locationSelected = undefined;
  }

  configFilter(data: SearchInput) {
    if (data?.city && data?.neighborhood) {
      this.locationSelected = {
        type: PlaceTypeEnum.NEIBHBORHOOD,
        label: data.neighborhood + ' - ' + data.city + ' - ' + data.state,
        state: data.state,
        city: data.city,
        neighborhood: data.neighborhood,
        radius: data.radius,
        lat: data.lat,
        lng: data.lng,
      };
    } else if (data?.city) {
      this.locationSelected = {
        type: PlaceTypeEnum.CITY,
        label: data.city + ' - ' + data.state,
        state: data.state,
        city: data.city,
        radius: data.radius,
        lat: data.lat,
        lng: data.lng,
      };
    } else if (data?.googlePlace) {
      this.locationSelected = {
        type: PlaceTypeEnum.GOOGLE_PLACES,
        label: data.googlePlace,
        radius: data.radius,
        lat: data.lat,
        lng: data.lng,
      };
    }
    this.date = data?.start ? new Date(data?.start) : new Date();
  }

  getStartDate(event: any) {
    this.date = event;
  }

  openLocalization() {
    this.showSearch = true;
    setTimeout(() => {
      this.renderer.selectRootElement('#location').focus();
    }, 100);
  }

  openDatepicker() {
    this.showSearch = true;
    setTimeout(() => {
      this.renderer.selectRootElement('#date').click();
    }, 100);
  }

  close() {
    this.showSearch = false;
  }


  async makeSearch() {
    if (this.locationsList.length && !this.locationSelected && this.keyword.length > 2) {
      await this.selectLocation(this.locationsList[0]);
    }

    const searchInput = Object.assign(this.searchInput as SearchInput, {
      begin: this.date || moment(),
      end: moment(this.date).add(7, 'days').toDate(),
      city:
        this.locationSelected && [PlaceTypeEnum.CITY, PlaceTypeEnum.NEIBHBORHOOD].includes(this.locationSelected.type)
          ? this.locationSelected.city
          : undefined,
      state:
        this.locationSelected && [PlaceTypeEnum.CITY, PlaceTypeEnum.NEIBHBORHOOD].includes(this.locationSelected.type)
          ? this.locationSelected.state
          : undefined,
      neighborhood:
        this.locationSelected && this.locationSelected.type === PlaceTypeEnum.NEIBHBORHOOD
          ? this.locationSelected.neighborhood
          : undefined,
      googlePlace:
        this.locationSelected?.type === PlaceTypeEnum.GOOGLE_PLACES ? this.locationSelected.label : undefined,
      lat: this.locationSelected?.lat,
      lng: this.locationSelected?.lng,
      radius: this.locationSelected?.radius,
      plan: '-1',
      page: 1,
      take: 12,
    });

    this.router.navigate(['/room/list'], { queryParams: searchInput });
    this.close();
  }

}
