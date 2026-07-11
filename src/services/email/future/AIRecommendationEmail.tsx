import { Section, Text } from '@react-email/components';
import React from 'react';

import { EmailLayout } from '../templates/Layout';
import { Header } from '../templates/Header';
import { CTAButton } from '../templates/CTAButton';
import { Footer } from '../templates/Footer';
import type { AIRecommendationEmailProps } from '../email.types';

export function AIRecommendationEmail({ clientName, brandName, opportunities, dashboardUrl }: AIRecommendationEmailProps) {
  return (
    <EmailLayout previewText={`A new recommendation is waiting for ${brandName}.`} title="AI recommendation">
      <Header eyebrow="Future AI" title={`A recommendation is waiting for ${brandName}`}>
        <Text style={{ margin: 0, fontSize: '15px', lineHeight: 1.7, color: '#4b544b' }}>
          {clientName}, our system has identified a useful next move that fits the direction of your brand.
        </Text>
      </Header>
      <Section style={{ backgroundColor: '#f7faf7', borderRadius: '18px', padding: '18px', marginBottom: '20px', border: '1px solid #e9f0e9' }}>
        <Text style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 700, color: '#103b1b' }}>
          The opportunity is not just interesting; it is relevant to the current strategy and worth testing.
        </Text>
        <Text style={{ margin: 0, fontSize: '14px', lineHeight: 1.7, color: '#4b544b' }}>
          {opportunities.slice(0, 2).join(' • ')}
        </Text>
      </Section>
      <CTAButton href={dashboardUrl} label="Review recommendation" />
      <Footer />
    </EmailLayout>
  );
}
