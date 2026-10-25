import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { PASS_OPTIONS } from '../../../core/pool-data';
import { PartyCounts, TicketStore } from '../../../core/ticket.store';
import { MoneyPipe } from '../../../shared/money.pipe';

@Component({
  selector: 'app-ticket-calculator',
  imports: [MoneyPipe],
  templateUrl: './ticket-calculator.html',
  styleUrl: './ticket-calculator.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketCalculator {
  protected readonly store = inject(TicketStore);

  protected readonly rows: { key: keyof PartyCounts; label: string; hint: string }[] = [
    { key: 'adult', label: 'Adults', hint: '16–64' },
    { key: 'child', label: 'Kids', hint: '3–15' },
    { key: 'concession', label: 'Students & seniors', hint: 'ID / 65+' },
    { key: 'toddler', label: 'Little ones', hint: 'under 3, free' },
  ];

  protected readonly passLabel = computed(
    () => PASS_OPTIONS.find((p) => p.id === this.store.passType())!.label,
  );
}
