import { RoomTypeEnum } from '../enums/room-type.enum';

export interface SearchInput {
  //Room available filter input
  start: string;
  end: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  lat: number;
  lng: number;
  radius?: number;
  roomTypes: RoomTypeEnum[];
  roomAmenities: string[];
  clinicAmenities: string[];
  equipments: string[];
  maxValue?: number;
  hasDiscount?: boolean;
  cancelAdvance?: number;

  page?: number;
  take?: number;
  period?: string | null;
  order?: string;
  googlePlace?: string;
}
