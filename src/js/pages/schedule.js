import { Animations } from '../animations';
import scheduleData from '../../data/schedule.json';
import actsData from '../../data/acts.json';
import stagesData from '../../data/stages.json';

export class SchedulePage {
  constructor(container, languageManager, favoritesManager, notificationManager, popup) {
    this.container = container;
    this.languageManager = languageManager;
    this.favoritesManager = favoritesManager;
    this.notificationManager = notificationManager;
    this.popup = popup;
    
    this.activeDay = 'saturday'; // 'saturday' or 'sunday'
    this.showOnlyFavorites = false;
    
    // Grid sizes
    this.hourWidth = 120; // 120px per hour
    this.startHour = 12;  // Festival starts at 12:00
    this.endHour = 24;    // Festival ends at 24:00 (midnight)
    
    // Listeners
    window.addEventListener('languagechanged', () => this.render());
    window.addEventListener('favoriteschanged', () => this.renderGrid());
  }

  activate() {
    this.render();
  }

  deactivate() {
    // clean up if needed
  }

  render() {
    const t = (key) => this.languageManager.t(key);
    
    this.container.innerHTML = `
      <div class="page active" id="schedule-page">
        <div class="schedule-controls">
          <!-- Day Tabs -->
          <div class="day-selector">
            <div class="day-tab ${this.activeDay === 'saturday' ? 'active' : ''}" data-day="saturday" data-i18n="day_saturday">
              ${t('day_saturday')}
            </div>
            <div class="day-tab ${this.activeDay === 'sunday' ? 'active' : ''}" data-day="sunday" data-i18n="day_sunday">
              ${t('day_sunday')}
            </div>
          </div>
          
          <!-- Favorites Switcher -->
          <div class="filter-row">
            <span class="switch-label" data-i18n="filter_favs">${t('filter_favs')}</span>
            <div class="theme-switch-wrapper">
              <label class="theme-switch" for="fav-only-checkbox">
                <input type="checkbox" id="fav-only-checkbox" ${this.showOnlyFavorites ? 'checked' : ''} />
                <div class="slider round"></div>
              </label>
            </div>
          </div>
        </div>

        <!-- Horizontal Scrollable Grid -->
        <div class="schedule-grid-container no-scrollbar" id="grid-container">
          <div class="schedule-grid" style="width: ${(this.endHour - this.startHour) * this.hourWidth + 100}px;">
            <!-- Header Row (Times) -->
            <div class="time-header-row" style="padding-left: 100px;">
              ${this.renderTimeHeaders()}
            </div>
            
            <!-- Rows for stages -->
            ${this.renderStageRows()}
            
            <!-- Simulated Current Time Indicator Line -->
            ${this.renderTimeIndicator()}
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
    this.renderGrid();
    this.scrollToCurrentTime();
  }

  renderTimeHeaders() {
    let html = '';
    for (let h = this.startHour; h < this.endHour; h++) {
      html += `<div class="time-slot" style="width: ${this.hourWidth}px;">${h}:00</div>`;
    }
    return html;
  }

  renderStageRows() {
    return stagesData.map(stage => `
      <div class="stage-row" data-stage="${stage.id}">
        <div class="stage-label-col">
          <span class="stage-label-name">${stage.name}</span>
          <span class="stage-label-desc">Stage ${stage.id.replace('stage', '')}</span>
        </div>
        <div class="stage-blocks-area" id="blocks-${stage.id}">
          <!-- Acts placed dynamically -->
        </div>
      </div>
    `).join('');
  }

  renderTimeIndicator() {
    // Determine if we should show a current time line.
    // If testing on desktop / not during the actual festival (Aug 15/16 2026),
    // we place it at 17:30 to demonstrate it beautifully.
    const now = new Date();
    const isSaturday = now.getFullYear() === 2026 && now.getMonth() === 7 && now.getDate() === 15;
    const isSunday = now.getFullYear() === 2026 && now.getMonth() === 7 && now.getDate() === 16;
    
    let simulatedMinutes = 0;
    
    if (this.activeDay === 'saturday' && isSaturday) {
      simulatedMinutes = now.getHours() * 60 + now.getMinutes();
    } else if (this.activeDay === 'sunday' && isSunday) {
      simulatedMinutes = now.getHours() * 60 + now.getMinutes();
    } else {
      // Simulation default: 17:30 (5.5 hours from 12:00)
      simulatedMinutes = 17.5 * 60;
    }

    const startMinutes = this.startHour * 60;
    const endMinutes = this.endHour * 60;

    if (simulatedMinutes >= startMinutes && simulatedMinutes <= endMinutes) {
      const leftOffset = 100 + (simulatedMinutes - startMinutes) * (this.hourWidth / 60);
      return `<div class="time-indicator-line" style="left: ${leftOffset}px;"></div>`;
    }

    return '';
  }

  renderGrid() {
    stagesData.forEach(stage => {
      const area = this.container.querySelector(`#blocks-${stage.id}`);
      if (!area) return;
      
      const slots = scheduleData.filter(s => s.day === this.activeDay && s.stageId === stage.id);
      
      let html = '';
      slots.forEach(slot => {
        const act = actsData.find(a => a.id === slot.actId);
        if (!act) return;
        
        const isFav = this.favoritesManager.isFavorite(act.id);
        
        // Filter out if Show Only Favorites is enabled
        if (this.showOnlyFavorites && !isFav) return;

        // Calculate positions
        const startMin = this.timeToMinutes(slot.start);
        const endMin = this.timeToMinutes(slot.end);
        const duration = endMin - startMin;
        
        const left = (startMin - this.startHour * 60) * (this.hourWidth / 60);
        const width = duration * (this.hourWidth / 60);

        html += `
          <div class="schedule-block ${isFav ? 'favorited' : ''}" 
               style="left: ${left}px; width: ${width}px; background-color: var(--${stage.id}-color);"
               data-act-id="${act.id}"
               data-slot-start="${slot.start}"
               data-slot-end="${slot.end}"
               data-stage-name="${stage.name}">
            <span class="schedule-block-title">${act.name}</span>
            <span class="schedule-block-time">${slot.start} - ${slot.end}</span>
            <svg class="schedule-block-fav" viewBox="0 0 24 24" fill="white" stroke="white">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
        `;
      });
      
      area.innerHTML = html;
    });

    // Re-bind block clicks
    this.container.querySelectorAll('.schedule-block').forEach(block => {
      block.addEventListener('click', (e) => {
        const actId = block.getAttribute('data-act-id');
        const start = block.getAttribute('data-slot-start');
        const end = block.getAttribute('data-slot-end');
        const stageName = block.getAttribute('data-stage-name');
        
        this.openArtistDetail(actId, start, end, stageName);
      });
    });
  }

  bindEvents() {
    // Day Selection Tabs
    this.container.querySelectorAll('.day-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.activeDay = tab.getAttribute('data-day');
        this.container.querySelectorAll('.day-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.renderGrid();
        
        // Remove and recreate current time line
        const existingLine = this.container.querySelector('.time-indicator-line');
        if (existingLine) existingLine.remove();
        
        const grid = this.container.querySelector('.schedule-grid');
        const lineHTML = this.renderTimeIndicator();
        if (lineHTML && grid) {
          grid.insertAdjacentHTML('beforeend', lineHTML);
        }
        
        if ('vibrate' in navigator) {
          navigator.vibrate(15);
        }
      });
    });

    // Favorites filter switch
    const favCheckbox = this.container.querySelector('#fav-only-checkbox');
    favCheckbox.addEventListener('change', (e) => {
      this.showOnlyFavorites = e.target.checked;
      this.renderGrid();
    });
  }

  scrollToCurrentTime() {
    const gridContainer = this.container.querySelector('#grid-container');
    const indicator = this.container.querySelector('.time-indicator-line');
    if (gridContainer && indicator) {
      setTimeout(() => {
        const scrollTarget = indicator.offsetLeft - gridContainer.clientWidth / 2;
        gridContainer.scrollTo({
          left: Math.max(0, scrollTarget),
          behavior: 'smooth'
        });
      }, 300);
    }
  }

  timeToMinutes(timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  }

  openArtistDetail(actId, start, end, stageName) {
    const act = actsData.find(a => a.id === actId);
    if (!act) return;

    const lang = this.languageManager.getLanguage();
    const t = (key) => this.languageManager.t(key);
    const isFav = this.favoritesManager.isFavorite(act.id);

    const title = act.name;
    const content = `
      <div class="artist-detail-container">
        <div class="artist-detail-hero">
          <img src="${act.image}" class="artist-detail-img" alt="${act.name}" />
          <div class="artist-detail-gradient"></div>
          <h2 class="artist-detail-name">${act.name}</h2>
        </div>
        
        <div class="artist-detail-meta">
          <div class="artist-detail-info">
            <span class="artist-detail-stage">${stageName} Stage</span>
            <span class="artist-detail-time">${this.activeDay === 'saturday' ? t('day_saturday') : t('day_sunday')} | ${start} - ${end}</span>
          </div>
          <button class="fav-btn ${isFav ? 'favorited' : ''}" id="btn-fav-toggle" aria-label="Favorite button">
            <svg viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </button>
        </div>

        <p style="font-weight: 700; font-size: 0.95rem; margin-bottom: 8px; color: var(--primary-color);">${act.tagline[lang]}</p>
        <p class="artist-detail-desc">${act.description[lang]}</p>

        <h4 style="font-size: 1rem; margin-bottom: 12px; border-bottom: 2px solid var(--border-color); padding-bottom: 4px;" data-i18n="artist_video_title">${t('artist_video_title')}</h4>
        <iframe class="artist-detail-video" src="${act.video}" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
    `;

    this.popup.open(title, content, (bodyEl) => {
      const favBtn = bodyEl.querySelector('#btn-fav-toggle');
      
      favBtn.addEventListener('click', () => {
        const added = this.favoritesManager.toggleFavorite(act.id);
        
        if (added) {
          favBtn.classList.add('favorited');
          Animations.bounceElement(favBtn);

          this.notificationManager.requestPermission().then(granted => {
            if (granted) {
              const slots = scheduleData.filter(s => s.actId === act.id);
              this.notificationManager.scheduleActReminders(act.id, act.name, stageName, slots);
              // Demo: also fire sample notifications during development
              this.notificationManager.scheduleDemoNotification(act.name, stageName);
            }
          });
        } else {
          favBtn.classList.remove('favorited');
          this.notificationManager.clearActReminders(act.id);
        }
        
        // Refresh grid blocks
        this.renderGrid();
      });
    });
  }
}
