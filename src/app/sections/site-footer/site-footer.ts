import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BUSINESS } from '../../core/pool-data';

@Component({
  selector: 'app-site-footer',
  templateUrl: './site-footer.html',
  styleUrl: './site-footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteFooter {
  protected readonly business = BUSINESS;
  protected readonly year = new Date().getFullYear();
}
