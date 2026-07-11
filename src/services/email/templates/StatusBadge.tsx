import { Section, Text } from '@react-email/components';
import React from 'react';

interface StatusBadgeProps {
  label: string;
}

export function StatusBadge({ label }: StatusBadgeProps) {
  return (
    <Section style={{ marginBottom: '12px' }}>
      <Text style={{ display: 'inline-block', margin: 0, padding: '6px 12px', borderRadius: '999px', backgroundColor: '#f4fbf6', color: '#2baa36', fontSize: '12px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
        {label}
      </Text>
    </Section>
  );
}
