import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import { Subscription } from "rxjs";
import { AccessModeEnum } from "src/app/modules/account/enums/access-mode.enum";
import { AccessModeService } from "src/app/modules/account/services/access-mode.service";
import { UnleashService } from "src/app/services/unleash.service";
import { environment } from "../../../../../environments/environment";
import { AuthenticationService } from "../../../authentication/authentication.service";
import { NotificationService } from "../../../notification/notification.service";
import { PageTitleDto } from "../../dtos/page-title.dto";
import { SidebarService } from "../../services/sidebar.service";

@Component({
  selector: "clina-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit, OnDestroy {
  accessMode: AccessModeEnum = AccessModeEnum.HEALTH_PERSON;

  psUrl = environment.psUrl;
  whatsappNumber = environment.whatsappNumber;

  pageTitle?: PageTitleDto;
  pageTitleSubscription?: Subscription;

  notificationsCount: number = 0;

  faBell = faBell;

  isNotificationEnabled = this.unleashService.isEnabled("ps-notification");

  AccessModeEnum = AccessModeEnum;

  constructor(
    private readonly sidebarService: SidebarService,
    private readonly authenticationService: AuthenticationService,
    private readonly router: Router,
    private readonly unleashService: UnleashService,
    private readonly notificationService: NotificationService,
    private readonly accessModeService: AccessModeService
  ) {}

  ngOnInit(): void {
    this.accessModeService.$accessMode.subscribe(
      (accessMode: AccessModeEnum) => {
        this.accessMode = accessMode;
      }
    );

    this.notificationService.getNotifications().subscribe((notifications) => {
      this.notificationsCount =
        notifications?.filter((r) => !r.read)?.length || 0;
    });
  }

  ngOnDestroy(): void {
    this.pageTitleSubscription?.unsubscribe();
  }

  goToHome() {
    this.router.navigate(["/"]);
  }

  showSidebar() {
    document.getElementById("body")?.classList.add("overflow-hidden");
    this.sidebarService.show();
  }
}
