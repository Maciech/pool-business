import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { OpeningHoursService } from '../../core/opening-hours.service';
import { BUSINESS } from '../../core/pool-data';

@Component({
  selector: 'app-site-header',
  templateUrl: './site-header.html',
  styleUrl: './site-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.is-scrolled]': 'scrolled()',
    '(window:scroll)': 'onScroll()',
    '(document:keydown.escape)': 'menuOpen.set(false)',
  },
})
export class SiteHeader {
  protected readonly hours = inject(OpeningHoursService);
  protected readonly business = BUSINESS;

  protected readonly menuOpen = signal(false);
  protected readonly scrolled = signal(false);

  protected readonly links = [
    { href: '#pools', label: 'Pools' },
    { href: '#prices', label: 'Prices' },
    { href: '#hours', label: 'Hours' },
    { href: '#team', label: 'Team' },
    { href: '#faq', label: 'FAQ' },
    { href: '#contact', label: 'Contact' },
  ];

  protected onScroll() {
    this.scrolled.set(window.scrollY > 24);
  }

  protected toggleMenu() {
    this.menuOpen.update((open) => !open);
  }
}
