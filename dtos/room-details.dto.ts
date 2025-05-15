import { RoomTypeEnum } from "../enums/room-type.enum";
import { PackageOfHourDto } from "./package-of-hour.dto";

export class RoomDetailsDto {

  roomId: string;
  name: string;
  description: string;
  code: string;
  advance: number;
  types: RoomTypeEnum[];
  images: string[];
  minPrice: number;

  // Clinic
  clinicId: string;
  clinicName: string;
  zipcode: string;
  address: string;
  addressNumber: string;
  addressComplement?: string;
  neighborhood: string;
  city: string;
  state: string;
  lat: number | null;
  lng: number | null;

  // Relations
  packagesOfHours: PackageOfHourDto[];
}