import { EMAIL_EVENTS } from '@/services/email/email.events';
import { getResendApiKey } from '@/services/email/resend';
import { sendEmail } from '@/services/email/sendEmail';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const preview = url.searchParams.get('preview') === '1' || !getResendApiKey();

  const result = await sendEmail({
    to: 'peterdaino0@gmail.com',
    event: EMAIL_EVENTS.WELCOME,
    props: {
      clientName: 'Mina',
      workspaceName: 'Northstar Studio',
      dashboardUrl: 'https://app.fluxfom.com/fom-core/analytics',
    },
    preview,
  });

  if (!result.success) {
    return Response.json({ error: result.error }, { status: 500 });
  }

  return Response.json(result);
}