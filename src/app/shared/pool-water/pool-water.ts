import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Decorative pool surface: two drifting caustic light nets (the shimmer you
 * see on a pool floor) plus a few gentle surface swells. The SVG filters
 * render once; only CSS transforms animate, so it stays cheap.
 */
@Component({
  selector: 'app-pool-water',
  templateUrl: './pool-water.html',
  styleUrl: './pool-water.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
})
export class PoolWater {
  /** Surface swell lines: vertical position (%), amplitude, period and speed. */
  protected readonly swells = [
    { top: 18, amp: 5, period: 320, duration: 19, opacity: 0.18 },
    { top: 34, amp: 7, period: 420, duration: 26, opacity: 0.12 },
    { top: 52, amp: 4, period: 260, duration: 15, opacity: 0.16 },
    { top: 68, amp: 8, period: 480, duration: 31, opacity: 0.1 },
    { top: 84, amp: 5, period: 300, duration: 22, opacity: 0.14 },
  ].map((s) => ({ ...s, d: this.wavePath(s.amp, s.period) }));

  /** A sine-like path two "tiles" wide so it can loop by sliding one tile. */
  private wavePath(amp: number, period: number): string {
    const width = 2880;
    const half = period / 2;
    let d = `M0 ${amp}`;
    for (let x = 0; x < width; x += period) {
      d += ` q${half / 2} ${-amp} ${half} 0 t${half} 0`;
    }
    return d;
  }
}
