export interface ProgressEntry {
  phrase_id: number;
  lesson_id: number;
  score: number;
  transcription: string;
}

export interface Stats {
  current_streak: number;
  average_score: number;
  xp: number;
  level: number;
  xp_in_level: number;
  xp_per_level: number;
}