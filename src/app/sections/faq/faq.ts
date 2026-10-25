import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FAQ } from '../../core/pool-data';
import { RevealDirective } from '../../shared/reveal.directive';

@Component({
  selector: 'app-faq',
  imports: [RevealDirective],
  templateUrl: './faq.html',
  styleUrl: './faq.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Faq {
  protected readonly items = FAQ;
  protected readonly open = signal<number | null>(0);

  protected toggle(i: number) {
    this.open.update((current) => (current === i ? null : i));
  }
}
