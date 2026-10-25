export type TicketCategory = 'adult' | 'child' | 'concession' | 'family' | 'toddler';

export type PassType = 'single' | 'tenVisit' | 'monthly';

export interface PriceTier {
  category: TicketCategory;
  label: string;
  who: string;
  /** Price per pass type, in whole currency units. `null` means not offered. */
  prices: Record<PassType, number | null>;
  perks: string[];
  featured?: boolean;
}

export interface PassOption {
  id: PassType;
  label: string;
  hint: string;
}

/** 0 = Sunday … 6 = Saturday, matching `Date#getDay()`. */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface OpeningSlot {
  day: Weekday;
  /** "HH:mm", 24h */
  open: string;
  close: string;
  note?: string;
}

export interface Session {
  day: Weekday;
  start: string;
  end: string;
  title: string;
  area: string;
  kind: 'lanes' | 'lessons' | 'fitness' | 'family';
}

export interface Facility {
  id: string;
  name: string;
  stat: string;
  statLabel: string;
  description: string;
  tone: 'pool' | 'sun' | 'flag' | 'deep';
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  certs: string[];
  initials: string;
  swatch: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface Enquiry {
  name: string;
  email: string;
  topic: 'booking' | 'lessons' | 'party' | 'membership' | 'other';
  date: string;
  guests: number;
  message: string;
}
