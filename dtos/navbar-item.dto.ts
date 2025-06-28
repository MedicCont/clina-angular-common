import { SystemEnum } from "../enums/system.enum";

export interface NavbarItemDto {
  title: string;
  img?: string;
  menuUrl: string;
  icon?: string;
  imgWhite?: string;
  isActive: boolean;
  mode: 'HOST' | 'PS' | 'BOTH';
  system: SystemEnum;
  url:string;
}
