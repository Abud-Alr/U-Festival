import { NavIcons } from './icons';

export class Navbar {
  constructor(container, languageManager, onTabChange) {
    this.container = container;
    this.languageManager = languageManager;
    this.onTabChange = onTabChange;
    this.activeTab = 'home';
    
    this.render();
    this.bindEvents();
    
    window.addEventListener('languagechanged', () => this.render());
  }

  render() {
    const t = (key) => this.languageManager.t(key);
    const tabs = [
      { id: 'home', icon: NavIcons.home, label: 'nav_home' },
      { id: 'info', icon: NavIcons.info, label: 'nav_info' },
      { id: 'schedule', icon: NavIcons.schedule, label: 'nav_schedule' },
      { id: 'map', icon: NavIcons.map, label: 'nav_map' }
    ];

    this.container.innerHTML = `
      <nav class="app-navbar">
        ${tabs.map(tab => `
          <button class="nav-item ${this.activeTab === tab.id ? 'active' : ''}" data-tab="${tab.id}">
            <span class="nav-icon">${tab.icon}</span>
            <span data-i18n="${tab.label}">${t(tab.label)}</span>
          </button>
        `).join('')}
      </nav>
    `;
    this.bindEvents();
  }

  bindEvents() {
    this.container.querySelectorAll('.nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        if (tab !== this.activeTab) {
          this.setActiveTab(tab);
          this.onTabChange(tab);
        }
      });
    });
  }

  setActiveTab(tab) {
    this.activeTab = tab;
    this.render();
  }
}
