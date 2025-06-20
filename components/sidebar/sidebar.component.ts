import { Component, Input, OnDestroy, OnInit, Renderer2 } from "@angular/core";
import { Router } from "@angular/router";

import { AccessModeService } from "app/modules/account/services/access-mode.service";
import { AuthenticationService } from "app/modules/authentication/authentication.service";
import { environment } from "environments/environment";
import { BehaviorSubject, Observable, Subscription, map } from "rxjs";
import { NavbarItemDto } from "../../dtos/navbar-item.dto";
import { AccessModeEnum } from "../../enums/access-mode.enum";
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
  accessMode$ = this.accessModeSubject.asObservable();
  dashboardUrl = environment.dashboardUrl;
  isMobile = false;
  showNavbar$!: Observable<boolean>;
  items$: Observable<NavbarItemDto[]>;

  private showNavbarSubscription?: Subscription;
  isSidebarHovered = false; // Controla se o sidebar está com hover
  psUrl = environment.psUrl;

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
    const items = [
      {
        title: "Home",
        img: "/common-assets/images/sidebar/icon-home-solid.svg",
        imgWhite: "/common-assets/images/sidebar/white/icon-home-solid.svg",
        url: "/ps",
        isActive: true,
        mode: ItemModeEnum.PS,
        dashboard: false,
      },
      {
        title: "Home",
        img: "/common-assets/images/sidebar/icon-home-solid.svg",
        imgWhite: "/common-assets/images/sidebar/white/icon-home-solid.svg",
        url: "/",
        isActive: true,
        mode: ItemModeEnum.HOST,
        dashboard: true, // Home do host vai para dashboard externo
      },
      {
        title: "Minha Conta",
        img: "/common-assets/images/sidebar/icon-account-solid.svg",
        imgWhite: "/common-assets/images/sidebar/white/icon-account-solid.svg",
        url: "/account",
        isActive: true,
        mode: ItemModeEnum.BOTH,
        dashboard: true,
      },
      {
        title: "Compras",
        img: "/common-assets/images/sidebar/icon-purchases-solid.svg",
        imgWhite:
          "/common-assets/images/sidebar/white/icon-purchases-solid.svg",
        url: "/purchase",
        isActive: true,
        mode: ItemModeEnum.PS,
        dashboard: true,
      },
      {
        title: "Assinaturas",
        icon: "icon-calendar-check-2",
        url: "/subscription/management",
        isActive: true,
        mode: ItemModeEnum.PS,
        dashboard: true,
      },
      {
        title: "Reservas",
        img: "/common-assets/images/sidebar/icon-appointments-solid.svg",
        imgWhite:
          "/common-assets/images/sidebar/white/icon-appointments-solid.svg",
        url: "/appointment/host",
        isActive: true,
        mode: ItemModeEnum.HOST,
        dashboard: true,
      },
      {
        title: "Consultórios",
        img: "/common-assets/images/sidebar/room-icon.svg",
        imgWhite: "/common-assets/images/sidebar/white/room-icon.svg",
        url: "/room",
        isActive: true,
        mode: ItemModeEnum.HOST,
        dashboard: true,
      },
      {
        title: "Check-In/Out",
        img: "/common-assets/images/sidebar/icon-checkinout.svg",
        imgWhite: "/common-assets/images/sidebar/white/icon-checkinout.svg",
        url: "/check",
        isActive: true,
        mode: ItemModeEnum.PS,
        dashboard: false,
      },
      {
        title: "SaaS",
        img: "/common-assets/images/sidebar/icon-saas.svg",
        imgWhite: "/common-assets/images/sidebar/white/icon-saas.svg",
        url: "/saas",
        isActive: true,
        mode: ItemModeEnum.HOST,
        dashboard: true,
      },
      {
        title: "Agenda",
        img: "/common-assets/images/sidebar/icon-schedule-solid.svg",
        imgWhite: "/common-assets/images/sidebar/white/icon-schedule-solid.svg",
        url: "/my-schedule",
        isActive: true,
        mode: ItemModeEnum.BOTH,
        dashboard: false,
      },
      {
        title: "Notificações",
        img: "/common-assets/images/sidebar/icon-bell-solid.svg",
        imgWhite: "/common-assets/images/sidebar/white/icon-bell-solid.svg",
        url: "/notification",
        isActive: true,
        mode: ItemModeEnum.BOTH,
        dashboard: false,
      },
      {
        title: "Extrato Financeiro",
        img: "/common-assets/images/sidebar/icon-money-solid.svg",
        imgWhite: "/common-assets/images/sidebar/white/icon-money-solid.svg",
        url: "/statement",
        isActive: true,
        mode: ItemModeEnum.BOTH,
        dashboard: true,
      },
      {
        title: "Ganhe Créditos",
        img: "/common-assets/images/sidebar/icon-indication-earns-solid.svg",
        imgWhite:
          "/common-assets/images/sidebar/white/icon-indication-earns-solid.svg",
        url: "/get-member",
        isActive: true,
        mode: ItemModeEnum.BOTH,
        dashboard: true,
      },
      {
        title: "Favoritos",
        img: "/common-assets/images/sidebar/icon-favorite-solid.svg",
        imgWhite: "/common-assets/images/sidebar/white/icon-favorite-solid.svg",
        url: "/room-favorite",
        isActive: true,
        mode: ItemModeEnum.PS,
        dashboard: false,
      },
    ];

    // Filtra os itens com base no modo atual
    return items.filter((item) => {
      if (!item.isActive) return false;
      
      if (item.mode === ItemModeEnum.BOTH) return true;
      if (item.mode === ItemModeEnum.HOST && accessMode === AccessModeEnum.HOST) return true;
      if (item.mode === ItemModeEnum.PS && accessMode === AccessModeEnum.HEALTH_PERSON) return true;
      
      return false;
    });
  }

  getItemUrl(item: NavbarItemDto): string {
    // Se for um item que vai para o dashboard externo
    if (item.dashboard && (item.mode===ItemModeEnum.PS || item.mode===ItemModeEnum.BOTH)) {
      const baseUrl = this.dashboardUrl.endsWith("/")
        ? this.dashboardUrl
        : this.dashboardUrl + "/";
      const itemUrl = item.url.startsWith("/")
        ? item.url.substring(1)
        : item.url;
      return baseUrl + itemUrl;
    }

    // Se for um item de navegação interna
    const currentMode = this.accessModeSubject.getValue();

    // Limpa a URL do item removendo a barra inicial se existir
    const cleanUrl = item.url.startsWith("/")
      ? item.url.substring(1)
      : item.url;

      let url = cleanUrl;
    // Constrói a URL com base no modo atual
    if (currentMode === AccessModeEnum.HOST) {
      url= `/host/${cleanUrl}`;
    } else {
      url= `/${cleanUrl}`;
    }
   
    return url;
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

    // Extrai o caminho atual sem o prefixo de modo
    let currentPath = this.router.url;
    if (currentPath.startsWith("/host/")) {
      currentPath = currentPath.substring(6); // Remove '/host/'
    } else if (currentPath.startsWith("/")) {
      currentPath = currentPath.substring(1); // Remove '/'
    }

    // Navega para o mesmo caminho, mas com o prefixo do novo modo
    if (mode === AccessModeEnum.HOST) {
      this.router.navigate([`/host/${currentPath}`]);
    } else {
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