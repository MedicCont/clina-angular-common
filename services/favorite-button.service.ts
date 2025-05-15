import { Injectable } from "@angular/core";
import { ApolloQueryResult } from "@apollo/client/core";
import { Apollo } from "apollo-angular";
import { AuthenticationService } from "app/modules/authentication/authentication.service";
import { BehaviorSubject, Observable, map } from "rxjs";
import { RoomFavoriteDto } from "../dtos/room-favorite.dto";
import { RoomFavoriteCreateInput } from "../inputs/room-favorite-create.input";
import { RoomFavoriteRemoveInput } from "../inputs/room-favorite-remove.input";
import { ROOMS_FAVORITE_CREATE_MUTATION } from "../mutations/favorite-rooms-create.mutation";
import { ROOMS_FAVORITE_REMOVE_MUTATION } from "../mutations/favorite-rooms-remove.mutation";
import { ROOMS_FAVORITE_QUERY } from "../queries/favorite-rooms.query";

@Injectable({
  providedIn: "root",
})
export class FavoriteButtonService {
  public favoriteList = new BehaviorSubject<RoomFavoriteDto[]>([]);
  public isLoading = new BehaviorSubject<boolean>(true);

  constructor(
    private readonly apollo: Apollo,
    private readonly authenticationService: AuthenticationService
  ) {
    this.authenticationService.$authenticated.subscribe({
      next: (authenticated) => {
        if (authenticated === true) {
          this.updateRoomList();
        }
      },
    });
  }

  getFavoriteRooms(): Observable<RoomFavoriteDto[]> {
    return this.apollo
      .query({
        query: ROOMS_FAVORITE_QUERY,
      })
      .pipe(map((res: any) => res.data.roomsFavorite));
  }

  createFavoriteRoom(
    roomFavoriteCreateInput: RoomFavoriteCreateInput
  ): Observable<ApolloQueryResult<Boolean>> {
    return this.apollo
      .mutate({
        mutation: ROOMS_FAVORITE_CREATE_MUTATION,
        variables: { roomFavoriteCreateInput },
      })
      .pipe(map((res: any) => res.data.createFavoriteRoom));
  }

  removeFavoriteRoom(
    roomFavoriteRemoveInput: RoomFavoriteRemoveInput
  ): Observable<ApolloQueryResult<Boolean>> {
    return this.apollo
      .query({
        query: ROOMS_FAVORITE_REMOVE_MUTATION,
        variables: { roomFavoriteRemoveInput },
      })
      .pipe(map((res: any) => res.data.removeFavoriteRoom));
  }

  updateRoomList() {
    this.getFavoriteRooms().subscribe({
      next: (favoriteRooms: RoomFavoriteDto[]) => {
        this.isLoading.next(false);
        this.favoriteList.next(favoriteRooms);
      },
      error: () => {
        this.isLoading.next(false);
      },
    });
  }
}
