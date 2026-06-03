export class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem('theme') || 'light';
    this.init();
  }

  init() {
    // Apply initial theme
    document.documentElement.setAttribute('data-theme', this.theme);
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', this.theme);
    localStorage.setItem('theme', this.theme);
    
    // Dispatch custom event so other components (like map tiles or logo) can react
    window.dispatchEvent(new CustomEvent('themechanged', { detail: { theme: this.theme } }));
    
    // Add nice page fade transition when toggling theme
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    
    // Trigger vibration feedback if API is supported
    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }
  }

  getTheme() {
    return this.theme;
  }
}
