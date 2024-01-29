import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTime',
})
export class FormatTimePipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): string {
    value = value.slice(0, -3);
    const [hh, ss] = value.split(':');
    if (Number(hh) >= 12) {
      if (Number(hh) == 12) return `${hh}:${ss}PM`;
      return `${Number(hh) - 12}:${ss}PM`;
    } else {
      return `${hh}:${ss}AM`;
    }
  }
}
