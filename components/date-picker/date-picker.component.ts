import { Component, EventEmitter, Input, Output } from '@angular/core';
import moment from 'moment';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'clina-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
})
export class DatePickerComponent {
  @Input() inputId: string = '';
  @Input() title: string = '';
  @Input() date?: Date;
  @Input() isValid?: boolean;
  @Input() isNotValid?: boolean;
  @Input() isDisabled = false;
  @Input() minDate?: Date;

  @Output() action = new EventEmitter<Date>();

  today = moment(new Date()).format('DD MMM. YYYY');

  isOpen = false;

  @Input() bsConfig: Partial<BsDatepickerConfig> = {
    containerClass: 'theme-clina',
    showWeekNumbers: false,
    dateInputFormat: 'DD MMM. YYYY',
    minDate: moment().toDate(),
  };

  constructor(private localeService: BsLocaleService) {
    this.localeService.use('pt-br');
  }

  changeDate(date: Date) {
    this.date = date;
    this.action.next(date);
  }

  toggle() {
    if (!this.isDisabled) {
      this.isOpen = !this.isOpen;
    }
  }

  clear() {
    this.date = undefined;
  }

  formatPlaceholder(date: Date) {
    return moment(date).format('DD MMM. YYYY');
  }
}
