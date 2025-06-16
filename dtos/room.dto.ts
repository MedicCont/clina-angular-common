import { PackageOfHourDto } from "./package-of-hour.dto";

export interface RoomDto {
  roomId: string;
  ownerAccountId: string;
  name: string;
  description: string;
  code: string;
  advance: number;
  images: string[];
  minPrice: number;
  appointmentStepMinutes: number;
  appointmentMinimumMinutes: number;
  opensAt: string;
  closesAt: string;
  ratingScore?: number | null;
  clinicId: string;
  clinicName: string;
  zipcode: string;
  address: string;
  addressNumber: string;
  addressComplement?: string;
  neighborhood: string;
  city: string;
  state: string;
  lat?: number | null;
  lng?: number | null;
  gmaps?: string | null;
  clinicAmenities: string[];
  sellingPeriodsList: any;
  isRoomOpen?: boolean;
  packagesOfHours: PackageOfHourDto[];
  types?: string[];
}
