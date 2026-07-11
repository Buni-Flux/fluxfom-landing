import { Section, Text } from '@react-email/components';
import React from 'react';

import { EmailLayout } from '../templates/Layout';
import { Header } from '../templates/Header';
import { CTAButton } from '../templates/CTAButton';
import { Footer } from '../templates/Footer';
import type { VerifyEmailProps } from '../email.types';

export function VerifyEmail({ clientName, verificationUrl }: VerifyEmailProps) {
  return (
    <EmailLayout previewText={`Verify your email, ${clientName}.`} title="Verify your email">
      <Header eyebrow="Security" title={`Verify your email, ${clientName}`}>
        <Text style={{ margin: 0, fontSize: '15px', lineHeight: 1.7, color: '#4b544b' }}>
          Confirming your address helps us keep your account access reliable and protected.
        </Text>
      </Header>
      <Section style={{ backgroundColor: '#f7faf7', borderRadius: '18px', padding: '18px', marginBottom: '20px', border: '1px solid #e9f0e9' }}>
        <Text style={{ margin: 0, fontSize: '15px', lineHeight: 1.7, color: '#4b544b' }}>
          Once verified, we can send you the right updates at the right moment and avoid unnecessary back-and-forth.
        </Text>
      </Section>
      <CTAButton href={verificationUrl} label="Verify email" />
      <Footer />
    </EmailLayout>
  );
}
