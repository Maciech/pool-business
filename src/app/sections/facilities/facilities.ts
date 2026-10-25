import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FACILITIES } from '../../core/pool-data';
import { RevealDirective } from '../../shared/reveal.directive';

@Component({
  selector: 'app-facilities',
  imports: [RevealDirective],
  templateUrl: './facilities.html',
  styleUrl: './facilities.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Facilities {
  protected readonly facilities = FACILITIES;

  protected readonly amenities = [
    'Heated all season',
    'Step-free & pool hoist',
    'Family changing village',
    'Riverside café',
    'Free bike parking',
    'Lifeguards on every pool',
  ];
}
