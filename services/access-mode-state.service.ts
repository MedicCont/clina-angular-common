import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { AccessModeEnum } from 'app/modules/common/enums/access-mode.enum';

@Injectable({ providedIn: 'root' })
export class AccessModeStateService {
  private currentMode: AccessModeEnum;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.currentMode = this.getInitialMode();
  }

  private getInitialMode(): AccessModeEnum {
    if (isPlatformBrowser(this.platformId)) {
      // Primeiro tenta obter do localStorage
      const storedMode = localStorage.getItem('accessMode');
      if (storedMode) {
        return storedMode as AccessModeEnum;
      }
      
      // Se não houver no localStorage, verifica a URL
      const path = window.location.pathname;
      if (path.includes('/host/')) {
        return AccessModeEnum.HOST;
      }
    }
    
    // Valor padrão
    return AccessModeEnum.HEALTH_PERSON;
  }

  setMode(mode: AccessModeEnum) {
    this.currentMode = mode;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('accessMode', mode);
    }
  }

  getMode(): AccessModeEnum {
    return this.currentMode;
  }
}