import { Section, Text } from '@react-email/components';
import React from 'react';

import { EmailLayout } from '../templates/Layout';
import { Header } from '../templates/Header';
import { CTAButton } from '../templates/CTAButton';
import { Footer } from '../templates/Footer';
import type { WelcomeEmailProps } from '../email.types';

export function WelcomeEmail({ clientName, workspaceName, dashboardUrl }: WelcomeEmailProps) {
  return (
    <EmailLayout previewText={`Welcome to FluxFom, ${clientName}. We are preparing your workspace.`} title="Welcome to FluxFom">
      <Header eyebrow="Onboarding" title={`Welcome, ${clientName}`}>
        <Text style={{ margin: 0, fontSize: '15px', lineHeight: 1.7, color: '#4b544b' }}>
          We are preparing {workspaceName} so your team can begin with clarity rather than noise.
        </Text>
      </Header>
      <Section style={{ backgroundColor: '#f7faf7', borderRadius: '18px', padding: '18px', marginBottom: '20px', border: '1px solid #e9f0e9' }}>
        <Text style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 700, color: '#103b1b' }}>
          The first step is simple: open your workspace and see the structure we have prepared for you.
        </Text>
        <Text style={{ margin: 0, fontSize: '15px', lineHeight: 1.7, color: '#4b544b' }}>
          This gives you a calm place to review decisions, share context and move the work forward with less friction.
        </Text>
      </Section>
      <CTAButton href={dashboardUrl} label="Open your workspace" />
      <Footer />
    </EmailLayout>
  );
}
