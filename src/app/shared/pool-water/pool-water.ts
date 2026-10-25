import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

let nextId = 0;

/** RGB (0–1) of the light net for each tone, fed into the SVG colour matrix. */
const NET_COLOR = {
  dark: [1, 1, 1], // white light on deep water
  light: [0.055, 0.486, 0.525], // lagoon teal on a pale pool floor
} as const;

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
  host: {
    'aria-hidden': 'true',
    '[class.tone-light]': "tone() === 'light'",
    '[class.fade-left]': 'fadeLeft()',
  },
})
export class PoolWater {
  readonly tone = input<'dark' | 'light'>('dark');
  /** Dim the light on the left, where a headline usually sits. */
  readonly fadeLeft = input(false);
  readonly showSwells = input(true);

  /** Unique per instance, so two pools on one page don't share filter ids. */
  protected readonly ids = (() => {
    const n = nextId++;
    return { a: `caustic-a-${n}`, b: `caustic-b-${n}` };
  })();

  protected readonly colorMatrix = computed(() => {
    const [r, g, b] = NET_COLOR[this.tone()];
    return `0 0 0 0 ${r}  0 0 0 0 ${g}  0 0 0 0 ${b}  1 0 0 0 0`;
  });

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
