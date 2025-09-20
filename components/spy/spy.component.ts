import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountDto } from 'app/modules/account/dtos/account.dto';
import { AuthenticationService } from 'app/modules/authentication/authentication.service';
import { HostDto } from 'app/modules/authentication/dtos/host.dto';
import { Subscription, take } from 'rxjs';

@Component({
  selector: 'clina-navbar-spy',
  templateUrl: './spy.component.html',
  styleUrls: ['./spy.component.scss'],
})
export class NavbarSpyComponent implements OnInit, OnDestroy {
  spied?: HostDto;
  spiedSubscription?: Subscription;

  constructor(private readonly authenticationService: AuthenticationService) {}

  ngOnInit(): void {
    this.authenticationService.$spied.pipe(take(5)).subscribe((spied?: HostDto) => {
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
