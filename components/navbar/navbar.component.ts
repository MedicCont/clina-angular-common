

import { Component, HostListener, Input, OnDestroy, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import { AccessModeService } from "app/modules/common/services/access-mode.service";
import { MaletaService } from "app/modules/maleta/maleta.service";
import { UnleashService } from "app/services/unleash.service";
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
  isNotificationEnabled = this.unleashService.isEnabled("ps-notification");
  AccessModeEnum = AccessModeEnum;
  pageTitleSubscription: Subscription | undefined=undefined;

  private subs:Subscription[]=[];
  public schedulesCount:number=0;

  constructor(
    private readonly sidebarService: SidebarService,
    private readonly authenticationService: AuthenticationService,
    private readonly accountDataGetService: AccountDataGetService,
    private readonly router: Router,
    private readonly unleashService: UnleashService,
    private readonly notificationService: NotificationService,
    private readonly accessModeService: AccessModeService,
    private readonly maletaService:MaletaService
  ) {
    this.authenticationService.$authenticated.subscribe((auth) => (this.isAuthenticated = auth));
  }

   ngOnInit() {

    this.subscriptions.push(
      this.accessModeService.$accessMode.subscribe(
        (accessMode: AccessModeEnum) => {
          this.accessMode = accessMode;
        }
      )
    );

    // Update to use notifications$ instead of getNotifications()
    this.subscriptions.push(
      this.notificationService.notifications$.subscribe((notifications) => {
        this.notificationsCount = notifications?.filter((r) => !r.read)?.length || 0;
      })
    );

  }

  ngOnDestroy(): void {
    // Cleanup all subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subs = new Array<Subscription>();

    let sub1 = this.maletaService.$schedules.subscribe(schedules=>{
      this.schedulesCount = schedules?.length ? schedules.length : 0;
    });
    this.subs.push(sub1);

    this.notificationService.getNotifications().subscribe((notifications) => {
      this.notificationsCount =
        notifications?.filter((r) => !r.read)?.length || 0;
    });

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkRoute();
      });

    // Faz a verificação inicial
    this.checkRoute();

    this.pageTitleSubscription?.unsubscribe();
    this.subs.forEach(sub=>{
      sub.unsubscribe();
    })
  }

  goToHome() {
         window.open(environment.psUrl, '_blank').focus();
  }

  toggleSidebar() {
    const body = document.getElementById("body");

    // Alterna o estado da sidebar
    this.sidebarService.toggle();
    if (this.sidebarService.isSidebarVisible()) {
      body?.classList.add("overflow-hidden");
    } else {
      body?.classList.remove("overflow-hidden");
    }
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