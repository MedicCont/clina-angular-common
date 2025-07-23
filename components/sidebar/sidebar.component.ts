import { Component, Input, OnDestroy, OnInit, Renderer2 } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "@environments/environment";
import { AccessModeEnum } from "app/modules/account/enums/access-mode.enum";
import { AccessModeService } from "app/modules/account/services/access-mode.service";
import { AuthenticationService } from "app/modules/authentication/authentication.service";
import { PlatformUtils } from "app/utils/platform.util";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { NavbarItemDto } from "../../dtos/navbar-item.dto";
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
    return [
      {
        title: "Home",
        img: "/common-assets/images/sidebar/icon-home-solid-white.svg",
        url: "/ps",
        isActive: false,
        show: true,
      },
      {
        title: "Minha Conta",
        img: "/common-assets/images/sidebar/icon-account-solid-white.svg",
        url: "/account",
        isActive: false,
        show: true,
      },
      {
        title: "Compras",
        img: "/common-assets/images/sidebar/icon-purchases-solid-white.svg",
        url: "/purchase",
        isActive: false,
        show: accessMode === AccessModeEnum.HEALTH_PERSON,
      },
      {
        title: "Assinaturas",
        icon: "icon-calendar-check-2",
        url: "/subscription/management",
        isActive: false,
        show: accessMode === AccessModeEnum.HEALTH_PERSON,
      },
      {
        title: "Reservas",
        img: "/common-assets/images/sidebar/icon-appointments-solid-white.svg",
        url: "/appointment/host",
        isActive: false,
        show: accessMode === AccessModeEnum.HOST,
      },
      {
        title: "Consultórios",
        img: "/common-assets/images/sidebar/room-icon.svg",
        url: "/room",
        isActive: false,
        show: accessMode === AccessModeEnum.HOST,
      },
      {
        title: "Check-In/Out",
        img: "/common-assets/images/sidebar/icon-checkinout.svg",
        url: "/check",
        isActive: false,
        show: accessMode === AccessModeEnum.HOST,
      },
      {
        title: "SaaS",
        img: "/common-assets/images/sidebar/icon-saas.svg",
        url: "/saas",
        isActive: false,
        show: accessMode === AccessModeEnum.HOST,
      },
      {
        title: "Agenda",
        img: "/common-assets/images/sidebar/icon-schedule-solid-white.svg",
        url: "/my-schedule",
        isActive: false,
        show: true,
      },
      {
        title: "Notificações",
        img: "/common-assets/images/sidebar/icon-bell-solid-white.svg",
        url: "/notification",
        isActive: false,
        show: true,
      },
      {
        title: "Extrato Financeiro",
        img: "/common-assets/images/sidebar/icon-money-solid-white.svg",
        url: "/statement",
        isActive: false,
        show: true,
      },
      {
        title: "Ganhe Créditos",
        img: "/common-assets/images/sidebar/icon-indication-earns-solid-white.svg",
        url: "/get-member",
        isActive: false,
        show: true,
      },
      {
        title: "Favoritos",
        img: "/common-assets/images/sidebar/icon-favorite-solid-white.svg",
        url: "/room-favorite",
        isActive: false,
        show: accessMode === AccessModeEnum.HEALTH_PERSON,
      },
    ];
  }

  goToHome() {
    this.router.navigate(["/"]);
  }

  hideSidebar() {
    this.sidebarService.hide();
  }

  toggleAccessMode(mode: AccessModeEnum) {
    if (mode == AccessModeEnum.HOST && PlatformUtils.isBrowser())
      window.location.href = environment.hostUrl;

    else
     // this.accessModeService.changeMode(mode);
     this.accessModeService.setMode(mode);
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
