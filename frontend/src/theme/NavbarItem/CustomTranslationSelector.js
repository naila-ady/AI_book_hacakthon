import React, { useState, useEffect } from 'react';
import NavbarItem from '@theme/NavbarItem';
import clsx from 'clsx';
import styles from './CustomTranslationSelector.module.css';
import { getStoredLanguage, updatePageLanguage } from '@site/src/utils/languageStorage';

const CustomTranslationSelector = (props) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => getStoredLanguage());
  const [showDropdown, setShowDropdown] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

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
    setIsTranslating(true);

    // In a real implementation, you would call a translation API here
    // For now, we'll just update the stored language and page attributes
    updatePageLanguage(langCode);
    setCurrentLanguage(langCode);

    // Simulate translation delay
    setTimeout(() => {
      setIsTranslating(false);
      setShowDropdown(false);
    }, 300);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(`.${styles.translationSelector}`)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={clsx('navbar__item', styles.translationSelector)}>
      <button
        className={clsx(styles.translationBtn, isTranslating && styles.translating)}
        onClick={() => setShowDropdown(!showDropdown)}
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

export default CustomTranslationSelector;