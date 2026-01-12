import React, { useState, cloneElement } from 'react';
import TranslateButton from '../TranslateButton/TranslateButton';
import translationService from '../../services/translationService';
import { getStoredLanguage } from '../../utils/languageStorage';
import clsx from 'clsx';
import styles from './ChapterTranslator.module.css';

const ChapterTranslator = ({ children, chapterTitle }) => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedContent, setTranslatedContent] = useState(null);
  const [targetLanguage, setTargetLanguage] = useState(getStoredLanguage());
  const [isUrdu, setIsUrdu] = useState(getStoredLanguage() === 'ur');

  const handleTranslate = async (languageCode) => {
    setIsTranslating(true);
    setTargetLanguage(languageCode);

    try {
      // Get the text content from the children
      const originalText = extractTextFromChildren(children);

      // Translate the content
      const translated = await translationService.translateText(originalText, languageCode);

      setTranslatedContent(translated);
      setIsUrdu(languageCode === 'ur');
    } catch (error) {
      console.error('Translation error:', error);
      // In case of error, show an error message
      setTranslatedContent(`Error translating content: ${error.message}`);
      setIsUrdu(false);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleReset = () => {
    setTranslatedContent(null);
    setIsUrdu(false);
  };

  const extractTextFromChildren = (children) => {
    // Function to extract text content from React children
    if (typeof children === 'string' || typeof children === 'number') {
      return children.toString();
    }

    if (React.isValidElement(children)) {
      if (typeof children.props.children === 'string' || typeof children.props.children === 'number') {
        return children.props.children.toString();
      } else if (children.props.children) {
        return extractTextFromChildren(children.props.children);
      }
      return '';
    }

    if (Array.isArray(children)) {
      return children.map(child => extractTextFromChildren(child)).join(' ');
    }

    return '';
  };

  // Render translated content if available, otherwise render original content
  const renderContent = () => {
    if (translatedContent) {
      // If the translated content is a valid JSX element, render it as JSX
      // Otherwise, render it as text
      if (React.isValidElement(translatedContent)) {
        return translatedContent;
      }
      return (
        <div
          className={isUrdu ? styles.urduContent : ''}
          dangerouslySetInnerHTML={{ __html: translatedContent }}
        />
      );
    }

    // If we have React elements, clone them with the appropriate class for Urdu
    if (React.isValidElement(children)) {
      return cloneElement(children, {
        className: isUrdu ? clsx(children.props.className, styles.urduContent) : children.props.className
      });
    }

    return <div className={isUrdu ? styles.urduContent : ''}>{children}</div>;
  };

  return (
    <div className={clsx(styles.chapterTranslator, isUrdu && styles.urduLayout)}>
      <div className={styles.translationHeader}>
        <TranslateButton
          content={children}
          onTranslate={handleTranslate}
          isTranslating={isTranslating}
          translatedContent={translatedContent}
        />
        {translatedContent && (
          <button
            className={styles.resetBtn}
            onClick={handleReset}
          >
            Show Original
          </button>
        )}
      </div>

      <div className={styles.chapterContent}>
        {renderContent()}
      </div>
    </div>
  );
};

export default ChapterTranslator;