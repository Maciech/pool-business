import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { Session, Weekday } from '../../core/models';
import { OpeningHoursService, WEEKDAY_NAMES, WEEK_ORDER } from '../../core/opening-hours.service';
import { HOLIDAY_NOTE, SESSIONS } from '../../core/pool-data';
import { RevealDirective } from '../../shared/reveal.directive';

type KindFilter = Session['kind'] | 'all';

@Component({
  selector: 'app-hours',
  imports: [RevealDirective],
  templateUrl: './hours.html',
  styleUrl: './hours.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hours {
  protected readonly hours = inject(OpeningHoursService);
  protected readonly dayNames = WEEKDAY_NAMES;
  protected readonly weekOrder = WEEK_ORDER;
  protected readonly holidayNote = HOLIDAY_NOTE;

  /** Follows "today" until the visitor picks another day. */
  protected readonly selectedDay = linkedSignal<Weekday>(() => this.hours.today());
  protected readonly kind = signal<KindFilter>('all');

  protected readonly kinds: { id: KindFilter; label: string }[] = [
    { id: 'all', label: 'Everything' },
    { id: 'lanes', label: 'Lane swim' },
    { id: 'lessons', label: 'Lessons' },
    { id: 'fitness', label: 'Fitness' },
    { id: 'family', label: 'Family' },
  ];

  protected readonly sessions = computed(() =>
    SESSIONS.filter((s) => s.day === this.selectedDay() && (this.kind() === 'all' || s.kind === this.kind())).sort(
      (a, b) => a.start.localeCompare(b.start),
    ),
  );
}
