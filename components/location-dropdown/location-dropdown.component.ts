import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    Renderer2,
} from '@angular/core';
import { PlatformUtils } from 'app/utils/platform.util';

export interface DropdownItem {
  value: string;
  label: string;
}

@Component({
  selector: 'clina-navbar-location-dropdown',
  templateUrl: './location-dropdown.component.html',
  styleUrls: ['./location-dropdown.component.scss'],
})
export class NavbarLocationDropdownComponent implements OnInit, OnDestroy {
  @Input() inputId: string = '';
  @Input() label: string = '';
  @Input() list: DropdownItem[] = [];
  @Input() selected?: DropdownItem;
  @Input() value?: string;
  @Input() loading?: boolean;
  @Output() handleChange = new EventEmitter<string>();
  @Output() handleSelect = new EventEmitter<DropdownItem>();

  keyword: string = '';
  placeholder: string = '';

  focused = false;
  show = false;

  constructor(private readonly renderer: Renderer2) {}

  ngOnInit() {
    if (this.value) {
      this.selected = this.list.find((i) => i.value == this.value);
    }
  }

  open() {
    this.focused = true;
    this.show = true;
    this.renderer.addClass(document.body, 'no-scroll');
  }

  close() {
    setTimeout(() => {
      this.focused = false;
      this.show = false;
      this.renderer.removeClass(document.body, 'no-scroll');
      if (this.selected) {
        this.keyword = '';
      }
    }, 200);
  }

  change() {
    this.handleChange.emit(this.keyword);
  }

  select(item: DropdownItem) {
    this.handleSelect.emit(item);
    this.keyword = '';
    this.selected = item;
    this.close();
  }

  clear() {
    this.keyword = '';
    this.selected = undefined;
    this.handleSelect.emit(undefined);
  }

  ngOnDestroy(): void {
    if(PlatformUtils.isBrowser())
    this.renderer.removeClass(document.body, 'no-scroll');
  }
}
