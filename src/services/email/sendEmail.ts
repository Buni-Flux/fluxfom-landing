import { resend } from './resend';
import { dispatchEmailEvent, type EmailEventName, type EmailPropsMap } from './email.events';
import type { EmailRecipients } from './email.types';

export interface SendEmailOptions<T extends EmailEventName> {
  to: EmailRecipients;
  event: T;
  props: EmailPropsMap[T];
  from?: string;
  retries?: number;
  preview?: boolean;
  tags?: Array<{ name: string; value: string }>;
}

export interface SendEmailResult {
  success: boolean;
  preview?: boolean;
  subject?: string;
  id?: string;
  error?: string;
}

const DEFAULT_FROM = 'FluxFom <hello@fluxfom.io>';

function normalizeRecipients(recipients: EmailRecipients): string[] {
  if (Array.isArray(recipients)) {
    return recipients.map((recipient) => (typeof recipient === 'string' ? recipient : recipient.address));
  }

  return typeof recipients === 'string' ? [recipients] : [recipients.address];
}

export async function sendEmail<T extends EmailEventName>(options: SendEmailOptions<T>): Promise<SendEmailResult> {
  const { to, event, props, from = DEFAULT_FROM, retries = 1, preview = false, tags } = options;
  const normalizedTo = normalizeRecipients(to);

  try {
    const rendered = await dispatchEmailEvent(event, props);

    if (preview || !import.meta.env.VITE_RESEND_API_KEY) {
      console.info(`[email:preview] ${event}`, rendered.subject);
      return {
        success: true,
        preview: true,
        subject: rendered.subject,
      };
    }

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= retries + 1; attempt += 1) {
      try {
        const response = await resend.emails.send({
          from,
          to: normalizedTo,
          subject: rendered.subject,
          html: rendered.html,
          text: rendered.text,
          tags,
        });

        return {
          success: true,
          id: response.data?.id,
          subject: rendered.subject,
        };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unable to send email');
        console.error(`[email:send] attempt ${attempt} failed for ${event}`, lastError.message);
      }
    }

    return {
      success: false,
      error: lastError?.message ?? 'Unable to send email',
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to process email event';
    console.error(`[email:dispatch] ${event}`, message);
    return {
      success: false,
      error: message,
    };
  }
}
