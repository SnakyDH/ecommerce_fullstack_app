import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";

import en from "./locales/en.json";
import es from "./locales/es.json";

i18n
  .use(initReactI18next)
  .init({
    lng: Localization.getLocales()[0].languageCode || "en",
    fallbackLng: "en",
    resources: {
      en: { translation: en },
      es: { translation: es },
    },
    interpolation: {
      format: (value, format, lng) => {
        if (format === "currency") {
          return new Intl.NumberFormat(lng, {
            style: "currency",
            currency: "COP",
          }).format(value);
        }
        return value;
      },
      escapeValue: false,
    },
  });

export default i18n;
