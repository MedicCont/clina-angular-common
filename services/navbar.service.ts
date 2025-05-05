import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NavbarService {
  constructor(private http: HttpClient) {}

  getCoordinates(city: string, state: string, neighborhood?: string) {
    return this.http.get<any>(
      `${environment.restUrl}/maps/coordinates?address=${neighborhood}&city=${city}&state=${state}`
    );
  }

  getAddressAutoComplete(input: string) {
    return this.http.get<any>(
      `${environment.restUrl}/maps/autocomplete?input=${input}`
    );
  }

  getCoordinatesByPlaceId(placeId: string) {
    return this.http.get<any>(
      `${environment.restUrl}/maps/coordinates?placeId=${placeId}`
    );
  }
}
