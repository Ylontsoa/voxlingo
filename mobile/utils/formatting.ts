export function formatScore(score: number | null): string {
  if (score === null) return '—';
  return `${Math.round(score)}%`;
}

export function formatStreak(days: number): string {
  if (days === 0) return 'Commence ta série aujourd\'hui !';
  return `${days} jour${days > 1 ? 's' : ''} de suite`;
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}