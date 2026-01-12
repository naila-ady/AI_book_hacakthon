import React, { useState } from 'react';
import clsx from 'clsx';
import styles from './TranslateButton.module.css';
import TRANSLATION_CONFIG from '../../config/translation.config';

const TranslateButton = ({ content, onTranslate, isTranslating, translatedContent }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState('ur'); // Urdu language code

  const handleTranslate = () => {
    if (onTranslate) {
      onTranslate(targetLanguage);
    }
  };

  const languages = TRANSLATION_CONFIG.supportedLanguages;

  return (
    <div className={styles.translateContainer}>
      <div className={styles.translateDropdown}>
        <button
          className={clsx(styles.translateBtn, isTranslating && styles.translating)}
          onClick={() => setShowDropdown(!showDropdown)}
          disabled={isTranslating}
        >
          {isTranslating ? 'Translating...' : '🌐 Translate'}
        </button>

        {showDropdown && (
          <div className={styles.dropdownContent}>
            <div className={styles.languageList}>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  className={clsx(
                    styles.languageOption,
                    targetLanguage === lang.code && styles.active
                  )}
                  onClick={() => {
                    setTargetLanguage(lang.code);
                    setShowDropdown(false);
                    // Optionally trigger translation immediately
                    if (onTranslate) {
                      onTranslate(lang.code);
                    }
                  }}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        className={clsx(styles.translateActionBtn, isTranslating && styles.translating)}
        onClick={handleTranslate}
        disabled={isTranslating}
      >
        {isTranslating ? 'Translating...' : `Translate to ${languages.find(l => l.code === targetLanguage)?.name || 'Urdu'}`}
      </button>
    </div>
  );
};

export default TranslateButton;