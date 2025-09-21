import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountDto } from 'app/modules/account/dtos/account.dto';
import { AuthenticationService } from 'app/modules/authentication/authentication.service';
import { Subscription, take } from 'rxjs';

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
    this.authenticationService.$spied.pipe(take(5)).subscribe((spied?: any) => {
      this.spied = spied;
    });
  }

  ngOnDestroy(): void {
    this.spiedSubscription?.unsubscribe();
  }

  turnOffSpy() {
    this.authenticationService.revokeSpy();
  }
}
