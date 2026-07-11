import { Section, Text } from '@react-email/components';
import React from 'react';

interface FooterProps {
  supportEmail?: string;
}

export function Footer({ supportEmail = 'hello@fluxfom.io' }: FooterProps) {
  return (
    <Section style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #e6ece6' }}>
      <Text style={{ margin: '0 0 4px', fontSize: '12px', lineHeight: 1.5, color: '#6b766b' }}>
        This note is part of our ongoing work on your account. If you want a different approach, reply directly and we will adjust it.
      </Text>
      <Text style={{ margin: 0, fontSize: '12px', lineHeight: 1.5, color: '#6b766b' }}>
        Questions? Reach us at {supportEmail}
      </Text>
    </Section>
  );
}
