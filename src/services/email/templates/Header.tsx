import { Section, Text } from '@react-email/components';
import React, { type ReactNode } from 'react';

interface HeaderProps {
  title: string;
  eyebrow?: string;
  children?: ReactNode;
}

export function Header({ title, eyebrow, children }: HeaderProps) {
  return (
    <Section style={{ marginBottom: '24px' }}>
      {eyebrow ? (
        <Text style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: 700, color: '#2baa36', letterSpacing: '0.24em', textTransform: 'uppercase' }}>
          {eyebrow}
        </Text>
      ) : null}
      <Text style={{ margin: 0, fontSize: '30px', lineHeight: 1.2, fontWeight: 600, color: '#103b1b' }}>
        {title}
      </Text>
      {children ? <Section style={{ marginTop: '12px' }}>{children}</Section> : null}
    </Section>
  );
}
