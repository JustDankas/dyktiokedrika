import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTime',
})
export class FormatTimePipe implements PipeTransform {
  transform(value: Date | string, type?: string): string {
    const date = new Date(value);
    if (!type || type === 'time') {
      const [hh, ss] = [date.getHours(), date.getMinutes()];
      if (Number(hh) >= 12) {
        if (Number(hh) == 12) return `${hh}:${ss}PM`;
        return `${Number(hh) - 12}:${ss}PM`;
      } else {
        return `${hh}:${ss}AM`;
      }
    } else {
      // return `${date.getDate()}-${date.getMonth()}`;
      return date.getDate() + ' ' + date.toDateString().split(' ')[1];
    }
  }
}
