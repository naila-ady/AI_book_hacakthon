import React, { useState } from 'react';
import { useTranslation } from '../../contexts/TranslationContext';
import clsx from 'clsx';
import styles from './TranslationButton.module.css';

const TranslationButton = () => {
  const { currentLanguage, isTranslating, translatePage } = useTranslation();
  const [showDropdown, setShowDropdown] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ur', name: 'Urdu', flag: '🇵🇰' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  ];

  const currentLangInfo = languages.find(lang => lang.code === currentLanguage) || languages[0];

  const handleLanguageChange = (langCode) => {
    translatePage(langCode);
    setShowDropdown(false);
  };

  return (
    <div className={styles.translationContainer}>
      <button
        className={clsx(styles.translationBtn, isTranslating && styles.translating)}
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={isTranslating}
        title={`Current language: ${currentLangInfo.name}`}
      >
        <span className={styles.flag}>{currentLangInfo.flag}</span>
        <span className={styles.langCode}>{currentLanguage.toUpperCase()}</span>
        {isTranslating && <span className={styles.spinner}>🔄</span>}
      </button>

      {showDropdown && (
        <div className={styles.dropdown}>
          <div className={styles.languageList}>
            {languages.map((lang) => (
              <button
                key={lang.code}
                className={clsx(
                  styles.languageOption,
                  currentLanguage === lang.code && styles.active
                )}
                onClick={() => handleLanguageChange(lang.code)}
                disabled={isTranslating}
              >
                <span className={styles.flag}>{lang.flag}</span>
                <span className={styles.langName}>{lang.name}</span>
                {currentLanguage === lang.code && <span className={styles.checkmark}>✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TranslationButton;