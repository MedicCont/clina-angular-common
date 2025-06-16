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

@Component({
  selector: "clina-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() isAuthenticated: boolean = false; 
  public AccessModeEnum = AccessModeEnum;  // Exponha o enum para o template
  private accessModeSubject = new BehaviorSubject<AccessModeEnum>(AccessModeEnum.HEALTH_PERSON);
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
      map(accessMode => this.getItems(accessMode))
    );
  }

  ngOnInit(): void {
    this.showNavbar$ = this.sidebarService.$show; // Use o observable diretamente

    if (PlatformUtils.isBrowser()) {
      this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
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
        show: accessMode === AccessModeEnum.HEALTH_PERSON,
        dashboard: false,
      },
      {
        title: "Home",
        img: "/common-assets/images/sidebar/icon-home-solid.svg",
        imgWhite: "/common-assets/images/sidebar/white/icon-home-solid.svg",
        url: "/",
        isActive: true,
        show: accessMode === AccessModeEnum.HOST,
        dashboard: true, // Home do host vai para dashboard externo
      },
      {
        title: "Minha Conta",
        img: "/common-assets/images/sidebar/icon-account-solid.svg",
        imgWhite: "/common-assets/images/sidebar/white/icon-account-solid.svg",
        url: "/account",
        isActive: true,
        show: true,
        dashboard: true, // Externo
      },
      {
        title: "Compras",
        img: "/common-assets/images/sidebar/icon-purchases-solid.svg",
        imgWhite: "/common-assets/images/sidebar/white/icon-purchases-solid.svg",
        url: "/purchase",
        isActive: true,
        show: accessMode === AccessModeEnum.HEALTH_PERSON,
        dashboard: true, // Externo
      },
      {
        title: "Assinaturas",
        icon: "icon-calendar-check-2",
        url: "/subscription/management",
        isActive: false,
        show: accessMode === AccessModeEnum.HEALTH_PERSON,
        dashboard: true, // Externo
      },
      {
        title: "Reservas",
        img: "/common-assets/images/sidebar/icon-appointments-solid.svg",
        imgWhite: "/common-assets/images/sidebar/white/icon-appointments-solid.svg",
        url: "/appointment/host",
        isActive: true,
        show: accessMode === AccessModeEnum.HOST,
        dashboard: true, // Externo
      },
      {
        title: "Consultórios",
        img: "/common-assets/images/sidebar/room-icon.svg",
        imgWhite: "/common-assets/images/sidebar/white/room-icon.svg",
        url: "/room",
        isActive: true,
        show: accessMode === AccessModeEnum.HOST,
        dashboard: true, // Externo
      },
      {
        title: "Check-In/Out",
        img: "/common-assets/images/sidebar/icon-checkinout.svg",
        imgWhite: "/common-assets/images/sidebar/white/icon-checkinout.svg",
        url: "/check",
        isActive: true,
        show: accessMode === AccessModeEnum.HEALTH_PERSON,
        dashboard: false, // Interno
      },
      {
        title: "SaaS",
        img: "/common-assets/images/sidebar/icon-saas.svg",
        imgWhite: "/common-assets/images/sidebar/white/icon-saas.svg",
        url: "/saas",
        isActive: true,
        show: accessMode === AccessModeEnum.HOST,
        dashboard: true, // Externo
      },
      {
        title: "Agenda",
        img: "/common-assets/images/sidebar/icon-schedule-solid.svg",
        imgWhite: "/common-assets/images/sidebar/white/icon-schedule-solid.svg",
        url: "/my-schedule",
        isActive: true,
        show: true,
        dashboard: false, // Interno
      },
      {
        title: "Notificações",
        img: "/common-assets/images/sidebar/icon-bell-solid.svg",
        imgWhite: "/common-assets/images/sidebar/white/icon-bell-solid.svg",
        url: "/notification",
        isActive: true,
        show: true,
        dashboard: false, // Interno
      },
      {
        title: "Extrato Financeiro",
        img: "/common-assets/images/sidebar/icon-money-solid.svg",
        imgWhite: "/common-assets/images/sidebar/white/icon-money-solid.svg",
        url: "/statement",
        isActive: true,
        show: true,
        dashboard: true, // Externo
      },
      {
        title: "Ganhe Créditos",
        img: "/common-assets/images/sidebar/icon-indication-earns-solid.svg",
        imgWhite: "/common-assets/images/sidebar/white/icon-indication-earns-solid.svg",
        url: "/get-member",
        isActive: true,
        show: true,
        dashboard: false, // Interno
      },
      {
        title: "Favoritos",
        img: "/common-assets/images/sidebar/icon-favorite-solid.svg",
        imgWhite: "/common-assets/images/sidebar/white/icon-favorite-solid.svg",
        url: "/room-favorite",
        isActive: true,
        show: accessMode === AccessModeEnum.HEALTH_PERSON,
        dashboard: false, // Interno
      },
    ];

    return items.filter(a => a.show && a.isActive)
  }

  getItemUrl(item: NavbarItemDto): string {
    if (item.dashboard) {
      const baseUrl = this.dashboardUrl.endsWith('/') ? this.dashboardUrl : this.dashboardUrl + '/';
      const itemUrl = item.url.startsWith('/') ? item.url.substring(1) : item.url;
      return baseUrl + itemUrl;
    }
    return item.url;
  }

  goToHome() {
    this.router.navigate(["/"]);
  }

  hideSidebar() {
    this.sidebarService.hide();
  }

  toggleAccessMode(mode: AccessModeEnum) {
    if (mode == AccessModeEnum.HOST && PlatformUtils.isBrowser())
      window.location.href = environment.baseUrl;
    else
      this.accessModeService.changeMode(mode);
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