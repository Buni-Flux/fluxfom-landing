import { Button } from '@react-email/components';
import React from 'react';

interface CTAButtonProps {
  href: string;
  label: string;
}

export function CTAButton({ href, label }: CTAButtonProps) {
  return (
    <Button
      href={href}
      style={{
        backgroundColor: '#2baa36',
        borderRadius: '999px',
        color: '#ffffff',
        display: 'inline-block',
        fontSize: '14px',
        fontWeight: 600,
        lineHeight: 1,
        padding: '14px 20px',
        textDecoration: 'none',
      }}
    >
      {label}
    </Button>
  );
}
