import { Component, Input, OnDestroy, OnInit, Renderer2 } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { AuthenticationService } from "app/modules/authentication/authentication.service";
import { AccessModeService } from "app/modules/common/services/access-mode.service";
import { environment } from "environments/environment";
import { BehaviorSubject, Observable, Subscription, combineLatest, map } from "rxjs";
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
  private collapseSubscription?: Subscription;
  public isSidebarHovered = false;
  public isCollapsed = false;
  public account: any;
  public tooltipLabel: string | null = null;
  public tooltipY = 0;
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
    this.items$ = combineLatest([
      this.accessMode$,
      this.authenticationService.$account,
    ]).pipe(
      map(([accessMode, account]) => this.getItems(accessMode, !!account?.isActiveSaaS))
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

    this.collapseSubscription = this.sidebarService.$collapsed.subscribe(
      (collapsed) => (this.isCollapsed = collapsed)
    );

    this.authenticationService.$account.subscribe(
      (account) => (this.account = account)
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

  // Mini apenas no desktop; no mobile a sidebar é off-canvas.
  get isMini(): boolean {
    return !this.isMobile && this.isCollapsed;
  }

  toggleCollapse(): void {
    this.sidebarService.toggleCollapse();
  }

  onItemEnter(item: any, event: MouseEvent): void {
    if (!this.isMini) return;
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    this.tooltipLabel = item.title;
    this.tooltipY = rect.top + rect.height / 2;
  }

  onItemLeave(): void {
    this.tooltipLabel = null;
  }

  getInitials(name?: string): string {
    if (!name) return '';
    const parts = name.trim().split(/\s+/).slice(0, 2);
    return parts.map((part) => part[0]?.toUpperCase() || '').join('');
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
    this.serviceShowSubscription?.unsubscribe(); // Limpa a inscrição do serviço
    this.collapseSubscription?.unsubscribe();
    if (PlatformUtils.isBrowser())
      this.renderer.removeClass(document.body, "no-scroll");
  }

  // --- O RESTANTE DO CÓDIGO PERMANECE IGUAL ---
  getItems(accessMode: AccessModeEnum, isActiveSaaS: boolean = false): NavbarItemDto[] {
    var items = [
      {
        title: "Home",
        lucideIcon: "Home",
        menuUrl: "/ps",
        isActive: true,
        mode: ItemModeEnum.PS,
        system: SystemEnum.DASHBOARD,
        url:""
      },
      {
        title: "Home",
        lucideIcon: "Home",
        menuUrl: "/",
        isActive: true,
        mode: ItemModeEnum.HOST,
        system: SystemEnum.DASHBOARD,
        url:""
      },
      {
        title: "Minha Conta",
        lucideIcon: "User",
        menuUrl: "/account",
        isActive: true,
        mode: ItemModeEnum.BOTH,
        system: SystemEnum.DASHBOARD,
        url:""
      },
      {
        title: "Compras",
        lucideIcon: "ShoppingBag",
        menuUrl: "/purchase",
        isActive: true,
        mode: ItemModeEnum.PS,
        system: SystemEnum.DASHBOARD,
        url:""
      },
      {
        title: "Cobranças",
        lucideIcon: "Receipt",
        menuUrl: "/charges",
        isActive: true,
        mode: ItemModeEnum.PS,
        system: SystemEnum.DASHBOARD,
        url:""
      },
      {
        title: "Assinaturas",
        lucideIcon: "CalendarCheck",
        menuUrl: "/subscription/management",
        isActive: false,
        mode: ItemModeEnum.PS,
        system: SystemEnum.DASHBOARD,
        url:""
      },
      {
        title: "Consultórios Alugados",
        lucideIcon: "Building2",
        menuUrl: "/room-lease/management",
        isActive: true,
        mode: ItemModeEnum.PS,
        system: SystemEnum.DASHBOARD,
        url:""
      },
      {
        title: "Reservas",
        lucideIcon: "ClipboardList",
        menuUrl: "/appointment/host",
        isActive: true,
        mode: ItemModeEnum.HOST,
        system: SystemEnum.DASHBOARD,
        url:""
      },
      {
        title: "Clínicas",
        lucideIcon: "Hospital",
        menuUrl: "/clinic",
        isActive: true,
        mode: ItemModeEnum.HOST,
        system: SystemEnum.DASHBOARD,
        url:""
      },
      {
        title: "Consultórios",
        lucideIcon: "DoorClosed",
        menuUrl: "/room",
        isActive: true,
        mode: ItemModeEnum.HOST,
        system: SystemEnum.DASHBOARD,
        url:""
      },
      {
        title: "Disponibilidades",
        lucideIcon: "CalendarClock",
        menuUrl: "/room/availability",
        isActive: true,
        mode: ItemModeEnum.HOST,
        system: SystemEnum.DASHBOARD,
        url:""
      },
      {
        title: "Agendas",
        lucideIcon: "CalendarDays",
        menuUrl: "/room/schedule",
        isActive: true,
        mode: ItemModeEnum.HOST,
        system: SystemEnum.DASHBOARD,
        url:""
      },
      {
        title: "Check-In/Out",
        lucideIcon: "ClipboardCheck",
        menuUrl: "/check",
        isActive: true,
        mode: ItemModeEnum.HOST,
        system: SystemEnum.DASHBOARD,
        url:""
      },
      {
        title: "SaaS",
        lucideIcon: "Layers",
        menuUrl: "/saas",
        isActive: true,
        mode: ItemModeEnum.HOST,
        system: SystemEnum.DASHBOARD,
        url: "",
        requiresSaaS: true,
      },
      {
        title: "Agenda",
        lucideIcon: "CalendarDays",
        menuUrl: "/my-schedule",
        isActive: true,
        mode: ItemModeEnum.PS,
        system: SystemEnum.DASHBOARD,
        url:""
      },
      {
        title: "Notificações",
        lucideIcon: "Bell",
        menuUrl: "/notification",
        isActive: true,
        mode: ItemModeEnum.BOTH,
        system: SystemEnum.DASHBOARD,
        url:""
      },
      {
        title: "Extrato Financeiro",
        lucideIcon: "Wallet",
        menuUrl: "/statement",
        isActive: true,
        mode: ItemModeEnum.BOTH,
        system: SystemEnum.DASHBOARD,
        url:""
      },
      {
        title: "Favoritos",
        lucideIcon: "Heart",
        menuUrl: "/room-favorite",
        isActive: true,
        mode: ItemModeEnum.PS,
        system: SystemEnum.DASHBOARD,
        url:""
      },
    ];

    items = items.filter((item) => {
      if (!item.isActive) return false;
      if (item.requiresSaaS && !isActiveSaaS) return false;
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

    this.accessModeService.load(mode);

    // Troca de plataforma: vai sempre para a home do dashboard do modo
    // correspondente (host ou profissional da saúde), de qualquer app.
    const base = this.dashboardUrl.endsWith('/')
      ? this.dashboardUrl
      : `${this.dashboardUrl}/`;
    window.location.href =
      mode === AccessModeEnum.HOST ? `${base}host` : `${base}ps`;
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
