import { Injectable, computed, signal } from '@angular/core';
import { PassType, TicketCategory } from './models';
import { PRICE_TIERS } from './pool-data';

export type PartyCounts = Record<Exclude<TicketCategory, 'family'>, number>;

export interface Quote {
  total: number;
  individualTotal: number;
  familyTickets: number;
  lines: { label: string; qty: number; subtotal: number }[];
}

const FAMILY_GROWNUPS = 2;
const FAMILY_KIDS = 3;
const MAX_PER_CATEGORY = 12;

/** Signal-based state for the pricing section and the ticket calculator. */
@Injectable({ providedIn: 'root' })
export class TicketStore {
  readonly passType = signal<PassType>('single');
  readonly party = signal<PartyCounts>({ adult: 2, child: 2, concession: 0, toddler: 0 });

  readonly tiers = computed(() =>
    PRICE_TIERS.map((tier) => ({ ...tier, price: tier.prices[this.passType()] })),
  );

  private readonly price = computed(() => {
    const pass = this.passType();
    const byCat = Object.fromEntries(PRICE_TIERS.map((t) => [t.category, t.prices[pass] ?? 0]));
    return byCat as Record<TicketCategory, number>;
  });

  readonly headcount = computed(() => Object.values(this.party()).reduce((a, b) => a + b, 0));

  /**
   * Cheapest combination of family tickets and individual tickets. A family
   * ticket covers two grown-ups (adults first, then concessions) and up to
   * three kids; toddlers are always free.
   */
  readonly quote = computed<Quote>(() => {
    const p = this.price();
    const { adult, child, concession, toddler } = this.party();

    const individualTotal = adult * p.adult + child * p.child + concession * p.concession;
    const maxFamilies = Math.ceil(Math.max((adult + concession) / FAMILY_GROWNUPS, child / FAMILY_KIDS));

    let best = { total: individualTotal, families: 0 };
    for (let f = 1; f <= maxFamilies; f++) {
      let grownupSlots = f * FAMILY_GROWNUPS;
      const coveredAdults = Math.min(adult, grownupSlots);
      grownupSlots -= coveredAdults;
      const coveredConc = Math.min(concession, grownupSlots);
      const coveredKids = Math.min(child, f * FAMILY_KIDS);

      const total =
        f * p.family +
        (adult - coveredAdults) * p.adult +
        (concession - coveredConc) * p.concession +
        (child - coveredKids) * p.child;

      if (total < best.total) best = { total, families: f };
    }

    const lines: Quote['lines'] = [];
    if (best.families) {
      lines.push({ label: 'Family ticket', qty: best.families, subtotal: best.families * p.family });
      let slots = best.families * FAMILY_GROWNUPS;
      const a = Math.max(0, adult - slots);
      slots = Math.max(0, slots - adult);
      const c = Math.max(0, concession - slots);
      const k = Math.max(0, child - best.families * FAMILY_KIDS);
      if (a) lines.push({ label: 'Adult', qty: a, subtotal: a * p.adult });
      if (c) lines.push({ label: 'Student & Senior', qty: c, subtotal: c * p.concession });
      if (k) lines.push({ label: 'Kid', qty: k, subtotal: k * p.child });
    } else {
      if (adult) lines.push({ label: 'Adult', qty: adult, subtotal: adult * p.adult });
      if (concession) lines.push({ label: 'Student & Senior', qty: concession, subtotal: concession * p.concession });
      if (child) lines.push({ label: 'Kid', qty: child, subtotal: child * p.child });
    }
    if (toddler) lines.push({ label: 'Little ones', qty: toddler, subtotal: 0 });

    return { total: best.total, individualTotal, familyTickets: best.families, lines };
  });

  readonly savings = computed(() => this.quote().individualTotal - this.quote().total);

  setPass(pass: PassType) {
    this.passType.set(pass);
  }

  adjust(category: keyof PartyCounts, delta: number) {
    this.party.update((p) => ({
      ...p,
      [category]: Math.min(MAX_PER_CATEGORY, Math.max(0, p[category] + delta)),
    }));
  }
}
