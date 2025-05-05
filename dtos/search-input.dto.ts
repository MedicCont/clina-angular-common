import { RoomTypeDto } from './room-type.dto';

export interface SearchInput {
  page?: number;
  take?: number;
  begin: string;
  end: string;
  neighborhood?: string;
  lat: number;
  lng: number;
  radius?: number;
  period?: string | null;
  plan?: string;
  roomTypes: RoomTypeDto[];
  roomAmenities: string[];
  clinicAmenities: string[];
  equipments: string[];
  city?: string;
  state?: string;
  googlePlace?: string;
  hasDiscount?: boolean;
  maxValue?: number;
  cancelAdvance?: number;
  order?: string;
}
