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
    console.log(this.appointmentDays);
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
            event: false,
          };
        });
    } else {
      let calendarDays: ICalendarDate[] = Array(nDays + firstDay - 1)
        .fill(0)
        .map((day, index) => {
          // console.log(index);
          if (index < firstDay - 1) {
            // let prevNDays = new Date(
            //   this.month - 1 > 0 ? year : year - 1,
            //   (this.month - 1) % 12,
            //   0
            // ).getDate();
            let prevNDays = new Date(this.year, this.month - 1, 0).getDate();
            return {
              day: prevNDays - firstDay + index + 1 + 1,
              muted: true,
              event: false,
            };
          } else {
            const insertDay = index + 1 - firstDay + 1;
            console.log(
              new Date(this.year, this.month - 1, insertDay).getDay()
            );
            if (
              this.appointmentDays.includes(
                (new Date(this.year, this.month - 1, insertDay).getDay() - 1) %
                  7
              ) &&
              new Date(this.year, this.month - 1, insertDay).getTime() >=
                Date.now()
            ) {
              return {
                day: insertDay,
                muted: false,
                event: true,
              };
            }
            return {
              day: insertDay,
              muted: false,
              event: false,
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
