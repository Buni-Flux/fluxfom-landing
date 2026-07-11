import { Row, Section, Text } from '@react-email/components';
import React from 'react';

import { EmailLayout } from '../templates/Layout';
import { Header } from '../templates/Header';
import { CTAButton } from '../templates/CTAButton';
import { Footer } from '../templates/Footer';
import { MetricCard } from '../templates/MetricCard';
import type { WeeklySummaryEmailProps } from '../email.types';

export function WeeklySummaryEmail({ clientName, score, opportunities, dashboardUrl }: WeeklySummaryEmailProps) {
  return (
    <EmailLayout previewText={`Your weekly update is ready.`} title="Weekly summary">
      <Header eyebrow="Analytics" title={`Your weekly update is ready, ${clientName}`}>
        <Text style={{ margin: 0, fontSize: '15px', lineHeight: 1.7, color: '#4b544b' }}>
          We tracked the last week’s movement so we can point to what is improving and where attention will help most.
        </Text>
      </Header>
      <Section style={{ backgroundColor: '#f7faf7', borderRadius: '18px', padding: '18px', marginBottom: '20px', border: '1px solid #e9f0e9' }}>
        <Text style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 700, color: '#103b1b' }}>
          Weekly movement matters because it gives us an early read on whether the actions we took are producing the expected effect.
        </Text>
      </Section>
      <Row>
        <MetricCard label="Signal" value={score ? `${score}/100` : 'Stable'} />
        <MetricCard label="Focus" value={opportunities?.[0] ?? 'Review and refine'} />
      </Row>
      <Section style={{ marginTop: '20px' }}>
        <Text style={{ margin: '0 0 12px', fontSize: '15px', lineHeight: 1.7, color: '#4b544b' }}>
          The recommended next step is to review the summary and decide which opportunity should move forward this week.
        </Text>
        <CTAButton href={dashboardUrl} label="Open weekly summary" />
      </Section>
      <Footer />
    </EmailLayout>
  );
}
