import { Resend } from 'resend';

export function getResendApiKey(): string | undefined {
  return import.meta.env.VITE_RESEND_API_KEY ?? process.env.RESEND_API_KEY;
}

const apiKey = getResendApiKey();

export const resend = apiKey ? new Resend(apiKey) : null;