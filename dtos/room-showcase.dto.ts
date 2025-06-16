import { RoomStatusEnum } from "../enums/room-status.enum";
import { PackageOfHourDto } from "./package-of-hour.dto";

export class RoomShowcaseDto{
    roomId:string;
    clinicId:string;
    code: string;
    name: string;
    description: string;
    images?: string[];
    types?: string[];
  ratingScore?: number | null;
    advance?: number;
    minPrice?:number;
    status?: RoomStatusEnum;
    packagesOfHours:PackageOfHourDto[];

    //Clinic
    clinicName: string;
    address: string;
    addressNumber: string;
    addressComplement?: string;
    neighborhood: string;
    city: string;
    state: string;
}