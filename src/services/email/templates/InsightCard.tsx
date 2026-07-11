import { Section, Text } from '@react-email/components';
import React from 'react';

interface InsightCardProps {
  title: string;
  body: string;
}

export function InsightCard({ title, body }: InsightCardProps) {
  return (
    <Section style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '16px', border: '1px solid #e6ece6', marginBottom: '12px' }}>
      <Text style={{ margin: '0 0 6px', fontSize: '14px', fontWeight: 700, color: '#103b1b' }}>{title}</Text>
      <Text style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, color: '#4b544b' }}>{body}</Text>
    </Section>
  );
}
