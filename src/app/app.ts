import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Contact } from './sections/contact/contact';
import { Facilities } from './sections/facilities/facilities';
import { Faq } from './sections/faq/faq';
import { Hero } from './sections/hero/hero';
import { Hours } from './sections/hours/hours';
import { Pricing } from './sections/pricing/pricing';
import { SiteFooter } from './sections/site-footer/site-footer';
import { SiteHeader } from './sections/site-header/site-header';
import { Team } from './sections/team/team';
import { PoolWater } from './shared/pool-water/pool-water';
import { WaterRipples } from './shared/water-ripples/water-ripples';

@Component({
  selector: 'app-root',
  imports: [SiteHeader, Hero, Facilities, Pricing, Hours, Team, Faq, Contact, SiteFooter, PoolWater, WaterRipples],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
