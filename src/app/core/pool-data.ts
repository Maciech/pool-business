import { Facility, FaqItem, OpeningSlot, PassOption, PriceTier, Session, TeamMember } from './models';

/**
 * Static content for the site. There is no backend yet, so everything the
 * UI shows lives here. Swap these constants for HTTP calls later.
 */

export const BUSINESS = {
  name: 'Halcyon Lido',
  tagline: 'Open-air swimming since 1962',
  address: '14 Promenade Walk, Riverside',
  phone: '+48 600 123 456',
  email: 'hello@halcyonlido.example',
  waterTempC: 27,
  currency: 'zł',
} as const;

export const PASS_OPTIONS: PassOption[] = [
  { id: 'single', label: 'Single visit', hint: 'Pay as you swim' },
  { id: 'tenVisit', label: '10-visit card', hint: 'Valid 6 months' },
  { id: 'monthly', label: 'Monthly', hint: 'Unlimited entry' },
];

export const PRICE_TIERS: PriceTier[] = [
  {
    category: 'adult',
    label: 'Adult',
    who: 'Ages 16–64',
    prices: { single: 32, tenVisit: 270, monthly: 189 },
    perks: ['All pools & lanes', 'Steam room access', 'Locker included'],
  },
  {
    category: 'child',
    label: 'Kid',
    who: 'Ages 3–15',
    prices: { single: 18, tenVisit: 150, monthly: 99 },
    perks: ['Splash lagoon & slides', 'Learner pool', 'Under 8s with an adult'],
  },
  {
    category: 'family',
    label: 'Family',
    who: '2 adults + up to 3 kids',
    prices: { single: 79, tenVisit: 690, monthly: 449 },
    perks: ['Everything for the whole crew', 'Free cabana on weekdays', 'Birthday discount 15%'],
    featured: true,
  },
  {
    category: 'concession',
    label: 'Student & Senior',
    who: 'Students with ID · 65+',
    prices: { single: 22, tenVisit: 190, monthly: 129 },
    perks: ['All pools & lanes', 'Quiet lanes 7–9 am', 'Locker included'],
  },
  {
    category: 'toddler',
    label: 'Little ones',
    who: 'Under 3',
    prices: { single: 0, tenVisit: 0, monthly: 0 },
    perks: ['Always free', 'Baby-change cabins', 'Swim nappies at reception'],
  },
];

export const EXTRAS = [
  { label: 'Sauna & hot tub add-on', price: 15 },
  { label: 'Private lane, 45 min', price: 120 },
  { label: 'Cabana rental, full day', price: 90 },
  { label: 'Towel & robe hire', price: 12 },
];

export const OPENING_HOURS: OpeningSlot[] = [
  { day: 1, open: '06:30', close: '21:30', note: 'Early birds 6:30–8:00' },
  { day: 2, open: '06:30', close: '21:30' },
  { day: 3, open: '06:30', close: '21:30', note: 'Adults-only swim 20:00' },
  { day: 4, open: '06:30', close: '21:30' },
  { day: 5, open: '06:30', close: '22:30', note: 'Floodlit late swim' },
  { day: 6, open: '08:00', close: '20:00', note: 'Family day' },
  { day: 0, open: '08:00', close: '19:00' },
];

export const HOLIDAY_NOTE =
  'Public holidays: 09:00–17:00. Closed 24–26 Dec & 1 Jan. Last entry 45 minutes before closing.';

export const SESSIONS: Session[] = [
  { day: 1, start: '06:30', end: '08:00', title: 'Early bird lanes', area: '50 m pool', kind: 'lanes' },
  { day: 1, start: '16:00', end: '17:00', title: 'Junior swim school', area: 'Learner pool', kind: 'lessons' },
  { day: 1, start: '19:00', end: '19:45', title: 'Aqua fit', area: 'Shallow end', kind: 'fitness' },
  { day: 2, start: '07:00', end: '08:00', title: 'Masters squad', area: '50 m pool', kind: 'lanes' },
  { day: 2, start: '10:00', end: '10:45', title: 'Parent & baby splash', area: 'Learner pool', kind: 'family' },
  { day: 2, start: '18:00', end: '19:00', title: 'Adult stroke clinic', area: '50 m pool', kind: 'lessons' },
  { day: 3, start: '06:30', end: '08:00', title: 'Early bird lanes', area: '50 m pool', kind: 'lanes' },
  { day: 3, start: '16:00', end: '17:00', title: 'Junior swim school', area: 'Learner pool', kind: 'lessons' },
  { day: 3, start: '20:00', end: '21:30', title: 'Adults-only swim', area: 'All pools', kind: 'lanes' },
  { day: 4, start: '09:30', end: '10:15', title: 'Gentle aqua (55+)', area: 'Shallow end', kind: 'fitness' },
  { day: 4, start: '17:00', end: '18:00', title: 'Teen lifesaving', area: '50 m pool', kind: 'lessons' },
  { day: 4, start: '19:00', end: '19:45', title: 'Aqua HIIT', area: 'Shallow end', kind: 'fitness' },
  { day: 5, start: '07:00', end: '08:00', title: 'Masters squad', area: '50 m pool', kind: 'lanes' },
  { day: 5, start: '16:00', end: '17:00', title: 'Junior swim school', area: 'Learner pool', kind: 'lessons' },
  { day: 5, start: '20:30', end: '22:30', title: 'Floodlit late swim', area: 'All pools', kind: 'lanes' },
  { day: 6, start: '09:00', end: '12:00', title: 'Inflatable obstacle run', area: 'Splash lagoon', kind: 'family' },
  { day: 6, start: '10:00', end: '11:00', title: 'Weekend swim school', area: 'Learner pool', kind: 'lessons' },
  { day: 6, start: '15:00', end: '16:00', title: 'Family water polo', area: 'Shallow end', kind: 'family' },
  { day: 0, start: '08:00', end: '10:00', title: 'Lane swim only', area: '50 m pool', kind: 'lanes' },
  { day: 0, start: '11:00', end: '12:00', title: 'Parent & toddler', area: 'Learner pool', kind: 'family' },
  { day: 0, start: '17:00', end: '17:45', title: 'Sunset stretch & float', area: 'Shallow end', kind: 'fitness' },
];

