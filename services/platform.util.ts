import { isPlatformBrowser } from '@angular/common';

export class PlatformUtils {
  private static platformId: Object;

  static setPlatformId(platformId: Object): void {
    PlatformUtils.platformId = platformId;
  }

  static isBrowser(): boolean {
    if (!PlatformUtils.platformId) {
      console.log('Platform ID is not set.');
    }
    return isPlatformBrowser(PlatformUtils.platformId);
  }
}