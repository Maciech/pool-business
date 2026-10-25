import { Injectable, computed, inject } from '@angular/core';
import { ClockService } from './clock.service';
import { OpeningSlot, Weekday } from './models';
import { OPENING_HOURS } from './pool-data';

export const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** Monday-first order, which is how the week is shown on the site. */
export const WEEK_ORDER: Weekday[] = [1, 2, 3, 4, 5, 6, 0];

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

@Injectable({ providedIn: 'root' })
export class OpeningHoursService {
  private readonly clock = inject(ClockService);

  readonly week: OpeningSlot[] = WEEK_ORDER.map((d) => OPENING_HOURS.find((s) => s.day === d)!);

  readonly today = computed(() => this.clock.now().getDay() as Weekday);

  private readonly minutesNow = computed(() => {
    const now = this.clock.now();
    return now.getHours() * 60 + now.getMinutes();
  });

  readonly todaySlot = computed(() => this.slotFor(this.today()));

  readonly isOpen = computed(() => {
    const slot = this.todaySlot();
    const m = this.minutesNow();
    return m >= toMinutes(slot.open) && m < toMinutes(slot.close);
  });

  /** Short human status, e.g. "Open · until 21:30" or "Closed · opens Tue 06:30". */
  readonly status = computed(() => {
    const slot = this.todaySlot();
    if (this.isOpen()) {
      const left = toMinutes(slot.close) - this.minutesNow();
      return left <= 60 ? `Closing soon · ${slot.close}` : `Open now · until ${slot.close}`;
    }
    if (this.minutesNow() < toMinutes(slot.open)) {
      return `Closed · opens today ${slot.open}`;
    }
    const next = this.slotFor(((this.today() + 1) % 7) as Weekday);
    return `Closed · opens ${WEEKDAY_NAMES[next.day].slice(0, 3)} ${next.open}`;
  });

  slotFor(day: Weekday): OpeningSlot {
    return OPENING_HOURS.find((s) => s.day === day)!;
  }
}
