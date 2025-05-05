import { Component, OnInit } from '@angular/core';
import { AccessModeEnum } from 'app/modules/account/enums/access-mode.enum';
import { AccessModeService } from 'app/modules/account/services/access-mode.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'clina-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  accessMode: AccessModeEnum = AccessModeEnum.HEALTH_PERSON;

  homeUrl = environment.baseUrl;
  psUrl = environment.psUrl;
  hostUrl = environment.hostUrl;
  whatsappNumber = environment.whatsappNumber;

  AccessModeEnum = AccessModeEnum;

  constructor(private readonly accessModeService: AccessModeService) {}

  ngOnInit(): void {
    this.accessModeService.$accessMode.subscribe(
      (accessMode: AccessModeEnum) => {
        this.accessMode = accessMode;
      }
    );
  }
}
