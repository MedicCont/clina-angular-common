import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { HourAvailable } from "app/modules/common/dtos/hour-available.dto";
import {
  PackageOfHourDto,
  RoomPackageOfHoursTypeEnum,
} from "app/modules/common/dtos/package-of-hour.dto";
import { RoomFavoriteDto } from "app/modules/common/dtos/room-favorite.dto";
import { RoomDto } from "app/modules/common/dtos/room.dto";
import { FavoriteButtonService } from "app/modules/common/services/favorite-button.service";
import { UnleashService } from "app/services/unleash.service";
import { environment } from "environments/environment";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { SearchInput } from "../../dtos/search-input.dto";
import { RoomCardService } from "../../services/room-card.service";
import { RoomShowcaseItemSuccessSharedModalComponent } from "../room-showcase-item-success-shared-modal/room-showcase-item-success-shared-modal.component";
import { RoomShowcaseDto } from "../../dtos/room-showcase.dto";

@Component({
  selector: "clina-room-showcase-item-card",
  templateUrl: "./room-showcase-item-card.component.html",
  styleUrls: ["./room-showcase-item-card.component.scss"],
})
export class RoomShowcaseItemCardComponent implements OnInit {
  @Input() room?: RoomShowcaseDto;
  @Input() start?: string;
  @Input() end?: string;
  @Input() period?: string;
  @Input() plan?: string;
  @Input() neighborhood?: string;
  @Input() searchInput?: SearchInput;
  @Input() showMap: boolean = false;
  @Output() reloadAction = new EventEmitter<void>();

  roomType: any = {
    TRADITIONAL: "Tradicional",
    DENTAL: "Odonto",
    PHYSICAL_EXAM: "Ex. Físico",
    DIVAN: "Divã/Sofá",
    FIT: "Mesa/Cad",
    OTHERS: "Outros",
  };

  imageRoomType: any = {
    TRADITIONAL: "/common-assets/images/layout-images/traditional-small.svg",
    DENTAL: "/common-assets/images/layout-images/odonto-small.svg",
    PHYSICAL_EXAM: "/common-assets/images/layout-images/physical-small.svg",
    DIVAN: "/common-assets/images/layout-images/diva-small.svg",
    FIT: "/common-assets/images/layout-images/typeroom-fit-small.svg",
    OTHERS: "/common-assets/images/layout-images/typeroom-others-small.svg",
  };

  chosenPlan?: string;
  s3name = environment.s3nameFiles;

  modalRef?: BsModalRef;

  copied = false;

  isFavorite?: boolean;

  discountTypes: any[] = [];

  RoomPackageOfHoursTypeEnum = RoomPackageOfHoursTypeEnum;

  isRatingEnabled = this.unleashService.isEnabled("ps-rating");

  public get routeToRoom(): string {
    let route = [
      "room",
      this.room?.code,
      this.room?.neighborhood,
      this.room?.city,
      this.room?.state,
      this.room?.name,
    ];
    route = route.map((r) => {
      r = r?.replace(/\s+/g, "-").toLowerCase();
      return r;
    });
    return "/" + route.join("/");
  }

  constructor(
    private readonly modalService: BsModalService,
    private readonly roomCardService: RoomCardService,
    private readonly unleashService: UnleashService,
    private readonly favoriteService: FavoriteButtonService
  ) {}

  ngOnInit() {
    this.discountTypes = this.room
      ? [
          {
            title: "Descontos para horas consecutivas",
            type: RoomPackageOfHoursTypeEnum.CONSECUTIVE_HOURS,
            packages: this.room.packagesOfHours
              .filter(
                (pack: any) =>
                  pack.type === RoomPackageOfHoursTypeEnum.CONSECUTIVE_HOURS
              )
              .sort(
                (a: PackageOfHourDto, b: PackageOfHourDto) =>
                  a.amountOfHours - b.amountOfHours
              ),
          },
          {
            title: "Descontos para horas não consecutivas",
            type: RoomPackageOfHoursTypeEnum.NON_CONSECUTIVE_HOURS,
            packages: this.room.packagesOfHours
              .filter(
                (pack: any) =>
                  pack.type === RoomPackageOfHoursTypeEnum.NON_CONSECUTIVE_HOURS
              )
              .sort(
                (a: PackageOfHourDto, b: PackageOfHourDto) =>
                  a.amountOfHours - b.amountOfHours
              ),
          },
        ]
      : [];

    this.favoriteService.favoriteList.subscribe({
      next: (roomsFavorite: RoomFavoriteDto[]) => {
        this.isFavorite =
          roomsFavorite.find((room) => room.roomId === this.room?.roomId) !==
          undefined;
      },
    });
  }

  minHourValue(availabilities: HourAvailable[]): number {
    return Math.min(...availabilities.map((x) => x.value));
  }

  openSuccessModal() {
    if (this.room) {
      var roomSet = Object.assign(<RoomDto>{}, this.room);
      this.roomCardService.setRoom(roomSet);
      this.modalRef = this.modalService.show(
        RoomShowcaseItemSuccessSharedModalComponent,
        {
          class: "modal-dialog-centered modal-md share-modal",
        }
      );
    }
  }

  get location(): string {
    return `Em ${this.room?.address} /
      ${this.room?.neighborhood} /
      ${this.room?.city} /
      ${this.room?.state}`;
  }

  reloadFavorites() {
    this.reloadAction.emit();
  }
}
