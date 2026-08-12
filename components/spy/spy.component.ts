import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountDto } from 'app/modules/account/dtos/account.dto';
import { AuthenticationService } from 'app/modules/authentication/authentication.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'clina-navbar-spy',
  templateUrl: './spy.component.html',
  styleUrls: ['./spy.component.scss'],
})
export class NavbarSpyComponent implements OnInit, OnDestroy {
  spied?: any;
  spiedSubscription?: Subscription;

  constructor(private readonly authenticationService: AuthenticationService) {}

  ngOnInit(): void {
    // Antes: `take(5)` + subscription nunca atribuída — o aviso parava de
    // acompanhar o estado depois das primeiras emissões e nada era limpo.
    this.spiedSubscription = this.authenticationService.$spied.subscribe(
      (spied?: any) => {
        this.spied = spied;
      }
    );
  }

  ngOnDestroy(): void {
    this.spiedSubscription?.unsubscribe();
  }

  turnOffSpy() {
    this.authenticationService.revokeSpy();
  }
}
