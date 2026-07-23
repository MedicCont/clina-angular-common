import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private static readonly COLLAPSE_KEY = 'clina.sidebar.collapsed';

  // Off-canvas (mobile): sidebar aberta/fechada.
  public $show = new BehaviorSubject<boolean>(false);

  // Mini (desktop): sidebar recolhida em modo ícone. Persistido em localStorage.
  public $collapsed = new BehaviorSubject<boolean>(this.readCollapsed());

  show() {
    this.$show.next(true);
  }

  hide() {
    this.$show.next(false);
  }

  toggle() {
    const currentState = this.$show.getValue();
    this.$show.next(!currentState);
  }

  isSidebarVisible(): boolean {
    return this.$show.getValue();
  }

  toggleCollapse() {
    const next = !this.$collapsed.getValue();
    this.$collapsed.next(next);
    this.writeCollapsed(next);
  }

  isCollapsed(): boolean {
    return this.$collapsed.getValue();
  }

  private readCollapsed(): boolean {
    try {
      return localStorage.getItem(SidebarService.COLLAPSE_KEY) === '1';
    } catch {
      return false;
    }
  }

  private writeCollapsed(value: boolean): void {
    try {
      localStorage.setItem(SidebarService.COLLAPSE_KEY, value ? '1' : '0');
    } catch {
      // SSR / storage indisponível — ignora.
    }
  }
}
