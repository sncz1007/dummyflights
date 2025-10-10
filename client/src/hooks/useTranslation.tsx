import { translations, type TranslationKey } from '@/lib/translations';
import { useLanguage } from './useLanguage';

export function useTranslation() {
  const { language } = useLanguage();

  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  return { t, language };
}
