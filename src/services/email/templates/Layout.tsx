import { Body, Container, Head, Html, Img, Section, Tailwind, Text } from '@react-email/components';
import React, { type ReactNode } from 'react';

interface EmailLayoutProps {
  children: ReactNode;
  previewText?: string;
  title?: string;
}

const logoUrl = 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=120&q=80';

export function EmailLayout({ children, previewText, title }: EmailLayoutProps) {
  return (
    <Html>
      <Head>
        <title>{title ?? 'FluxFom'}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: {
                  50: '#f4fbf6',
                  100: '#e4f7ea',
                  500: '#2baa36',
                  600: '#247e2b',
                  900: '#103b1b',
                },
              },
              fontFamily: {
                sans: ['Inter', 'Segoe UI', 'Arial', 'sans-serif'],
              },
            },
          },
        }}
      >
        <Body style={{ margin: 0, padding: 0, backgroundColor: '#f4f6f4' }}>
          <Container style={{ maxWidth: '640px', margin: '0 auto', padding: '24px 16px 40px' }}>
            <Section style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '24px', border: '1px solid #e6ece6' }}>
              <Section style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <Img src={logoUrl} alt="FluxFom" width="42" height="42" style={{ borderRadius: '999px' }} />
                <Text style={{ margin: 0, fontSize: '12px', color: '#6b766b', letterSpacing: '0.24em', textTransform: 'uppercase' }}>
                  FluxFom
                </Text>
              </Section>
              {previewText ? <Text style={{ display: 'none', maxHeight: 0, overflow: 'hidden' }}>{previewText}</Text> : null}
              {children}
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
