import { Injectable } from "@angular/core";
import { RoomDto } from "app/modules/common/dtos/room.dto";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: "root" })
export class RoomCardService {
  public room = new BehaviorSubject<RoomDto | undefined>(undefined);

  setRoom(room: RoomDto) {
    this.room.next(room);
  }
}
