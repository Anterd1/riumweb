import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import esTranslation from './locales/es/translation.json';
import enTranslation from './locales/en/translation.json';

i18n
  .use(LanguageDetector) // Detecta el idioma del navegador
  .use(initReactI18next) // Pasa la instancia de i18n a react-i18next
  .init({
    resources: {
      es: {
        translation: esTranslation,
      },
      en: {
        translation: enTranslation,
      },
    },
    fallbackLng: 'es', // Idioma por defecto si no se detecta ninguno
    debug: false,
    interpolation: {
      escapeValue: false, // React ya escapa los valores
    },
    detection: {
      // Orden de detección del idioma
      order: ['localStorage', 'navigator'],
      // Cache del idioma seleccionado
      caches: ['localStorage'],
    },
  });

export default i18n;



