import { DestroyRef, Injectable, inject, signal } from '@angular/core';

/** A ticking "now" signal so time-based UI (open/closed, today) stays live. */
@Injectable({ providedIn: 'root' })
export class ClockService {
  private readonly _now = signal(new Date());
  readonly now = this._now.asReadonly();

  constructor() {
    const id = setInterval(() => this._now.set(new Date()), 30_000);
    inject(DestroyRef).onDestroy(() => clearInterval(id));
  }
}
