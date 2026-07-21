export const FLAGS: Record<string, string> = {
  'anglais': 'https://flagcdn.com/w80/gb.png',
  'espagnol': 'https://flagcdn.com/w80/es.png',
  'japonais': 'https://flagcdn.com/w80/jp.png',
  'allemand': 'https://flagcdn.com/w80/de.png',
  'italien': 'https://flagcdn.com/w80/it.png',
  'francais': 'https://flagcdn.com/w80/fr.png',
  'portugais': 'https://flagcdn.com/w80/pt.png',
  'russe': 'https://flagcdn.com/w80/ru.png',
  'chinois': 'https://flagcdn.com/w80/cn.png',
  'coreen': 'https://flagcdn.com/w80/kr.png',
  'arabe': 'https://flagcdn.com/w80/sa.png',
  'neerlandais': 'https://flagcdn.com/w80/nl.png',
};

export function getFlag(language: string): string | null {
  return FLAGS[language.toLowerCase()] || null;
}