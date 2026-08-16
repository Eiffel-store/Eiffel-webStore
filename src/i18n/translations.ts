import { Language, TranslationDictionary } from './types';
import { en } from './locales/en';
import { ar } from './locales/ar';

export type { Language, TranslationDictionary };
export { en, ar };

export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  en,
  ar
};

export default TRANSLATIONS;
