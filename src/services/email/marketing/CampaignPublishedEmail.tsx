import { Section, Text } from '@react-email/components';
import React from 'react';

import { EmailLayout } from '../templates/Layout';
import { Header } from '../templates/Header';
import { CTAButton } from '../templates/CTAButton';
import { Footer } from '../templates/Footer';
import type { CampaignPublishedEmailProps } from '../email.types';

export function CampaignPublishedEmail({ clientName, campaignName, dashboardUrl, industry }: CampaignPublishedEmailProps) {
  return (
    <EmailLayout previewText={`${campaignName} is live.`} title="Campaign published">
      <Header eyebrow="Marketing" title={`${campaignName} is now live`}>
        <Text style={{ margin: 0, fontSize: '15px', lineHeight: 1.7, color: '#4b544b' }}>
          {clientName}, the campaign is now public and ready for the audience we mapped for {industry ?? 'your market'}.
        </Text>
      </Header>
      <Section style={{ backgroundColor: '#f7faf7', borderRadius: '18px', padding: '18px', marginBottom: '20px', border: '1px solid #e9f0e9' }}>
        <Text style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 700, color: '#103b1b' }}>
          The next step is to watch the first signals closely and adjust before the message has time to lose momentum.
        </Text>
        <Text style={{ margin: 0, fontSize: '14px', lineHeight: 1.7, color: '#4b544b' }}>
          This matters because early response usually tells us whether the positioning is landing clearly or needs refinement.
        </Text>
      </Section>
      <CTAButton href={dashboardUrl} label="Review campaign performance" />
      <Footer />
    </EmailLayout>
  );
}
