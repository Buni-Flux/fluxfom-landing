import { describe, expect, it, vi } from 'vitest';

import { GET } from './route';

describe('GET /api/test-email', () => {
  it('returns a preview response when resend is not configured', async () => {
    vi.stubEnv('VITE_RESEND_API_KEY', '');

    const response = await GET(new Request('http://localhost/api/test-email?preview=1'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.success).toBe(true);
    expect(payload.preview).toBe(true);
    expect(payload.subject).toContain('FluxFom');
  });
});
