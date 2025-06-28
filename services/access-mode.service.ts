import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, Renderer2, RendererFactory2 } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { AccessModeEnum } from 'app/modules/common/enums/access-mode.enum';
import { BehaviorSubject, filter } from "rxjs";
import { AccessModeStateService } from "./access-mode-state.service";

@Injectable({ providedIn: 'root' })
export class AccessModeService {
  private renderer: Renderer2;
  public $accessMode: BehaviorSubject<AccessModeEnum>;
  private baseHref: string = '/dashboard'; // Adicione o baseHref

  constructor(
    rendererFactory: RendererFactory2,
    private readonly router: Router,
    private stateService: AccessModeStateService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.$accessMode = new BehaviorSubject<AccessModeEnum>(this.stateService.getMode());

    if (isPlatformBrowser(this.platformId)) {
      // Detectar o baseHref a partir do elemento base no HTML
      const baseElement = document.querySelector('base');
      if (baseElement && baseElement.getAttribute('href')) {
        let href = baseElement.getAttribute('href') || '';
        // Remover barras no início e fim
        href = href.replace(/^\/|\/$/g, '');
        if (href) {
          this.baseHref = '/' + href;
        }
      }

      this.router.events
        .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
        .subscribe((event) => {
          const url = event.urlAfterRedirects;
          if (url.includes('/host/')) {
            this.load(AccessModeEnum.HOST);
          } else if (!url.includes('/auth/') && !url.includes('/first-access/')) {
            this.load(AccessModeEnum.HEALTH_PERSON);
          }
        });
    }
  }

  load(mode: AccessModeEnum) {
    this.stateService.setMode(mode);
    this.$accessMode.next(mode);
    
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    
    if (mode === AccessModeEnum.HEALTH_PERSON) {
      document.documentElement.setAttribute('data-bs-theme', 'ps');
      this.renderer.removeClass(document.body, 'hostMode');
      this.renderer.addClass(document.body, 'psMode');
    } else {
      document.documentElement.setAttribute('data-bs-theme', 'HOST');
      this.renderer.removeClass(document.body, 'psMode');
      this.renderer.addClass(document.body, 'hostMode');
    }
    //window.location.href = mode === AccessModeEnum.HOST ? environment.dashboardUrl : environment.psUrl + '/ps';
  }

  navigateTo(path: string) {
    const mode = this.stateService.getMode();
    const prefix = mode === AccessModeEnum.HOST ? '/host' : '';
    
    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    
    // Construct full path with mode prefix
    const fullPath = prefix + '/' + cleanPath;
    this.router.navigateByUrl(fullPath);
  }

  changeMode(mode: AccessModeEnum, path?: string) {
    if (mode === this.stateService.getMode() && !path) {
      return;
    }

    const currentPath = path || this.extractCurrentPath();
    
    if (mode === AccessModeEnum.HOST) {
      this.router.navigateByUrl('/host/' + currentPath);
    } else {
      this.router.navigateByUrl('/' + currentPath);
    }
  }

  private extractCurrentPath(): string {
    const url = this.router.url;
    // Remove prefixos de modo
    if (url.startsWith('/host/')) {
      return url.substring(6); // Remove '/host/'
    } else if (url.startsWith('/')) {
      return url.substring(1); // Remove '/'
    }
    return url;
  }

  getCurrentMode() {
    return this.stateService.getMode();
  }
}