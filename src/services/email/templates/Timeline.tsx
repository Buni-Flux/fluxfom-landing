import { Section, Text } from '@react-email/components';
import React from 'react';

interface TimelineStep {
  title: string;
  body: string;
}

interface TimelineProps {
  steps: TimelineStep[];
}

export function Timeline({ steps }: TimelineProps) {
  return (
    <Section>
      {steps.map((step, index) => (
        <Section key={step.title} style={{ marginBottom: '12px', paddingLeft: '12px', borderLeft: '2px solid #e6ece6' }}>
          <Text style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 700, color: '#103b1b' }}>
            {index + 1}. {step.title}
          </Text>
          <Text style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, color: '#4b544b' }}>{step.body}</Text>
        </Section>
      ))}
    </Section>
  );
}
