import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormField, email, form, max, maxLength, min, required, submit, validate } from '@angular/forms/signals';
import { Enquiry } from '../../core/models';
import { BUSINESS } from '../../core/pool-data';
import { RevealDirective } from '../../shared/reveal.directive';

const emptyEnquiry = (): Enquiry => ({
  name: '',
  email: '',
  topic: 'booking',
  date: '',
  guests: 2,
  message: '',
});

/** Local date as YYYY-MM-DD (the format `<input type="date">` uses). */
const todayIso = () => new Date().toLocaleDateString('sv-SE');

@Component({
  selector: 'app-contact',
  imports: [FormField, RevealDirective],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contact {
  protected readonly business = BUSINESS;

  protected readonly topics: { id: Enquiry['topic']; label: string }[] = [
    { id: 'booking', label: 'Book a visit' },
    { id: 'lessons', label: 'Swim lessons' },
    { id: 'party', label: 'Birthday party' },
    { id: 'membership', label: 'Membership' },
    { id: 'other', label: 'Something else' },
  ];

  private readonly model = signal<Enquiry>(emptyEnquiry());

  protected readonly enquiryForm = form(this.model, (p) => {
    required(p.name, { message: 'Please tell us your name' });
    required(p.email, { message: 'We need an email to reply to' });
    email(p.email, { message: 'That email doesn’t look right' });
    required(p.date, { message: 'Pick a date' });
    validate(p.date, ({ value }) =>
      value() && value() < todayIso() ? { kind: 'pastDate', message: 'That date has already passed' } : undefined,
    );
    min(p.guests, 1, { message: 'At least one swimmer' });
    max(p.guests, 30, { message: 'For groups over 30, please call us' });
    maxLength(p.message, 600, { message: 'Keep it under 600 characters' });
  });

  /** No backend yet: a "sent" enquiry is kept locally and echoed back. */
  protected readonly sent = signal<Enquiry | null>(null);
  protected readonly sending = signal(false);

  protected readonly messageLength = computed(() => this.model().message.length);

  protected async onSubmit(event: Event) {
    event.preventDefault();
    await submit(this.enquiryForm, async () => {
      this.sending.set(true);
      await new Promise((r) => setTimeout(r, 700));
      this.sent.set(this.model());
      this.sending.set(false);
      return undefined;
    });
  }

  protected reset() {
    this.model.set(emptyEnquiry());
    this.enquiryForm().reset();
    this.sent.set(null);
  }
}
