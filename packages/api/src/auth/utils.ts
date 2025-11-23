const MILLISECONDS_PER_SECOND = 1000;

export function calculateExpiresAt(timestamp: number, expiresIn: number): Date {
  return new Date(timestamp * MILLISECONDS_PER_SECOND + expiresIn * MILLISECONDS_PER_SECOND);
}
