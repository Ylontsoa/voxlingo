export interface Lesson {
  id: number;
  language: string;
  level: 'débutant' | 'intermédiaire' | 'avancé';
  theme: string;
  title: string;
  image_url: string | null;
  order_index: number;
  average_score: number | null;
  completion_percent?: number;
  status?: 'not_started' | 'in_progress' | 'completed';
}