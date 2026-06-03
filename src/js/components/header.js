import { FlagIcons } from './icons';

export class Header {
  constructor(container, themeManager, languageManager) {
    this.container = container;
    this.themeManager = themeManager;
    this.languageManager = languageManager;
    this.render();
    this.bindEvents();
    
    window.addEventListener('themechanged', () => this.updateLogo());
    window.addEventListener('languagechanged', () => this.updateTexts());
  }

  render() {
    const activeTheme = this.themeManager.getTheme();
    const isDark = activeTheme === 'dark';
    const logoSrc = isDark ? 'assets/Content/logo_white.svg' : 'assets/Content/logo_black.svg';
    const lang = this.languageManager.getLanguage();
    const flagHtml = lang === 'nl' ? FlagIcons.en : FlagIcons.nl;
    const langAlt = lang === 'nl' ? 'Switch to English' : 'Schakel naar Nederlands';

    this.container.innerHTML = `
      <div class="app-header">
        <div class="logo-container">
          <img src="${logoSrc}" class="logo" alt="❤️U Logo" id="header-logo"/>
          <span class="header-title" data-i18n="header_title">${this.languageManager.t('header_title')}</span>
        </div>
        <div class="header-actions">
          <button class="action-btn lang-flag-btn" id="lang-toggle-btn" title="${langAlt}" aria-label="${langAlt}">
            ${flagHtml}
          </button>
          <div class="theme-switch-wrapper">
            <label class="theme-switch" for="checkbox">
              <input type="checkbox" id="checkbox" ${isDark ? 'checked' : ''} />
              <div class="slider round"></div>
            </label>
          </div>
        </div>
      </div>
    `;
    this.bindEvents();
  }

  bindEvents() {
    const themeCheckbox = this.container.querySelector('#checkbox');
    if (themeCheckbox) {
      themeCheckbox.addEventListener('change', () => {
        this.themeManager.toggleTheme();
      });
    }

    const langBtn = this.container.querySelector('#lang-toggle-btn');
    if (langBtn) {
      langBtn.addEventListener('click', () => {
        this.languageManager.toggleLanguage();
        this.render();
      });
    }
  }

  updateLogo() {
    const isDark = this.themeManager.getTheme() === 'dark';
    const logoImg = this.container.querySelector('#header-logo');
    if (logoImg) {
      logoImg.src = isDark ? 'assets/Content/logo_white.svg' : 'assets/Content/logo_black.svg';
    }
  }

  updateTexts() {
    this.languageManager.applyLanguage();
    const langBtn = this.container.querySelector('#lang-toggle-btn');
    if (langBtn) {
      const lang = this.languageManager.getLanguage();
      langBtn.innerHTML = lang === 'nl' ? FlagIcons.en : FlagIcons.nl;
      langBtn.title = lang === 'nl' ? 'Switch to English' : 'Schakel naar Nederlands';
    }
  }
}
