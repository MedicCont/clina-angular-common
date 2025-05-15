import { RoomDetailsDto } from './room-details.dto';

export interface RoomFavoriteDto {
  favoriteId: string;
  ownerAccountId: string;
  roomOwnerAccountId: string;
  roomId: string;
  room: RoomDetailsDto;
}
