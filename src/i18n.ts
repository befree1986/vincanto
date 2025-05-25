import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationIT from './locales/it/translation.json';
import translationEN from './locales/en/translation.json';
import translationDE from './locales/de/translation.json';

const resources = {
  it: { translation: translationIT },
  en: { translation: translationEN },
  de: { translation: translationDE }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'it',
    fallbackLng: 'it',
    interpolation: { escapeValue: false },
  });

export default i18n;
