import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'datetime',
  standalone: true,
})
export class DatetimePipe implements PipeTransform {
  transform(dateString: string): Date {
    return new Date(dateString);
  }
}
