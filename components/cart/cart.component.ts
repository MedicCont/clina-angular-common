import { Component, OnInit } from '@angular/core';
import { MaletaService } from 'app/modules/maleta/maleta.service';

@Component({
  selector: 'clina-navbar-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class NavbarCartComponent implements OnInit {
  count = 0;

  constructor(private readonly maletaService: MaletaService) {}

  // O shape do MaletaService varia por app: dashboard expõe `$cart`
  // (CartValidatedDto.appointmentBuckets), marketplace expõe `$schedules`
  // (ScheduleDto[]). Detecta em runtime qual está disponível, evitando
  // importar DTOs que só existem em um dos dois apps.
  ngOnInit(): void {
    const maletaService: any = this.maletaService;
    if (maletaService.$cart) {
      maletaService.$cart.subscribe((cart: any) => {
        this.count = (cart?.appointmentBuckets || []).length;
      });
    } else if (maletaService.$schedules) {
      maletaService.$schedules.subscribe((schedules: any[]) => {
        this.count = schedules?.length ?? 0;
      });
    }
  }
}
