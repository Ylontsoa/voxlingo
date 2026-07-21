export interface LanguageOption {
  code: string;
  isoCode: string;
  label: string;
  flag: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'anglais', isoCode: 'en', label: 'Anglais', flag: '🇬🇧' },
  { code: 'espagnol', isoCode: 'es', label: 'Espagnol', flag: '🇪🇸' },
  { code: 'japonais', isoCode: 'ja', label: 'Japonais', flag: '🇯🇵' },
  { code: 'allemand', isoCode: 'de', label: 'Allemand', flag: '🇩🇪' },
  { code: 'italien', isoCode: 'it', label: 'Italien', flag: '🇮🇹' },
  { code: 'francais', isoCode: 'fr', label: 'Français', flag: '🇫🇷' },
];

export function getIsoCode(languageCode: string | undefined | null): string {
  return LANGUAGES.find((l) => l.code === languageCode)?.isoCode || 'en';
}