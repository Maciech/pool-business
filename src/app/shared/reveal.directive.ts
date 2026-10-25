import { Directive, ElementRef, afterNextRender, inject, input, signal } from '@angular/core';

/** Fades an element in once it scrolls into view. Styles live in styles.scss. */
@Directive({
  selector: '[appReveal]',
  host: {
    '[class.is-revealed]': 'revealed()',
    '[style.--reveal-delay.ms]': 'revealDelay()',
  },
})
export class RevealDirective {
  readonly revealDelay = input(0);
  protected readonly revealed = signal(false);

  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

    afterNextRender(() => {
      if (!('IntersectionObserver' in window)) {
        this.revealed.set(true);
        return;
      }
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            this.revealed.set(true);
            io.disconnect();
          }
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
      );
      io.observe(el);
    });
  }
}
