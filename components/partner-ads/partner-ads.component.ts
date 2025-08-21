import { Component } from '@angular/core';

@Component({
  selector: 'app-partner-ads',
  standalone: true,
  templateUrl: './partner-ads.component.html',
  styleUrl: './partner-ads.component.scss'
})
export class PartnerAdsComponent {

  navigateAd(url:string){
    if(url && url?.length>0){
      window.open(url, '_blank');
    }
  }
}
