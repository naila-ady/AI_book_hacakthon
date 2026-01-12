import TRANSLATION_CONFIG from '../config/translation.config';

class TranslationService {
  constructor() {
    this.config = TRANSLATION_CONFIG;
  }

  async translateText(text, targetLanguage = 'ur', sourceLanguage = 'en') {
    console.log(`Translating text to ${targetLanguage}:`, text.substring(0, 50) + '...');

    // Check if we have a real translation service configured
    if (this.config.google.enabled && this.config.google.apiKey) {
      return this.translateWithGoogle(text, targetLanguage, sourceLanguage);
    } else if (this.config.azure.enabled && this.config.azure.apiKey) {
      return this.translateWithAzure(text, targetLanguage, sourceLanguage);
    } else {
      // Fallback to mock translation if no real service is configured
      return this.mockTranslate(text, targetLanguage);
    }
  }

  async translateWithGoogle(text, targetLanguage, sourceLanguage) {
    try {
      const response = await fetch(`${this.config.google.endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          target: targetLanguage,
          source: sourceLanguage,
          format: 'text'
        }),
      });

      const result = await response.json();
      return result.data.translations[0].translatedText;
    } catch (error) {
      console.error('Google Translation API error:', error);
      return this.mockTranslate(text, targetLanguage);
    }
  }

  async translateWithAzure(text, targetLanguage, sourceLanguage) {
    try {
      const response = await fetch(`${this.config.azure.endpoint}?api-version=3.0&from=${sourceLanguage}&to=${targetLanguage}`, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': this.config.azure.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([{
          text: text
        }]),
      });

      const result = await response.json();
      return result[0].translations[0].text;
    } catch (error) {
      console.error('Azure Translation API error:', error);
      return this.mockTranslate(text, targetLanguage);
    }
  }

  // Mock translation function for demonstration
  mockTranslate(text, targetLanguage) {
    // In a real implementation, you would connect to a translation API
    // For now, we'll return the original text with a note that it's a mock translation
    // In a real implementation, you would want to cache translations to avoid repeated API calls
    console.log(`Mock translation to ${targetLanguage}: ${text.substring(0, 50)}...`);
    return text; // Return original text for now - in real implementation, return actual translation
  }

  // Function to detect if content is already translated
  isTranslated(content) {
    return content.includes('[Translation to ') || content.includes('[Urdu translation]:');
  }

  // Function to get original content if it's translated
  getOriginalContent(translatedContent) {
    if (this.isTranslated(translatedContent)) {
      // Extract original content from translation
      const match = translatedContent.match(/]:\s*(.*)/);
      return match ? match[1] : translatedContent;
    }
    return translatedContent;
  }

  // Check if a language is supported
  isLanguageSupported(languageCode) {
    return this.config.supportedLanguages.some(lang => lang.code === languageCode);
  }

  // Get supported languages
  getSupportedLanguages() {
    return this.config.supportedLanguages;
  }
}

export default new TranslationService();