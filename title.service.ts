import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PageTitleDto } from './dtos/page-title.dto';

@Injectable({
  providedIn: 'root',
})
export class TitleService {
  public $title = new BehaviorSubject<PageTitleDto | undefined>(undefined);
}

