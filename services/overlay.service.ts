import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface OverlayConfig {
  title: string;
  description?: string;
}

@Injectable({ providedIn: 'root' })
export class OverlayService {
  private _config = new BehaviorSubject<OverlayConfig | null>(null);
  readonly config$ = this._config.asObservable();

  show(config: OverlayConfig): void {
    this._config.next(config);
  }

  hide(): void {
    this._config.next(null);
  }
}
