// Simple language storage utility that works independently of React context
export const LANGUAGE_KEY = 'selected-language';

export const getStoredLanguage = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(LANGUAGE_KEY) || 'en';
  }
  return 'en';
};

export const setStoredLanguage = (language) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LANGUAGE_KEY, language);
    // Update the HTML lang attribute
    document.documentElement.lang = language;

    // Handle RTL for Urdu
    if (language === 'ur') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }
};

export const updatePageLanguage = (language) => {
  setStoredLanguage(language);
  // In a real implementation, you would update all page content here
  // For now, we just update the HTML attributes
};