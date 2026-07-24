const SOUNDS_BY_LANGUAGE: Record<string, Record<string, string>> = {
  'anglais': {
    'th': 'Place ta langue entre tes dents et souffle (comme "think")',
    'r': 'Arrondis tes levres et recule ta langue (son americain)',
    'h': 'Expire legerement avant la voyelle (comme "hello")',
    'ch': 'Comme un eternuement doux (comme "church")',
    'sh': 'Comme pour dire chut (comme "she")',
    'ng': 'Son nasal, langue au fond du palais (comme "sing")',
    'v': 'Levre inferieure contre les dents du haut (comme "very")',
    'w': 'Levres arrondies, comme pour embrasser (comme "water")',
    'j': 'Comme le dj mais plus doux (comme "just")',
    'z': 'Vibration des cordes vocales (comme "zoo")',
  },
  'espagnol': {
    'r': 'Roule le r avec la langue (comme "perro")',
    'ñ': 'Comme le gn dans "Espagne"',
    'j': 'Son guttural du fond de la gorge (comme "jamon")',
    'll': 'Comme le y dans "yaourt" (comme "llamar")',
  },
  'japonais': {
    'r': 'Entre le r et le l, langue qui effleure le palais',
    'ts': 'Comme dans "tsunami"',
    'fu': 'Souffle leger entre les levres (pas comme "fou")',
  },
  'allemand': {
    'ch': 'Son guttural du fond de la gorge (comme "Bach")',
    'r': 'Son guttural ou roule selon la region',
    'ü': 'Levres arrondies en disant "i"',
    'ö': 'Levres arrondies en disant "e"',
    'ä': 'Comme le "e" dans "mere"',
  },
  'italien': {
    'r': 'Roule le r avec la langue',
    'gli': 'Comme "lli" dans "milliard"',
    'gn': 'Comme le gn dans "Espagne"',
    'ch': 'Se prononce "k" (comme "che")',
  },
};

const UNIVERSAL_TIPS: Record<string, string> = {
  'th': 'Place ta langue entre tes dents et souffle',
  'r': 'Arrondis tes levres et recule ta langue',
  'h': 'Expire legerement avant la voyelle',
  'ch': 'Comme un eternuement doux',
  'sh': 'Comme pour dire chut',
  'ng': 'Son nasal, langue au fond du palais',
  'v': 'Levre inferieure contre les dents du haut',
  'w': 'Levres arrondies, comme pour embrasser',
};

export function getPhoneticFeedback(target: string, spoken: string, language: string = 'anglais'): string[] {
  const tips: string[] = [];
  const lowerTarget = target.toLowerCase();
  const lowerSpoken = spoken.toLowerCase();

  const sounds = SOUNDS_BY_LANGUAGE[language] || UNIVERSAL_TIPS;

  for (const [sound, tip] of Object.entries(sounds)) {
    if (lowerTarget.includes(sound) && !lowerSpoken.includes(sound)) {
      tips.push(`Son "${sound}" manquant - ${tip}`);
    }
  }

  return tips;
}

// ✅ Distance de Levenshtein (nombre de lettres qui different entre 2 mots)
function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // suppression
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

// ✅ Mots oublies, avec tolerance phonetique (1 lettre de difference acceptee)
export function getMissingWords(target: string, spoken: string): string[] {
  const targetWords = target.toLowerCase().split(' ').filter(w => w.length > 0);
  const spokenWords = spoken.toLowerCase().split(' ').filter(w => w.length > 0);

  return targetWords.filter(targetWord => {
    if (targetWord.length <= 2) return false; // ignore les petits mots (a, an, my...)
    if (spokenWords.includes(targetWord)) return false; // match exact

    const isSimilar = spokenWords.some(spokenWord => {
      if (targetWord.length >= 3 && spokenWord.length >= 3) {
        if (targetWord.slice(0, 3) === spokenWord.slice(0, 3)) return true;
      }
      return levenshteinDistance(targetWord, spokenWord) <= 1;
    });

    return !isSimilar;
  });
}

export function getExtraWords(target: string, spoken: string): string[] {
  const targetWords = target.toLowerCase().split(' ').filter(w => w.length > 0);
  const spokenWords = spoken.toLowerCase().split(' ').filter(w => w.length > 0);
  const significantWords = spokenWords.filter(w => w.length > 2);
  return significantWords.filter(word => !targetWords.includes(word));
}

export function getLengthFeedback(target: string, spoken: string): string[] {
  const targetWords = target.split(' ').filter(w => w.length > 0).length;
  const spokenWords = spoken.split(' ').filter(w => w.length > 0).length;
  const tips: string[] = [];

  if (spokenWords < targetWords) {
    tips.push(`Il manque ${targetWords - spokenWords} mot(s)`);
  } else if (spokenWords > targetWords) {
    tips.push(`${spokenWords - targetWords} mot(s) en trop`);
  }

  return tips;
}

export function getDetailedFeedback(target: string, spoken: string, language?: string): {
  phoneticTips: string[];
  missingWords: string[];
  extraWords: string[];
  lengthTips: string[];
} {
  return {
    phoneticTips: getPhoneticFeedback(target, spoken, language),
    missingWords: getMissingWords(target, spoken),
    extraWords: getExtraWords(target, spoken),
    lengthTips: getLengthFeedback(target, spoken),
  };
}