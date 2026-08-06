import { describe, expect, it } from 'vitest';
import { buildVerificationUrl } from './verification';

describe('buildVerificationUrl', () => {
  it('creates a public verification link for the recipient', () => {
    expect(buildVerificationUrl('https://fluxfom.com', 'team@fluxfom.com')).toBe(
      'https://fluxfom.com/verify-email?email=team%40fluxfom.com',
    );
  });
});
