export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
}

const BADGE_DEFINITIONS = [
  { id: 'first_practice', name: 'Premier pas', description: 'Premiere phrase completee', icon: '🎤' },
  { id: 'streak_3', name: 'Regulier', description: '3 jours de streak', icon: '🔥' },
  { id: 'streak_7', name: 'Assidu', description: '7 jours de streak', icon: '🔥' },
  { id: 'streak_30', name: 'Inarretable', description: '30 jours de streak', icon: '⚡' },
  { id: 'perfect_10', name: 'Parfait', description: '10 phrases a 100%', icon: '💯' },
  { id: 'phrases_50', name: 'Bavard', description: '50 phrases completees', icon: '🗣️' },
  { id: 'phrases_100', name: 'Orateur', description: '100 phrases completees', icon: '🎙️' },
  { id: 'phrases_500', name: 'Polyglotte', description: '500 phrases completees', icon: '🌍' },
  { id: 'level_5', name: 'Apprenti', description: 'Niveau 5 atteint', icon: '⭐' },
  { id: 'level_10', name: 'Expert', description: 'Niveau 10 atteint', icon: '🌟' },
  { id: 'level_25', name: 'Maitre', description: 'Niveau 25 atteint', icon: '👑' },
  { id: 'all_themes', name: 'Explorateur', description: 'Tous les themes pratiques', icon: '🧭' },
  { id: 'daily_complete', name: 'Quotidien', description: '10 phrases en un jour', icon: '📅' },
];

export function getAllBadges(stats: any, earnedBadges: string[] = []): Badge[] {
  const earned = new Set(earnedBadges);
  const total = stats?.total_phrases || 0;
  const streak = stats?.current_streak || 0;
  const level = stats?.level || 1;
  const perfect = stats?.perfect_count || 0;
  const today = stats?.today_count || 0;

  return BADGE_DEFINITIONS.map(b => ({
    ...b,
    earned: earned.has(b.id) || (
      (b.id === 'first_practice' && total >= 1) ||
      (b.id === 'streak_3' && streak >= 3) ||
      (b.id === 'streak_7' && streak >= 7) ||
      (b.id === 'streak_30' && streak >= 30) ||
      (b.id === 'perfect_10' && perfect >= 10) ||
      (b.id === 'phrases_50' && total >= 50) ||
      (b.id === 'phrases_100' && total >= 100) ||
      (b.id === 'phrases_500' && total >= 500) ||
      (b.id === 'level_5' && level >= 5) ||
      (b.id === 'level_10' && level >= 10) ||
      (b.id === 'level_25' && level >= 25) ||
      (b.id === 'daily_complete' && today >= 10)
    ),
  }));
}

export function getNewBadges(oldBadges: Badge[], newBadges: Badge[]): Badge[] {
  return newBadges.filter(b => b.earned && !oldBadges.find(o => o.id === b.id)?.earned);
}