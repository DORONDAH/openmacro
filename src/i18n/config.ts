import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      dashboard: {
        title: 'Dashboard',
        remaining: 'Remaining',
        goal: 'Goal',
        food: 'Food',
        exercise: 'Exercise',
        tdee: 'Current TDEE',
        weight_trend: 'Weight Trend',
        trends: 'Trends',
        settings: 'Settings',
        search: 'Search',
      },
      common: {
        add: 'Add',
        save: 'Save',
        cancel: 'Cancel',
        weight: 'Weight',
        date: 'Date',
        value_kg: 'Value (kg)',
        servings: 'Servings',
        quick_add: 'Quick Add',
        left: 'left',
        over: 'over',
      },
      macros: {
        protein: 'Protein',
        fat: 'Fat',
        carbs: 'Carbs',
        calories: 'Calories',
      },
    },
  },
  he: {
    translation: {
      dashboard: {
        title: 'לוח בקרה',
        remaining: 'נותרו',
        goal: 'יעד',
        food: 'אוכל',
        exercise: 'אימון',
        tdee: 'TDEE נוכחי',
        weight_trend: 'מגמת משקל',
        trends: 'מגמות',
        settings: 'הגדרות',
        search: 'חיפוש',
      },
      common: {
        add: 'הוסף',
        save: 'שמור',
        cancel: 'ביטול',
        weight: 'משקל',
        date: 'תאריך',
        value_kg: 'משקל (ק"ג)',
        servings: 'מנות',
        quick_add: 'הוספה מהירה',
        left: 'נותרו',
        over: 'חריגה',
      },
      macros: {
        protein: 'חלבון',
        fat: 'שומן',
        carbs: 'פחמימות',
        calories: 'קלוריות',
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

// Handle RTL
i18n.on('languageChanged', (lng) => {
  document.documentElement.dir = lng === 'he' ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
});

// Initial set
document.documentElement.dir = i18n.language === 'he' ? 'rtl' : 'ltr';
document.documentElement.lang = i18n.language;

export default i18n;
