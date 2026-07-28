

import { Component, HostListener, Input, OnDestroy, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import { AccessModeService } from "app/modules/common/services/access-mode.service";
import { MaletaService } from "app/modules/maleta/maleta.service";
import { filter, Subscription } from "rxjs";
import { environment } from "../../../../../environments/environment";
import { AuthenticationService } from "../../../authentication/authentication.service";
import { NotificationService } from "../../../notification/notification.service";
import { PageTitleDto } from "../../dtos/page-title.dto";
import { AccessModeEnum } from "../../enums/access-mode.enum";
import { PlatformUtils } from "../../services/platform.util";
import { SidebarService } from "../../services/sidebar.service";
import { AccountDataGetService } from "app/modules/account/services/account-data-get.service";

@Component({
  selector: "clina-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  accessMode: AccessModeEnum = AccessModeEnum.HEALTH_PERSON;
  psUrl = environment.psUrl;
  whatsappNumber = environment.whatsappNumber;
  pageTitle?: PageTitleDto;
  @Input() isAuthenticated: boolean = false;

  isSearchActive = false;
  user:any;

  notificationsCount: number = 0;
  faBell = faBell;
  isNotificationEnabled = environment.psNotification;
  AccessModeEnum = AccessModeEnum;

  public schedulesCount:number=0;
  public sidebarCollapsed: boolean = false;

  constructor(
    private readonly sidebarService: SidebarService,
    private readonly authenticationService: AuthenticationService,
    private readonly accountDataGetService: AccountDataGetService,
    private readonly router: Router,
    private readonly notificationService: NotificationService,
    private readonly accessModeService: AccessModeService,
    private readonly maletaService:MaletaService
  ) {
    /* Continua no construtor, e não no ngOnInit: a emissão inicial precisa chegar antes do
       primeiro render. Só passou a ser registrada para ser desfeita no ngOnDestroy. */
    this.subscriptions.push(
      this.authenticationService.$authenticated.subscribe((auth) => (this.isAuthenticated = auth))
    );
  }

   ngOnInit() {
    this.subscriptions.push(
      this.sidebarService.$collapsed.subscribe(
        (collapsed) => (this.sidebarCollapsed = collapsed)
      )
    );

    this.subscriptions.push(
      this.accessModeService.$accessMode.subscribe(
        (accessMode: AccessModeEnum) => {
          this.accessMode = accessMode;
        }
      )
    );

    this.subscriptions.push(
      this.notificationService.notifications$.subscribe((notifications) => {
        this.notificationsCount = notifications?.filter((r) => !r.read)?.length || 0;
      })
    );

    // O shape do MaletaService varia por app: dashboard expõe `$cart`
    // (CartValidatedDto.appointmentBuckets), marketplace expõe `$schedules`
    // (ScheduleDto[]). Detecta em runtime qual está disponível.
    const maletaService: any = this.maletaService;
    if (maletaService.$cart) {
      this.subscriptions.push(
        maletaService.$cart.subscribe((cart: any) => {
          this.schedulesCount = (cart?.appointmentBuckets || [])
            .reduce((total: number, bucket: any) => total + bucket.appointments.length, 0);
        })
      );
    } else if (maletaService.$schedules) {
      this.subscriptions.push(
        maletaService.$schedules.subscribe((schedules: any[]) => {
          this.schedulesCount = schedules?.length ?? 0;
        })
      );
    }

    this.subscriptions.push(
      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(() => {
          this.checkRoute();
        })
    );

    this.checkRoute();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  goToHome() {
         window.open(environment.psUrl, '_blank').focus();
  }

  toggleSidebar() {
    /* A trava de scroll do body agora é aplicada pela própria sidebar, que
       observa o $show — aqui ela não era desfeita quando o menu fechava pelo
       "×" ou pelo backdrop, e a página ficava sem scroll. */
    this.sidebarService.toggle();
  }

  checkRoute() {
    const currentUrl = this.router.url;
    if (currentUrl !== '/') {
      this.isSearchActive = true;
    } else {
      this.onWindowScroll();
    }
  }

  roomListRedirect(){
    window.location.href = environment.psUrl + '/room/list';
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.router.url !== '/') return;
    if (!PlatformUtils.isBrowser()) return;
    
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    if (scrollPosition > 300) {
      this.isSearchActive = true;
    } else {
      this.isSearchActive = false;
    }
  }
}