import { Section, Text } from '@react-email/components';
import React from 'react';

import { EmailLayout } from '../templates/Layout';
import { Header } from '../templates/Header';
import { CTAButton } from '../templates/CTAButton';
import { Footer } from '../templates/Footer';
import type { InvoiceGeneratedEmailProps } from '../email.types';

export function InvoiceGeneratedEmail({ clientName, invoiceNumber, amount, dashboardUrl }: InvoiceGeneratedEmailProps) {
  return (
    <EmailLayout previewText={`Invoice ${invoiceNumber} is ready.`} title="Invoice generated">
      <Header eyebrow="Billing" title={`Invoice ${invoiceNumber} is ready`}>
        <Text style={{ margin: 0, fontSize: '15px', lineHeight: 1.7, color: '#4b544b' }}>
          {clientName}, the invoice is prepared and the amount due is {amount}.
        </Text>
      </Header>
      <Section style={{ backgroundColor: '#f7faf7', borderRadius: '18px', padding: '18px', marginBottom: '20px', border: '1px solid #e9f0e9' }}>
        <Text style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 700, color: '#103b1b' }}>
          A clear record helps us keep the work moving without confusion around the financial side of delivery.
        </Text>
        <Text style={{ margin: 0, fontSize: '14px', lineHeight: 1.7, color: '#4b544b' }}>
          The recommended next step is to review the invoice and confirm payment so there is no delay in the next phase.
        </Text>
      </Section>
      <CTAButton href={dashboardUrl} label="Review invoice" />
      <Footer />
    </EmailLayout>
  );
}
