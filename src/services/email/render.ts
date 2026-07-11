import { render as renderEmail } from '@react-email/render';
import type { ReactElement } from 'react';

import type { EmailTemplateResult } from './email.types';

export async function renderEmailTemplate(element: ReactElement): Promise<EmailTemplateResult> {
  const [html, text] = await Promise.all([
    renderEmail(element, { pretty: true }),
    renderEmail(element, { plainText: true }),
  ]);

  return {
    subject: 'FluxFom update',
    html,
    text,
  };
}
