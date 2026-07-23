import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
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
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { RoomShowcaseDto } from "../../dtos/room-showcase.dto";
import { FavoriteButtonService } from "../../services/favorite-button.service";

@Component({
  selector: "clina-room-favorite-button",
  templateUrl: "./favorite-button.component.html",
  styleUrls: ["./favorite-button.component.scss"],
})
export class FavoriteButtonComponent implements OnInit, OnDestroy {
  @Input() room?: RoomShowcaseDto;
  @Output() reloadAction = new EventEmitter<boolean>(false);
  @ViewChild("loginModal") loginModal?: TemplateRef<any>;

  isAuthenticated = false;
  hasAccountData = false;
  isFavoriting = false;
  isFavorite = false;
  roomFavoriteId?: string;
  modalRef?: BsModalRef;
  favoriteLoginModalNavigation?: string;

  private destroy$ = new Subject<void>();

  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly favoriteService: FavoriteButtonService,
    private readonly modalService: BsModalService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.authenticationService.$account
      .pipe(takeUntil(this.destroy$))
      .subscribe((account) => {
        this.hasAccountData = !!account;
      });

    this.authenticationService.$authenticated
      .pipe(takeUntil(this.destroy$))
      .subscribe((isAuthenticated) => {
        this.isAuthenticated = isAuthenticated;
      });

    this.favoriteService.favoriteList
      .pipe(takeUntil(this.destroy$))
      .subscribe((favoriteList: RoomFavoriteDto[]) => {
        const match = favoriteList.find((r) => r.roomId === this.room?.roomId);
        this.isFavorite = !!match;
        this.roomFavoriteId = match?.roomFavoriteId;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  favoriteRoom() {
    if (!this.room) return;
    if (this.isAuthenticated) {
      this.isFavoriting = true;
      this.favoriteService.createFavoriteRoom({ roomId: this.room.roomId }).subscribe({
        next: () => {
          this.favoriteService.updateRoomList();
        },
        error: () => {
          this.isFavoriting = false;
        },
        complete: () => {
          this.isFavoriting = false;
        },
      });
    } else {
      const splitUrl = this.router.url.split(`https://${environment.psUrl}`);
      this.favoriteLoginModalNavigation = splitUrl[0];
      this.openModal(this.loginModal as TemplateRef<any>);
    }
  }

  removeFavoriteRoom() {
    if (!this.roomFavoriteId) return;
    this.isFavoriting = true;
    const removeInput: RoomFavoriteRemoveInput = { roomFavoriteId: this.roomFavoriteId };
    this.favoriteService.removeFavoriteRoom(removeInput).subscribe({
      next: () => {
        this.favoriteService.updateRoomList();
      },
      error: () => {
        this.isFavoriting = false;
      },
      complete: () => {
        this.isFavoriting = false;
      },
    });
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {
      class: "modal-dialog-centered modal-md",
    });
  }
}
