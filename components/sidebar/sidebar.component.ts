import { Component, Input, OnDestroy, OnInit, Renderer2 } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { AuthenticationService } from "app/modules/authentication/authentication.service";
import { AccessModeService } from "app/modules/common/services/access-mode.service";
import { environment } from "environments/environment";
import { BehaviorSubject, Observable, Subscription, map } from "rxjs";
import { filter } from "rxjs/operators";
import { NavbarItemDto } from "../../dtos/navbar-item.dto";
import { AccessModeEnum } from "../../enums/access-mode.enum";
import { SystemEnum } from "../../enums/system.enum";
import { PlatformUtils } from "../../services/platform.util";
import { SidebarService } from "../../services/sidebar.service";

// Enum
enum ItemModeEnum {
  HOST = 'HOST',
  PS = 'PS',
  BOTH = 'BOTH'
}

@Component({
  selector: "clina-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() isAuthenticated: boolean = false;
  public AccessModeEnum = AccessModeEnum;
  private accessModeSubject = new BehaviorSubject<AccessModeEnum>(
    AccessModeEnum.HEALTH_PERSON
  );
  public accessMode$ = this.accessModeSubject.asObservable();
  public dashboardUrl = environment.dashboardUrl;
  public isMobile = false;
  public items$: Observable<NavbarItemDto[]>;

  // 💡 1. Criamos um BehaviorSubject local para controlar a visibilidade
  private isVisibleSubject = new BehaviorSubject<boolean>(false);
  public isVisible$ = this.isVisibleSubject.asObservable();

  private routerSubscription?: Subscription;
  private serviceShowSubscription?: Subscription; // Para ouvir o serviço
  public isSidebarHovered = false;
  public psUrl = environment.psUrl;
  public SystemEnum = SystemEnum;
  public sourceSystem = environment.systemName;

  constructor(
    private readonly sidebarService: SidebarService,
    private readonly router: Router,
    private readonly authenticationService: AuthenticationService,
    private readonly renderer: Renderer2,
    private readonly accessModeService: AccessModeService
  ) {
    this.items$ = this.accessMode$.pipe(
      map((accessMode) => this.getItems(accessMode))
    );
  }

  ngOnInit(): void {
    this.serviceShowSubscription = this.sidebarService.$show.subscribe(shouldShow => {
      if (shouldShow) {
        this.isVisibleSubject.next(true);
      }
    });


      this.isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );

    this.accessModeService.$accessMode.subscribe(
      (accessMode: AccessModeEnum) => {
        this.accessModeSubject.next(accessMode);
      }
    );

    // A lógica de fechar ao navegar continua a mesma
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (this.isMobile) {
        this.hideSidebar();
      }
    });
  }

  // 💡 3. O método hideSidebar agora atualiza DIRETAMENTE o nosso subject local
  hideSidebar() {
    this.isVisibleSubject.next(false);
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
    this.serviceShowSubscription?.unsubscribe(); // Limpa a inscrição do serviço
    if (PlatformUtils.isBrowser())
      this.renderer.removeClass(document.body, "no-scroll");
  }

  // --- O RESTANTE DO CÓDIGO PERMANECE IGUAL ---
  getItems(accessMode: AccessModeEnum): NavbarItemDto[] {
    var items = [
      {
        title: "Home",
        img: "/common-assets/images/sidebar/icon-home-solid.svg",
        imgWhite: "/common-assets/images/sidebar/white/icon-home-solid.svg",
        menuUrl: "/ps",
        isActive: true,
        mode: ItemModeEnum.PS,
        system: SystemEnum.DASHBOARD,
        url:""
      },
      {
        title: "Home",
        img: "/common-assets/images/sidebar/icon-home-solid.svg",
        imgWhite: "/common-assets/images/sidebar/white/icon-home-solid.svg",
        menuUrl: "/",
        isActive: true,
        mode: ItemModeEnum.HOST,
        system: SystemEnum.DASHBOARD,
        url:""
      },
      {
        title: "Minha Conta",
        img: "/common-assets/images/sidebar/icon-account-solid.svg",
        imgWhite: "/common-assets/images/sidebar/white/icon-account-solid.svg",
        menuUrl: "/account",
        isActive: true,
        mode: ItemModeEnum.BOTH,
        system: SystemEnum.DASHBOARD,
        url:""
      },
      {
        title: "Compras",
        img: "/common-assets/images/sidebar/icon-purchases-solid.svg",
        imgWhite:
          "/common-assets/images/sidebar/white/icon-purchases-solid.svg",
        menuUrl: "/purchase",
        isActive: true,
        mode: ItemModeEnum.PS,
        system: SystemEnum.DASHBOARD,
        url:""
      },
      {
        title: "Assinaturas",
        icon: "icon-calendar-check-2",
        menuUrl: "/subscription/management",
        isActive: false,
        mode: ItemModeEnum.PS,
        system: SystemEnum.DASHBOARD,
        url:""
      },
      {
        title: "Reservas",
        img: "/common-assets/images/sidebar/icon-appointments-solid.svg",
        imgWhite:
          "/common-assets/images/sidebar/white/icon-appointments-solid.svg",
        menuUrl: "/appointment/host",
        isActive: true,
        mode: ItemModeEnum.HOST,
        system: SystemEnum.DASHBOARD,
        url:""
      },
      {
        title: "Consultórios",
        img: "/common-assets/images/sidebar/room-icon.svg",
        imgWhite: "/common-assets/images/sidebar/white/room-icon.svg",
        menuUrl: "/room",
        isActive: true,
        mode: ItemModeEnum.HOST,
        system: SystemEnum.DASHBOARD,
        url:""
      },
      {
        title: "Check-In/Out",
        img: "/common-assets/images/sidebar/icon-checkinout.svg",
        imgWhite: "/common-assets/images/sidebar/white/icon-checkinout.svg",
        menuUrl: "/check",
        isActive: true,
        mode: ItemModeEnum.HOST,
        system: SystemEnum.DASHBOARD,
        url:""
      },
      {
        title: "SaaS",
        img: "/common-assets/images/sidebar/icon-saas.svg",
        imgWhite: "/common-assets/images/sidebar/white/icon-saas.svg",
        menuUrl: "/saas",
        isActive: true,
        mode: ItemModeEnum.HOST,
        system: SystemEnum.DASHBOARD,
        url:""
      },
      {
        title: "Agenda",
        img: "/common-assets/images/sidebar/icon-schedule-solid.svg",
        imgWhite: "/common-assets/images/sidebar/white/icon-schedule-solid.svg",
        menuUrl: "/my-schedule",
        isActive: true,
        mode: ItemModeEnum.PS,
        system: SystemEnum.DASHBOARD,
        url:""
      },
      {
        title: "Notificações",
        img: "/common-assets/images/sidebar/icon-bell-solid.svg",
        imgWhite: "/common-assets/images/sidebar/white/icon-bell-solid.svg",
        menuUrl: "/notification",
        isActive: true,
        mode: ItemModeEnum.BOTH,
        system: SystemEnum.DASHBOARD,
        url:""
      },
      {
        title: "Extrato Financeiro",
        img: "/common-assets/images/sidebar/icon-money-solid.svg",
        imgWhite: "/common-assets/images/sidebar/white/icon-money-solid.svg",
        menuUrl: "/statement",
        isActive: true,
        mode: ItemModeEnum.BOTH,
        system: SystemEnum.DASHBOARD,
        url:""
      },
      {
        title: "Ganhe Créditos",
        img: "/common-assets/images/sidebar/icon-indication-earns-solid.svg",
        imgWhite:
          "/common-assets/images/sidebar/white/icon-indication-earns-solid.svg",
        menuUrl: "/get-member",
        isActive: true,
        mode: ItemModeEnum.BOTH,
        system: SystemEnum.DASHBOARD,
        url:""
      },
      {
        title: "Favoritos",
        img: "/common-assets/images/sidebar/icon-favorite-solid.svg",
        imgWhite: "/common-assets/images/sidebar/white/icon-favorite-solid.svg",
        menuUrl: "/room-favorite",
        isActive: true,
        mode: ItemModeEnum.PS,
        system: SystemEnum.MARKETPLACE,
        url:""
      },
    ];

    items = items.filter((item) => {
      if (!item.isActive) return false;
      if (item.mode === ItemModeEnum.BOTH) return true;
      if (item.mode === ItemModeEnum.HOST && accessMode === AccessModeEnum.HOST) return true;
      if (item.mode === ItemModeEnum.PS && accessMode === AccessModeEnum.HEALTH_PERSON) return true;
      return false;
    });

    const currentMode = this.accessModeSubject.getValue();
    items = items.map(item=>{
      var menuUrl = item.menuUrl.startsWith("/") ? item.menuUrl.substring(1) : item.menuUrl;
      var baseUrl = "";

      if(this.sourceSystem==SystemEnum.DASHBOARD){
        if(item.system===SystemEnum.MARKETPLACE){
          baseUrl = this.psUrl.endsWith("/") ? this.psUrl : this.psUrl + "/";
        }
        if (currentMode === AccessModeEnum.HOST) {
          baseUrl += 'host/';
        }
      }

      if(this.sourceSystem==SystemEnum.MARKETPLACE){
        if(item.system===SystemEnum.DASHBOARD){
          baseUrl = this.dashboardUrl.endsWith("/") ? this.dashboardUrl : this.dashboardUrl + "/";
          if (currentMode === AccessModeEnum.HOST) {
            baseUrl += 'host/';
          }
        }
      }
      item.url = baseUrl + menuUrl;
      return item;
    });
    return items;
  }

  goToHome() {
    const currentMode = this.accessModeSubject.getValue();
    if (currentMode === AccessModeEnum.HOST) {
      this.router.navigate(["/host"]);
    } else {
      this.router.navigate(["/"]);
    }
  }

  toggleAccessMode(mode: AccessModeEnum) {
    if (mode === this.accessModeSubject.getValue()) {
      return;
    }

    const currentUrl = this.router.url;
    const isInDashboard = currentUrl.includes('/dashboard/');
    const isInMarketplace = !isInDashboard;

    if (mode === AccessModeEnum.HOST) {
      if (isInMarketplace) {
        window.location.href = this.dashboardUrl.endsWith('/')
          ? `${this.dashboardUrl}host`
          : `${this.dashboardUrl}/host`;
      } else {
        let currentPath = currentUrl;
        if (currentPath.startsWith('/host/')) {
          currentPath = currentPath.substring(6);
        } else if (currentPath.startsWith('/')) {
          currentPath = currentPath.substring(1);
        }
        this.router.navigate([`/host/${currentPath}`]);
      }
    } else {
      let currentPath = currentUrl;
      if (currentPath.startsWith('/host/')) {
        currentPath = currentPath.substring(6);
      } else if (currentPath.startsWith('/')) {
        currentPath = currentPath.substring(1);
      }
      this.router.navigate([`/${currentPath}`]);
    }
    this.accessModeService.load(mode);
  }

  onMouseEnter() {
    this.isSidebarHovered = true;
  }

  onMouseLeave() {
    this.isSidebarHovered = false;
  }

  logout() {
    this.authenticationService.signOut();
  }
}