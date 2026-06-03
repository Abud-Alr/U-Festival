import translations from '../data/translations.json';
import { FlagIcons } from './components/icons.js';

export class LanguageManager {
  constructor() {
    this.language = localStorage.getItem('language') || this.detectLanguage();
    this.translations = translations;
    this.init();
  }

  detectLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    return browserLang.startsWith('nl') ? 'nl' : 'en';
  }

  init() {
    this.applyLanguage();
  }

  setLanguage(lang) {
    if (lang === 'nl' || lang === 'en') {
      this.language = lang;
      localStorage.setItem('language', this.language);
      this.applyLanguage();
      
      // Dispatch custom event to notify other modules
      window.dispatchEvent(new CustomEvent('languagechanged', { detail: { language: this.language } }));
      
      if ('vibrate' in navigator) {
        navigator.vibrate(20);
      }
    }
  }

  toggleLanguage() {
    const nextLang = this.language === 'nl' ? 'en' : 'nl';
    this.setLanguage(nextLang);
  }

  getLanguage() {
    return this.language;
  }

  // Translation helper
  t(key, replacements = {}) {
    const dictionary = this.translations[this.language];
    if (!dictionary) return key;
    
    let text = dictionary[key] || key;
    
    // Replace place holders like {act}
    Object.keys(replacements).forEach(k => {
      text = text.replace(new RegExp(`{${k}}`, 'g'), replacements[k]);
    });
    
    return text;
  }

  // Find all elements with data-i18n attribute and translate their text
  applyLanguage() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.innerHTML = this.t(key);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      el.setAttribute('placeholder', this.t(key));
    });
    
    // Update language flag in header
    const flagBtn = document.querySelector('.lang-flag-btn');
    if (flagBtn) {
      flagBtn.innerHTML = this.language === 'nl' ? FlagIcons.en : FlagIcons.nl;
      flagBtn.title = this.language === 'nl' ? 'Switch to English' : 'Schakel naar Nederlands';
    }
  }
}
