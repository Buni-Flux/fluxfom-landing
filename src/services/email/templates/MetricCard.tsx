import { Column, Section, Text } from '@react-email/components';
import React from 'react';

interface MetricCardProps {
  label: string;
  value: string;
}

export function MetricCard({ label, value }: MetricCardProps) {
  return (
    <Column style={{ padding: '12px 12px 0 0', width: '50%' }}>
      <Section style={{ backgroundColor: '#f7faf7', borderRadius: '16px', padding: '16px', border: '1px solid #e9f0e9' }}>
        <Text style={{ margin: '0 0 6px', fontSize: '12px', color: '#6b766b', textTransform: 'uppercase', letterSpacing: '0.16em' }}>{label}</Text>
        <Text style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#103b1b' }}>{value}</Text>
      </Section>
    </Column>
  );
}
