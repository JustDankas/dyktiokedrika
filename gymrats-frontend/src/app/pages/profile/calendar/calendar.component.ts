import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

interface ICalendarDate {
  day: number;
  muted: boolean;
  event: boolean;
}
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnChanges {
  days: ICalendarDate[] = [];
  readonly year: number = new Date().getFullYear();
  month: number = new Date().getMonth() + 1;
  date!: string;

  @Input() appointmentDays: number[] = [];

  constructor() {
    this.updateCalendar();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.updateCalendar();
  }

  updateCalendar() {
    // month = 2; // feb
    // months 1-12 current year
    // weekdays 1-7
    // days 1-31
    this.date = new Date(this.year, this.month, 0).toLocaleString('default', {
      month: 'long',
      year: 'numeric',
    });
    const nDays = new Date(this.year, this.month, 0).getDate(); // 29
    let firstDay = new Date(this.year, this.month - 1, 1).getDay(); // 4
    if (firstDay === 1) {
      this.days = Array(nDays)
        .fill(0)
        .map((day, index) => {
          return {
            day: index + 1,
            muted: false,
            event: this.appointmentDays.includes(
              new Date(this.year, this.month - 1, index + 1).getTime()
            ),
          };
        });
    } else {
      let calendarDays: ICalendarDate[] = Array(nDays + firstDay - 1)
        .fill(0)
        .map((day, index) => {
          if (index < firstDay - 1) {
            let prevNDays = new Date(this.year, this.month - 1, 0).getDate();
            let insertDay = prevNDays - firstDay + index + 1 + 1;

            return {
              day: insertDay,
              muted: true,
              event: this.appointmentDays.includes(
                new Date(this.year, this.month - 2, insertDay).getTime()
              ),
            };
          } else {
            const insertDay = index + 1 - firstDay + 1;

            return {
              day: insertDay,
              muted: false,
              event: this.appointmentDays.includes(
                new Date(this.year, this.month - 1, insertDay).getTime()
              ),
            };
          }
        });
      this.days = calendarDays;
    }
  }

  getNextMonth() {
    this.month += 1;
    this.updateCalendar();
  }

  getLastMonth() {
    this.month -= 1;
    this.updateCalendar();
  }
}
