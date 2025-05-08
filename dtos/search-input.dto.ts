import { RoomTypeDto } from './room-type.dto';

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
  roomTypes: RoomTypeDto[];
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
