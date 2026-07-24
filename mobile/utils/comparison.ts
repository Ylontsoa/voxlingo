// Normalise le texte : minuscules + suppression des accents
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, '')
    .trim();
}

export interface WordComparison {
  word: string;
  correct: boolean;
}

export function compareTexts(expected: string, transcribed: string): {
  score: number;
  words: WordComparison[];
} {
  const expectedWords = normalize(expected).split(/\s+/).filter(Boolean);
  const transcribedWords = normalize(transcribed).split(/\s+/).filter(Boolean);

  const words: WordComparison[] = expectedWords.map((word, index) => ({
    word: expected.split(/\s+/)[index] || word,
    correct: transcribedWords[index] === word,
  }));

  const correctCount = words.filter((w) => w.correct).length;
  const score = expectedWords.length > 0
    ? Math.round((correctCount / expectedWords.length) * 100)
    : 0;

  return { score, words };
}