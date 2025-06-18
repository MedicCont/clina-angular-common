export interface NavbarItemDto {
  title: string;
  img?: string;
  url: string;
  icon?: string;
  imgWhite?: string;
  isActive: boolean;
  mode?: 'HOST' | 'PS' | 'BOTH';
  dashboard?: boolean;
}
