import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "../../../../environments/environment";
import { AccessModeEnum } from "../enums/access-mode.enum";
import { PlatformUtils } from "./platform.util";

/**
 * Destino do logo, único para navbar e sidebar. Os dois tinham a própria versão do
 * `goToHome` e elas divergiram: a navbar abria o marketplace em aba nova em qualquer
 * situação, a sidebar mandava o profissional para `/` (que não é a home do PS) e nenhuma
 * das duas considerava estar rodando dentro do marketplace.
 *
 * Regra: logado vai para o dashboard do modo em uso — anfitrião `/host`, profissional
 * `/ps`; deslogado vai para o marketplace.
 */
@Injectable({ providedIn: "root" })
export class HomeNavigationService {
  constructor(private readonly router: Router) {}

  goHome(accessMode: AccessModeEnum, isAuthenticated: boolean): void {
    if (!isAuthenticated) {
      window.open(environment.psUrl, "_blank")?.focus();
      return;
    }

    const dashboardBase = environment.dashboardUrl.replace(/\/$/, "");
    const homePath = accessMode === AccessModeEnum.HOST ? "/host" : "/ps";

    // Fora do dashboard (marketplace): troca a URL, porque a rota não existe neste app.
    if (PlatformUtils.isBrowser() && !window.location.href.startsWith(dashboardBase)) {
      window.location.href = `${dashboardBase}${homePath}`;
      return;
    }

    this.router.navigateByUrl(homePath);
  }
}
