// Translation configuration
// In a real implementation, you would store API keys and endpoints here

const TRANSLATION_CONFIG = {
  // Google Cloud Translation API configuration
  google: {
    enabled: false, // Set to true when you have API credentials
    apiKey: process.env.REACT_APP_GOOGLE_TRANSLATE_API_KEY || '',
    endpoint: 'https://translation.googleapis.com/language/translate/v2'
  },

  // Azure Translator Text API configuration
  azure: {
    enabled: false, // Set to true when you have API credentials
    apiKey: process.env.REACT_APP_AZURE_TRANSLATOR_API_KEY || '',
    endpoint: 'https://api.cognitive.microsofttranslator.com/translate'
  },

  // Default settings
  defaultSourceLanguage: 'en',
  defaultTargetLanguage: 'ur',
  supportedLanguages: [
    { code: 'ur', name: 'Urdu' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' },
    { code: 'ru', name: 'Russian' },
    { code: 'ja', name: 'Japanese' }
  ]
};

export default TRANSLATION_CONFIG;