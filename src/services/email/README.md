# FluxFom email system

This folder contains a typed, reusable email communication layer for FluxFom.

## Structure

- `email.types.ts` defines strongly typed props for supported email templates.
- `render.ts` renders React Email templates into HTML and plain-text content.
- `sendEmail.ts` sends emails through Resend with retries, logging and preview support.
- `email.events.ts` maps domain events to templates.
- `email.queue.ts` provides an in-memory queue for deferred dispatching.
- `templates/` contains shared layout and presentation primitives.
- Feature folders such as `onboarding/`, `intelligence/` and `marketing/` hold concrete templates.

## Usage

```ts
import { sendEmail } from '@/services/email/sendEmail';
import { EMAIL_EVENTS } from '@/services/email/email.events';

await sendEmail({
  to: 'client@example.com',
  event: EMAIL_EVENTS.BRAND_ANALYSIS_READY,
  props: {
    clientName: 'Mina',
    brandName: 'Northstar Studio',
    overallScore: 84,
    opportunities: ['Clarify the offer'],
    competitors: [{ name: 'Northstar Labs', description: 'A focused design consultancy' }],
    dashboardUrl: 'https://fluxfom.app/insights',
  },
  preview: true,
});
```
