import { SystemEnum } from "../enums/system.enum";

export interface NavbarItemDto {
  title: string;
  menuUrl: string;
  lucideIcon: string;
  isActive: boolean;
  mode: 'HOST' | 'PS' | 'BOTH';
  system: SystemEnum;
  url: string;
  requiresSaaS?: boolean;
}
