import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TEAM } from '../../core/pool-data';
import { RevealDirective } from '../../shared/reveal.directive';

@Component({
  selector: 'app-team',
  imports: [RevealDirective],
  templateUrl: './team.html',
  styleUrl: './team.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Team {
  protected readonly team = TEAM;
}
