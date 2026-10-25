import { Pipe, PipeTransform } from '@angular/core';
import { BUSINESS } from '../core/pool-data';

@Pipe({ name: 'money' })
export class MoneyPipe implements PipeTransform {
  transform(value: number | null | undefined, freeLabel = 'Free'): string {
    if (value == null) return '—';
    if (value === 0) return freeLabel;
    return `${value.toLocaleString('pl-PL')} ${BUSINESS.currency}`;
  }
}