export const FACILITIES: Facility[] = [
  {
    id: 'lap',
    name: 'The 50 m lap pool',
    stat: '8',
    statLabel: 'lanes',
    description: 'Olympic-length, heated to 27 °C all season, with slow, medium and fast lanes marked every morning.',
    tone: 'pool',
  },
  {
    id: 'lagoon',
    name: 'Splash lagoon',
    stat: '0.4',
    statLabel: 'm deep',
    description: 'Zero-depth beach entry, water cannons, a tipping bucket and two curly slides for little swimmers.',
    tone: 'sun',
  },
  {
    id: 'learner',
    name: 'Learner pool',
    stat: '31',
    statLabel: '°C',
    description: 'Warm, calm and enclosed: home to our swim school, baby classes and gentle aqua sessions.',
    tone: 'flag',
  },
  {
    id: 'sauna',
    name: 'Sauna & hot tub',
    stat: '85',
    statLabel: '°C',
    description: 'Cedar sauna, steam room and a 12-seat hot tub overlooking the river. Adults and 16+ only.',
    tone: 'deep',
  },
];

export const TEAM: TeamMember[] = [
  {
    name: 'Marta Kowalczyk',
    role: 'Head of Aquatics',
    bio: 'Former national-level backstroker who has run poolside operations for 14 years. She writes the lane plan every morning.',
    certs: ['Pool Operator L3', 'ASA Coach'],
    initials: 'MK',
    swatch: 'var(--pool)',
  },
  {
    name: 'Tomasz Nowak',
    role: 'Senior Lifeguard',
    bio: 'Leads our 12-strong lifeguard crew and trains new recruits in rescue and first response.',
    certs: ['NPLQ Trainer', 'First Aid Instructor'],
    initials: 'TN',
    swatch: 'var(--flag)',
  },
  {
    name: 'Ola Wiśniewska',
    role: 'Swim School Lead',
    bio: 'Has taught over 2,000 kids to swim using games, songs and plenty of patience.',
    certs: ['STA Teacher', 'Baby & Pre-school'],
    initials: 'OW',
    swatch: 'var(--sun)',
  },
  {
    name: 'Kuba Lewandowski',
    role: 'Masters & Tri Coach',
    bio: 'Ironman finisher who coaches the early-morning squad and the adult stroke clinics.',
    certs: ['Triathlon Coach L2', 'Open Water'],
    initials: 'KL',
    swatch: 'var(--chlorine)',
  },
];

export const FAQ: FaqItem[] = [
  {
    q: 'Do I need to book in advance?',
    a: 'Walk-ins are welcome most days. On summer weekends we cap capacity, so booking a time slot guarantees entry.',
  },
  {
    q: 'Can children swim on their own?',
    a: 'Kids aged 8 and over who can swim 25 m may swim without an adult. Under 8s need an adult (16+) in the water with them, one adult for every two children.',
  },
  {
    q: 'What should I bring?',
    a: 'Swimwear, a towel and a 5 zł coin or token for the lockers. Swim caps are recommended in the lap pool. Towels and robes can also be hired.',
  },
  {
    q: 'Is the pool accessible?',
    a: 'Yes. There is step-free access throughout, a pool hoist on the 50 m and learner pools, accessible changing rooms and free entry for carers.',
  },
  {
    q: 'Do you host birthday parties?',
    a: 'Yes. Our 90-minute lagoon parties include an inflatable session, a party room and a lifeguard host. Send us an enquiry below to check dates.',
  },
  {
    q: 'What happens if it rains?',
    a: 'We stay open. The pools are heated and the water feels warmer than the air on a rainy day. We only close the pool for lightning, and we refund tickets if that happens.',
  },
];
