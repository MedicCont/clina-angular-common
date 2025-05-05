import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    TemplateRef,
    ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { AuthenticationService } from "app/modules/authentication/authentication.service";
import { RoomFavoriteDto } from "app/modules/common/dtos/room-favorite.dto";
import { RoomFavoriteCreateInput } from "app/modules/common/inputs/room-favorite-create.input";
import { RoomFavoriteRemoveInput } from "app/modules/common/inputs/room-favorite-remove.input";
import { environment } from "environments/environment";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { RoomDto } from "../../dtos/room.dto";
import { FavoriteButtonService } from "../../services/favorite-button.service";

@Component({
  selector: "clina-room-favorite-button",
  templateUrl: "./favorite-button.component.html",
  styleUrls: ["./favorite-button.component.scss"],
})
export class FavoriteButtonComponent implements OnInit {
  @Input() room?: RoomDto;
  @Output() reloadAction = new EventEmitter<boolean>(false);
  @ViewChild("loginModal") loginModal?: TemplateRef<any>;
  isAuthenticated: boolean = true;
  isFavoriting = false;
  favoriteId?: string;
  modalRef?: BsModalRef;

  isFavorite?: boolean;

  favoriteLoginModalNavigation?: string;

  hasAccountData = false;

  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly favoriteService: FavoriteButtonService,
    private readonly modalService: BsModalService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    // this.authenticationService.$account.subscribe(
    //   (account: AccountDto | undefined) => {
    //     this.hasAccountData = account ? true : false;
    //   }
    // );
    this.authenticationService.$authenticated.subscribe(
      (isAutenticated: boolean) => {
        this.isAuthenticated = isAutenticated;
        if (this.isAuthenticated) {
          this.getFavorite();
        }
      }
    );
  }

  getFavorite() {
    this.favoriteService.favoriteList.subscribe({
      next: (favoriteList: RoomFavoriteDto[]) => {
        favoriteList.map((room: RoomFavoriteDto) => {
          if (room.roomId === this.room?.roomId) {
            this.favoriteId = room.roomFavoriteId;
            this.isFavorite = true;
          }
          return room;
        });
      },
    });
  }

  favoriteRoom() {
    if (!this.room) return;
    if (this.isAuthenticated) {
      this.isFavoriting = true;
      this.isFavorite = true;
      const createInput: RoomFavoriteCreateInput = {
        roomId: this.room.roomId,
      };
      this.favoriteService.createFavoriteRoom(createInput).subscribe({
        error: () => {
          this.isFavorite = false;
          throw new Error("It was not possible to favorite this room");
        },
        complete: () => {
          this.isFavoriting = false;
          this.favoriteService.updateRoomList();
        },
      });
    } else {
      const url = this.router.url;
      const splitUrl = url.split(`https://${environment.psUrl}`);
      this.favoriteLoginModalNavigation = splitUrl[0];
      this.openModal(this.loginModal as TemplateRef<any>);
    }
  }

  removeFavoriteRoom() {
    if (!this.favoriteId) return;
    this.isFavorite = false;
    this.isFavoriting = true;
    const removeInput: RoomFavoriteRemoveInput = {
      roomFavoriteId: this.favoriteId,
    };
    this.favoriteService.removeFavoriteRoom(removeInput).subscribe({
      complete: () => {
        this.isFavoriting = false;
        this.favoriteService.updateRoomList();
      },
    });
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {
      class: "modal-dialog-centered modal-md",
    });
  }
}
