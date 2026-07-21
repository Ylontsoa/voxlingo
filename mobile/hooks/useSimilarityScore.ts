import { useMemo } from 'react';
import { compareTexts } from '../utils/comparison';

export function useSimilarityScore(expected: string, transcribed: string) {
  return useMemo(() => compareTexts(expected, transcribed), [expected, transcribed]);
}