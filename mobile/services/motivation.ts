const MESSAGES = {
  excellent: [
    '🌟 Parfait ! Tu es un pro !',
    '🎯 Excellent ! Continue comme ca !',
    '🏆 Impressionnant ! Quel talent !',
    '💎 Tu maitrises parfaitement !',
  ],
  good: [
    '👍 Bien joue ! Continue comme ca !',
    '👏 Bon travail ! Tu progresses bien !',
    '💪 Solide performance !',
    '✨ Tu es sur la bonne voie !',
  ],
  average: [
    '📈 Tu progresses, continue !',
    '🎯 Presque ! Encore un effort !',
    '🔝 Tu t ameliores, persevere !',
    '📊 De mieux en mieux !',
  ],
  low: [
    '📚 Continue de pratiquer, tu progresses !',
    '🌱 Chaque erreur te fait apprendre !',
    '💪 Ne lache rien, tu vas y arriver !',
    '🚀 La pratique rend parfait !',
  ],
};

export function getMotivationMessage(score: number): string {
  const messages = score >= 90 ? MESSAGES.excellent :
                   score >= 70 ? MESSAGES.good :
                   score >= 50 ? MESSAGES.average :
                                 MESSAGES.low;
  return messages[Math.floor(Math.random() * messages.length)];
}