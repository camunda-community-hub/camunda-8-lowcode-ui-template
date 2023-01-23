import i18next, { i18n as i18nInstance } from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import { env } from '../env';



const createI18n = (): i18nInstance => {
  const i18n = i18next.createInstance().use(initReactI18next);
  let language = localStorage.getItem('camundLocale');
  if (!language) {
    language = "en";
    localStorage.setItem('camundLocale', language);
  }
  i18n
    .use(initReactI18next)
    .use(Backend)
    .init({
      lng: language,
      fallbackLng: "en",
    backend: {
      loadPath: env.backend + '/api/i18n/{{lng}}/{{ns}}.json'
    }
  });

  return i18n;
};

export const i18n = createI18n();

