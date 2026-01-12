import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStoredLanguage, setStoredLanguage } from '../utils/languageStorage';

const TranslationContext = createContext();

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

export { TranslationContext };

const TranslationProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => getStoredLanguage());
  const [isTranslating, setIsTranslating] = useState(false);

  // Mock translation function - in a real app, this would call an API
  const translateText = async (text, targetLang = 'ur', sourceLang = 'en') => {
    // This is a mock implementation - in a real app you would call a translation API
    if (targetLang === 'ur') {
      return `[Urdu translation]: ${text}`;
    }
    return `[${targetLang} translation]: ${text}`;
  };

  const translatePage = async (targetLang) => {
    setIsTranslating(true);
    try {
      // Update the language in storage and state
      setStoredLanguage(targetLang);
      setCurrentLanguage(targetLang);

      // Update HTML lang attribute
      document.documentElement.lang = targetLang;

      // Add RTL support for Urdu
      if (targetLang === 'ur') {
        document.documentElement.dir = 'rtl';
      } else {
        document.documentElement.dir = 'ltr';
      }
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const value = {
    currentLanguage,
    isTranslating,
    translatePage,
    translateText,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

export default TranslationProvider;