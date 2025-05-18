import { RoomDto } from '../../common/dtos/room.dto';

export interface RoomFavoriteDto {
  roomFavoriteId: string;
  ownerAccountId: string;
  roomOwnerAccountId: string;
  roomId: string;
  room: RoomDto;
}
