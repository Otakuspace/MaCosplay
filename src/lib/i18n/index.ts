import { thaiTranslations, type TranslationKey } from './thai';

// Simple i18n implementation for Thai language
export function t(key: TranslationKey): string {
  return thaiTranslations[key] || key;
}

// Get nested translation (for objects like categoryIcons)
export function getNestedTranslation(key: keyof typeof thaiTranslations, subKey: string): string {
  const nested = thaiTranslations[key];
  if (typeof nested === 'object' && nested !== null && subKey in nested) {
    return (nested as Record<string, string>)[subKey];
  }
  return subKey;
}

export { thaiTranslations };