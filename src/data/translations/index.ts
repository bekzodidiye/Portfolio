import { Language, LanguageOption, TranslationSchema } from '../../types/language';
import { uzTranslations } from './uz';
import { enTranslations } from './en';
import { ruTranslations } from './ru';

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'uz', label: 'O\'zbekcha', shortLabel: 'UZ', flag: '🇺🇿' },
  { code: 'en', label: 'English', shortLabel: 'EN', flag: '🇬🇧' },
  { code: 'ru', label: 'Русский', shortLabel: 'RU', flag: '🇷🇺' },
];

export const translations: Record<Language, TranslationSchema> = {
  uz: uzTranslations,
  en: enTranslations,
  ru: ruTranslations,
};
