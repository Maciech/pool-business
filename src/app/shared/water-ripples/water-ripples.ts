import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  viewChild,
} from '@angular/core';

/** CSS pixels per simulation cell. Bigger = cheaper and softer ripples. */
const CELL = 4;
/** How much energy each wave keeps per step (lower = ripples die sooner). */
const DAMPING = 0.97;
/** Strength of the push under the cursor, scaled by pointer speed. */
const PUSH = 90;
const MAX_PUSH = 260;
/** Light shading: crests catch white light, troughs show lagoon teal. */
const SHADE = 0.004;
const MAX_HIGHLIGHT = 0.38;
const MAX_SHADOW = 0.16;
const HIGHLIGHT = [255, 255, 255];
const SHADOW = [14, 124, 134];

/**
 * "Finger in the water": a full-viewport overlay running a 2D wave equation
 * on a coarse height field. The pointer disturbs the surface, waves spread,
 * interfere and fade. Each frame the slope of the field is turned into
 * highlights and shadows, so it reads as light bending on a water surface.
 * The loop sleeps when the water is still, so an idle page costs nothing.
 */
@Component({
  selector: 'app-water-ripples',
  template: '<canvas #canvas></canvas>',
  styleUrl: './water-ripples.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
})
export class WaterRipples {
  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  private cols = 0;
  private rows = 0;
  private current = new Float32Array(0);
  private previous = new Float32Array(0);
  private ctx: CanvasRenderingContext2D | null = null;
  private image: ImageData | null = null;

  private frame = 0;
  private stillFrames = 0;
  private lastPoint: { x: number; y: number; t: number } | null = null;

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      this.ctx = this.canvasRef().nativeElement.getContext('2d');
      if (!this.ctx) return;
      this.resize();

      const onMove = (e: PointerEvent) => this.onPointer(e);
      const onLeave = () => (this.lastPoint = null);
      const onResize = () => this.resize();

      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('pointerdown', onMove, { passive: true });
      document.addEventListener('pointerleave', onLeave);
      window.addEventListener('resize', onResize);

      destroyRef.onDestroy(() => {
        cancelAnimationFrame(this.frame);
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerdown', onMove);
        document.removeEventListener('pointerleave', onLeave);
        window.removeEventListener('resize', onResize);
      });
    });
  }

  private resize() {
    const canvas = this.canvasRef().nativeElement;
    this.cols = Math.ceil(window.innerWidth / CELL) + 2;
    this.rows = Math.ceil(window.innerHeight / CELL) + 2;
    canvas.width = this.cols;
    canvas.height = this.rows;
    this.current = new Float32Array(this.cols * this.rows);
    this.previous = new Float32Array(this.cols * this.rows);
    this.image = this.ctx!.createImageData(this.cols, this.rows);
  }

  private onPointer(e: PointerEvent) {
    const now = performance.now();
    const last = this.lastPoint;
    this.lastPoint = { x: e.clientX, y: e.clientY, t: now };

    if (e.type === 'pointerdown') {
      this.splash(e.clientX, e.clientY, MAX_PUSH * 1.5, 5);
      this.wake();
      return;
    }
    if (!last || now - last.t > 120) return;

    // Push along the whole path since the last event, so fast strokes leave
    // a continuous wake instead of separate dots.
    const dx = e.clientX - last.x;
    const dy = e.clientY - last.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 1) return;

    const speed = dist / Math.max(now - last.t, 8);
    const strength = Math.min(PUSH * speed, MAX_PUSH);
    const steps = Math.ceil(dist / (CELL * 2));
    for (let i = 1; i <= steps; i++) {
      this.splash(last.x + (dx * i) / steps, last.y + (dy * i) / steps, strength / steps + 12, 3);
    }
    this.wake();
  }

  /**
   * Press the surface down with a smooth, rounded dent around a viewport
   * point. A soft (cosine) edge matters: sharp single-cell pokes make the
   * simulation ring with grainy checkerboard noise.
   */
  private splash(px: number, py: number, strength: number, radius: number) {
    const fx = px / CELL + 1;
    const fy = py / CELL + 1;
    const cx = Math.round(fx);
    const cy = Math.round(fy);
    for (let y = -radius; y <= radius; y++) {
      for (let x = -radius; x <= radius; x++) {
        const gx = cx + x;
        const gy = cy + y;
        if (gx < 1 || gy < 1 || gx >= this.cols - 1 || gy >= this.rows - 1) continue;
        const d = Math.hypot(gx - fx, gy - fy) / radius;
        if (d >= 1) continue;
        this.current[gy * this.cols + gx] -= strength * 0.5 * (1 + Math.cos(Math.PI * d));
      }
    }
  }

  private wake() {
    this.stillFrames = 0;
    if (!this.frame) this.frame = requestAnimationFrame(this.tick);
  }

  private readonly tick = () => {
    const energy = this.step();
    this.draw();

    // Sleep once the surface has settled for a moment
    this.stillFrames = energy < 0.6 ? this.stillFrames + 1 : 0;
    if (this.stillFrames > 20) {
      this.current.fill(0);
      this.previous.fill(0);
      this.ctx!.clearRect(0, 0, this.cols, this.rows);
      this.frame = 0;
      return;
    }
    this.frame = requestAnimationFrame(this.tick);
  };

  /** One step of the classic two-buffer wave equation. Returns peak height. */
  private step(): number {
    const { cols, rows } = this;
    const cur = this.current;
    const prev = this.previous;
    let peak = 0;

    for (let y = 1; y < rows - 1; y++) {
      const row = y * cols;
      for (let x = 1; x < cols - 1; x++) {
        const i = row + x;
        const next = ((cur[i - 1] + cur[i + 1] + cur[i - cols] + cur[i + cols]) / 2 - prev[i]) * DAMPING;
        prev[i] = next;
        const a = next < 0 ? -next : next;
        if (a > peak) peak = a;
      }
    }

    this.previous = cur;
    this.current = prev;
    return peak;
  }

  /** Turn surface slope into light: crests facing the light glow, the far side darkens. */
  private draw() {
    const { cols, rows } = this;
    const h = this.current;
    const data = this.image!.data;

    for (let y = 1; y < rows - 1; y++) {
      const row = y * cols;
      for (let x = 1; x < cols - 1; x++) {
        const i = row + x;
        // Light from the top-left
        const light = (h[i - 1] - h[i + 1]) * 0.6 + (h[i - cols] - h[i + cols]) * 0.8;
        const o = i * 4;
        if (light > 0) {
          data[o] = HIGHLIGHT[0];
          data[o + 1] = HIGHLIGHT[1];
          data[o + 2] = HIGHLIGHT[2];
          data[o + 3] = Math.min(light * SHADE, MAX_HIGHLIGHT) * 255;
        } else {
          data[o] = SHADOW[0];
          data[o + 1] = SHADOW[1];
          data[o + 2] = SHADOW[2];
          data[o + 3] = Math.min(-light * SHADE, MAX_SHADOW) * 255;
        }
      }
    }
    this.ctx!.putImageData(this.image!, 0, 0);
  }
}
