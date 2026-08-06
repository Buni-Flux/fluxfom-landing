export function buildVerificationUrl(baseUrl: string, email: string): string {
  const normalizedBaseUrl = baseUrl.replace(/\/$/, '');
  const params = new URLSearchParams({ email });
  return `${normalizedBaseUrl}/verify-email?${params.toString()}`;
}
