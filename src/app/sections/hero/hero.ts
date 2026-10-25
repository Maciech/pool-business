import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ClockService } from '../../core/clock.service';
import { OpeningHoursService } from '../../core/opening-hours.service';
import { BUSINESS, SESSIONS } from '../../core/pool-data';
import { PoolWater } from '../../shared/pool-water/pool-water';

@Component({
  selector: 'app-hero',
  imports: [PoolWater],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero {
  private readonly clock = inject(ClockService);
  protected readonly hours = inject(OpeningHoursService);
  protected readonly business = BUSINESS;

  /** The next session starting later today, shown on the lane board. */
  protected readonly nextSession = computed(() => {
    const now = this.clock.now();
    const hhmm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    return SESSIONS.filter((s) => s.day === this.hours.today() && s.start > hhmm).sort((a, b) =>
      a.start.localeCompare(b.start),
    )[0];
  });
}
