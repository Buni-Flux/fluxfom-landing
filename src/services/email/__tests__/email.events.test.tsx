import { describe, expect, it } from 'vitest';

import { dispatchEmailEvent, EMAIL_EVENTS } from '../email.events';

describe('dispatchEmailEvent', () => {
  it('renders a branded email for a known event', async () => {
    const result = await dispatchEmailEvent(EMAIL_EVENTS.BRAND_ANALYSIS_READY, {
      clientName: 'Mina',
      brandName: 'Northstar Studio',
      overallScore: 84,
      opportunities: ['Clarify the offer', 'Strengthen social proof'],
      competitors: [
        { name: 'Northstar Labs', description: 'A focused design consultancy' },
        { name: 'Brightline', description: 'A content-led growth agency' },
      ],
      dashboardUrl: 'https://fluxfom.app/insights',
    });

    expect(result.subject).toContain('Brand Intelligence');
    expect(result.text).toContain('Northstar Studio');
    expect(result.text).toContain('84');
  });
});
