import { Section, Text } from '@react-email/components';
import React from 'react';

import { EmailLayout } from '../templates/Layout';
import { Header } from '../templates/Header';
import { CTAButton } from '../templates/CTAButton';
import { Footer } from '../templates/Footer';
import type { ProjectCompletedEmailProps } from '../email.types';

export function ProjectCompletedEmail({ clientName, projectName, assetUrl, dashboardUrl }: ProjectCompletedEmailProps) {
  return (
    <EmailLayout previewText={`${projectName} is complete.`} title="Project completed">
      <Header eyebrow="Production" title={`${projectName} is complete`}>
        <Text style={{ margin: 0, fontSize: '15px', lineHeight: 1.7, color: '#4b544b' }}>
          {clientName}, the delivery is ready and we have kept the work aligned to the decisions we made earlier.
        </Text>
      </Header>
      <Section style={{ backgroundColor: '#f7faf7', borderRadius: '18px', padding: '18px', marginBottom: '20px', border: '1px solid #e9f0e9' }}>
        <Text style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 700, color: '#103b1b' }}>
          The files are prepared for review and the best next step is to confirm the final use case.
        </Text>
        <Text style={{ margin: 0, fontSize: '14px', lineHeight: 1.7, color: '#4b544b' }}>
          This matters because the handoff is strongest when the context around the assets is clear.
        </Text>
      </Section>
      <CTAButton href={assetUrl || dashboardUrl} label="Open delivery" />
      <Footer />
    </EmailLayout>
  );
}
