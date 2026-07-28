import { RoomStatusEnum } from "../enums/room-status.enum";
import { PackageOfHourDto } from "./package-of-hour.dto";

export class RoomShowcaseDto{
    roomId:string;
    clinicId:string;
    code: string;
    name: string;
    description: string;
    images?: string[];
    videos?: string[];
    types?: string[];
  ratingScore?: number | null;
    advance?: number;
    minPrice?: number | null;
    /* Mensal ativo manda no card: a sala é vendida por mês e o preço/hora não aparece.
       Mesma regra do card da vitrine do marketplace. */
    monthlyLeasePrice?: number | null;
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