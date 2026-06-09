import { Animations } from '../animations';
import infoData from '../../data/info.json';

const clubsData = [
  { name: { nl: 'Utrechtse Studenten Zweefvliegclub (USZC)', en: 'Utrecht Student Gliding Club (USZC)' }, stand: 'A1' },
  { name: { nl: 'Vereniging voor Utrechtse Geografie Studenten', en: 'Utrecht Geography Students Association' }, stand: 'B4' },
  { name: { nl: 'Utrechtse Studenten Zeilvereniging (Softijs)', en: 'Utrecht Student Sailing Club (Softijs)' }, stand: 'A3' }
];

export class InfoPage {
  constructor(container, languageManager) {
    this.container = container;
    this.languageManager = languageManager;
    window.addEventListener('languagechanged', () => this.render());
  }

  activate() {
    this.render();
  }

  deactivate() {}

  render() {
    const lang = this.languageManager.getLanguage();
    const t = (key) => this.languageManager.t(key);

    this.container.innerHTML = `
      <div class="page active" id="info-page">
        <div class="accordions-container" id="accordions-container">
          ${infoData.map(info => `
            <div class="accordion" data-id="${info.id}">
              <div class="accordion-header">
                <span class="accordion-title">${this.getSectionIcon(info.id)} ${info.title[lang]}</span>
                <span class="accordion-arrow">▼</span>
              </div>
              <div class="accordion-content">
                <div class="accordion-body">${info.content[lang]}</div>
              </div>
            </div>
          `).join('')}
        </div>

        <h3 class="home-section-title" style="margin-top:32px;" data-i18n="clubs_title">${t('clubs_title')}</h3>
        <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:12px;" data-i18n="clubs_desc">${t('clubs_desc')}</p>
        <div class="clubs-list">
          ${clubsData.map(club => `
            <div class="club-item">
              <span>${club.name[lang]}</span>
              <span class="badge">${t('clubs_stand')} ${club.stand}</span>
            </div>
          `).join('')}
        </div>

        <h3 class="home-section-title" style="margin-top:32px;" data-i18n="sponsor_title">${t('sponsor_title')}</h3>
        <div class="sponsors-grid">
          <div class="sponsor-item">Gemeente Utrecht</div>
          <div class="sponsor-item">ROC Midden Nederland</div>
          <div class="sponsor-item">Grafisch Lyceum Utrecht (GLU)</div>
          <div class="sponsor-item">Hogeschool Utrecht (HU)</div>
          <div class="sponsor-item">Universiteit Utrecht (UU)</div>
        </div>

        <a href="/qr-landing.html" target="_blank" class="qr-share-btn" id="qr-share-btn" data-i18n="qr_btn_label">
          ${t('qr_btn_label')}
        </a>
      </div>
    `;

    this.bindEvents();
  }

  getSectionIcon(id) {
    const icons = { general: 'ℹ️', address: '📍', accessibility: '🚲', lockers: '🔒', faq: '❓', glu: '🎓' };
    return icons[id] || '📝';
  }

  bindEvents() {
    const accordions = this.container.querySelectorAll('.accordion');
    accordions.forEach(acc => {
      const header = acc.querySelector('.accordion-header');
      const content = acc.querySelector('.accordion-content');
      header.addEventListener('click', () => {
        const isOpen = acc.classList.contains('open');
        accordions.forEach(other => {
          if (other !== acc && other.classList.contains('open')) {
            other.classList.remove('open');
            Animations.toggleAccordion(other.querySelector('.accordion-content'), false);
          }
        });
        if (isOpen) {
          acc.classList.remove('open');
          Animations.toggleAccordion(content, false);
        } else {
          acc.classList.add('open');
          Animations.toggleAccordion(content, true);
        }
        if ('vibrate' in navigator) navigator.vibrate(10);
      });
    });
  }
}
