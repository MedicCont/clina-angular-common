import { Component, Input, OnDestroy, OnInit, Renderer2 } from "@angular/core";
import { Router } from "@angular/router";

import { AuthenticationService } from "app/modules/authentication/authentication.service";
import { AccessModeService } from "app/modules/common/services/access-mode.service";
import { environment } from "environments/environment";
import { BehaviorSubject, Observable, Subscription, map } from "rxjs";
import { NavbarItemDto } from "../../dtos/navbar-item.dto";
import { AccessModeEnum } from "../../enums/access-mode.enum";
import { SystemEnum } from "../../enums/system.enum";
import { PlatformUtils } from "../../services/platform.util";
import { SidebarService } from "../../services/sidebar.service";

// Enum para definir em quais modos um item deve aparecer
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
  public AccessModeEnum = AccessModeEnum; // Exponha o enum para o template
  private accessModeSubject = new BehaviorSubject<AccessModeEnum>(
    AccessModeEnum.HEALTH_PERSON
  );
  public accessMode$ = this.accessModeSubject.asObservable();
  public dashboardUrl = environment.dashboardUrl;
  public isMobile = false;
  public showNavbar$!: Observable<boolean>;
  public items$: Observable<NavbarItemDto[]>;

  private showNavbarSubscription?: Subscription;
  public isSidebarHovered = false; // Controla se o sidebar está com hover
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
    this.showNavbar$ = this.sidebarService.$show; // Use o observable diretamente

    if (PlatformUtils.isBrowser()) {
      this.isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
    }
    this.accessModeService.$accessMode.subscribe(
      (accessMode: AccessModeEnum) => {
        this.accessModeSubject.next(accessMode);
      }
    );
  }

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

    // Filtra os itens com base no modo atual
    items = items.filter((item) => {
      if (!item.isActive) return false;
      
      if (item.mode === ItemModeEnum.BOTH) return true;
      if (item.mode === ItemModeEnum.HOST && accessMode === AccessModeEnum.HOST) return true;
      if (item.mode === ItemModeEnum.PS && accessMode === AccessModeEnum.HEALTH_PERSON) return true;
      
      return false;
    });

    //identificar o source system

    // Se for um item de navegação interna
    const currentMode = this.accessModeSubject.getValue();

    items = items.map(item=>{

      var menuUrl = item.menuUrl.startsWith("/")
      ? item.menuUrl.substring(1)
      : item.menuUrl;
  
      var baseUrl = "";

      if(this.sourceSystem==SystemEnum.DASHBOARD){//Para o dashboard marketplace é externo
        if(item.system===SystemEnum.MARKETPLACE){ //link externo clina marketplace
          baseUrl = this.psUrl.endsWith("/")
          ? this.psUrl
          : this.psUrl + "/";
        }

        if (currentMode === AccessModeEnum.HOST) {
          baseUrl += 'host/';
        }
      }

      if(this.sourceSystem==SystemEnum.MARKETPLACE){//Para o marketplace dashboard é externo
        if(item.system===SystemEnum.DASHBOARD){ //link externo clina marketplace
          baseUrl = this.dashboardUrl.endsWith("/")
          ? this.dashboardUrl
          : this.dashboardUrl + "/";
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

  hideSidebar() {
    this.sidebarService.hide();
  }

  toggleAccessMode(mode: AccessModeEnum) {
  if (mode === this.accessModeSubject.getValue()) {
    return; // Se já estiver no modo desejado, não faz nada
  }

  const currentUrl = this.router.url;
  const isInDashboard = currentUrl.includes('/dashboard/');
  const isInMarketplace = !isInDashboard;

  if (mode === AccessModeEnum.HOST) {
    if (isInMarketplace) {
      // Redireciona para dashboardUrl/host
      window.location.href = this.dashboardUrl.endsWith('/')
        ? `${this.dashboardUrl}host`
        : `${this.dashboardUrl}/host`;
    } else {
      // Mantém navegação interna no dashboard
      let currentPath = currentUrl;
      if (currentPath.startsWith('/host/')) {
        currentPath = currentPath.substring(6); // Remove '/host/'
      } else if (currentPath.startsWith('/')) {
        currentPath = currentPath.substring(1); // Remove '/'
      }
      this.router.navigate([`/host/${currentPath}`]);
    }
  } else {
    // Modo HEALTH_PERSON
    let currentPath = currentUrl;
    if (currentPath.startsWith('/host/')) {
      currentPath = currentPath.substring(6); // Remove '/host/'
    } else if (currentPath.startsWith('/')) {
      currentPath = currentPath.substring(1); // Remove '/'
    }
    this.router.navigate([`/${currentPath}`]);
  }

  // Atualiza o modo no serviço
  this.accessModeService.load(mode);
}

  onMouseEnter() {
    this.isSidebarHovered = true;
  }

  onMouseLeave() {
    this.isSidebarHovered = false;
  }

  ngOnDestroy(): void {
    this.showNavbarSubscription?.unsubscribe();
    if (PlatformUtils.isBrowser())
      this.renderer.removeClass(document.body, "no-scroll");
  }

  logout() {
    this.authenticationService.signOut();
  }
}