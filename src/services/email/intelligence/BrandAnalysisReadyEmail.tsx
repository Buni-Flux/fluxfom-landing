import { Row, Section, Text } from '@react-email/components';
import React from 'react';

import { EmailLayout } from '../templates/Layout';
import { Header } from '../templates/Header';
import { CTAButton } from '../templates/CTAButton';
import { Footer } from '../templates/Footer';
import { MetricCard } from '../templates/MetricCard';
import { InsightCard } from '../templates/InsightCard';
import type { BrandAnalysisReadyEmailProps } from '../email.types';

export function BrandAnalysisReadyEmail({ clientName, brandName, overallScore, opportunities, competitors, dashboardUrl, analysisDate }: BrandAnalysisReadyEmailProps) {
  return (
    <EmailLayout previewText={`We have completed our analysis of ${brandName}.`} title="Brand intelligence ready">
      <Header eyebrow="Brand Intelligence" title={`We’ve completed our analysis of ${brandName}`}>
        <Text style={{ margin: 0, fontSize: '15px', lineHeight: 1.7, color: '#4b544b' }}>
          {clientName}, the work is now in place and the most important opportunities are clear enough to act on.
        </Text>
      </Header>
      <Section style={{ backgroundColor: '#f7faf7', borderRadius: '18px', padding: '18px', marginBottom: '20px', border: '1px solid #e9f0e9' }}>
        <Text style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 700, color: '#103b1b' }}>
          We reviewed your position, the competitive field and the signals that matter most. The overall score is {overallScore}/100.
        </Text>
        <Text style={{ margin: 0, fontSize: '14px', lineHeight: 1.7, color: '#4b544b' }}>
          This matters because it helps us focus the next phase on the areas that will create the most leverage.
        </Text>
      </Section>
      <Row>
        <MetricCard label="Overall score" value={`${overallScore}/100`} />
        <MetricCard label="Analysis date" value={analysisDate ?? 'Today'} />
      </Row>
      <Section style={{ marginTop: '12px' }}>
        <Text style={{ margin: '0 0 10px', fontSize: '16px', fontWeight: 700, color: '#103b1b' }}>What stands out</Text>
        {opportunities.map((opportunity) => (
          <InsightCard key={opportunity} title="Opportunity" body={opportunity} />
        ))}
      </Section>
      <Section style={{ marginTop: '16px' }}>
        <Text style={{ margin: '0 0 10px', fontSize: '16px', fontWeight: 700, color: '#103b1b' }}>Competitive context</Text>
        {competitors.slice(0, 2).map((competitor) => (
          <InsightCard key={competitor.name} title={competitor.name} body={competitor.description} />
        ))}
      </Section>
      <Section style={{ marginTop: '20px' }}>
        <Text style={{ margin: '0 0 12px', fontSize: '15px', lineHeight: 1.7, color: '#4b544b' }}>
          The recommended next step is to review the dashboard and confirm which opportunity we should advance first.
        </Text>
        <CTAButton href={dashboardUrl} label="Review the analysis" />
      </Section>
      <Footer />
    </EmailLayout>
  );
}
