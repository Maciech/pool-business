import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { TicketStore } from './core/ticket.store';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the hero headline', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('lagoons');
  });
});

describe('TicketStore', () => {
  it('uses a family ticket when it is cheaper', () => {
    const store = TestBed.inject(TicketStore);
    store.party.set({ adult: 2, child: 2, concession: 0, toddler: 1 });
    // 2×32 + 2×18 = 100 individually vs 79 for one family ticket
    expect(store.quote().total).toBe(79);
    expect(store.quote().familyTickets).toBe(1);
    expect(store.savings()).toBe(21);
  });

  it('prices individually when no family ticket helps', () => {
    const store = TestBed.inject(TicketStore);
    store.party.set({ adult: 1, child: 0, concession: 0, toddler: 0 });
    expect(store.quote().total).toBe(32);
    expect(store.quote().familyTickets).toBe(0);
  });
});
