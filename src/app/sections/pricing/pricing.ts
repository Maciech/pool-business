import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { EXTRAS, PASS_OPTIONS } from '../../core/pool-data';
import { TicketStore } from '../../core/ticket.store';
import { MoneyPipe } from '../../shared/money.pipe';
import { RevealDirective } from '../../shared/reveal.directive';
import { TicketCalculator } from './ticket-calculator/ticket-calculator';

@Component({
  selector: 'app-pricing',
  imports: [MoneyPipe, RevealDirective, TicketCalculator],
  templateUrl: './pricing.html',
  styleUrl: './pricing.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Pricing {
  protected readonly store = inject(TicketStore);
  protected readonly passes = PASS_OPTIONS;
  protected readonly extras = EXTRAS;

  protected readonly activeIndex = computed(() => this.passes.findIndex((p) => p.id === this.store.passType()));

  protected readonly unit = computed(() => {
    switch (this.store.passType()) {
      case 'single':
        return 'per visit';
      case 'tenVisit':
        return 'for 10 visits';
      case 'monthly':
        return 'per month';
    }
  });
}
