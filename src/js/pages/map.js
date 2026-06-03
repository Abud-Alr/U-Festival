import Hammer from 'hammerjs';
import stagesData from '../../data/stages.json';
import mapMarkersData from '../../data/mapMarkers.json';
import scheduleData from '../../data/schedule.json';
import actsData from '../../data/acts.json';

const MAP_WIDTH = 2330.58;
const MAP_HEIGHT = 1353.19;

export class MapPage {
  constructor(container, languageManager, popup, showArtistCallback) {
    this.container = container;
    this.languageManager = languageManager;
    this.popup = popup;
    this.showArtistCallback = showArtistCallback;

    this.scale = 1;
    this.minScale = 0.5;
    this.maxScale = 4;
    this.translateX = 0;
    this.translateY = 0;
    this.isTracking = false;
    this.watchId = null;
    this.userPos = { x: 1100, y: 600 };
    this.hammer = null;

    window.addEventListener('languagechanged', () => {
      this.updateLegend();
      this.updateControlsText();
    });

    window.addEventListener('pantostage', (e) => {
      this.panToStage(e.detail.stageId);
    });
  }

  activate() {
    this.render();
    this.initMap();
  }

  deactivate() {
    this.stopTracking();
    if (this.hammer) {
      this.hammer.destroy();
      this.hammer = null;
    }
  }

  render() {
    const t = (key) => this.languageManager.t(key);

    this.container.innerHTML = `
      <div class="map-page active">
        <div class="map-viewport" id="map-viewport">
          <div class="map-transform-layer" id="map-transform-layer">
            <img src="assets/FloorPlan/kaart_festival_no_markers.svg" class="map-floorplan" alt="Festival floorplan" draggable="false" />
            <div class="map-markers-layer" id="map-markers-layer"></div>
            <div class="map-user-dot" id="map-user-dot" style="display: none;"></div>
          </div>
        </div>

        <div class="legend-overlay" id="map-legend-overlay">
          <h4 class="legend-title" data-i18n="map_legend">${t('map_legend')}</h4>
          <div class="legend-items" id="legend-items-container"></div>
        </div>

        <div class="map-controls">
          <button class="map-ctrl-btn" id="btn-map-locate" title="${t('map_locate')}">🎯</button>
          <button class="map-ctrl-btn" id="btn-map-legend" title="${t('map_legend')}">ℹ️</button>
        </div>
      </div>
    `;

    this.updateLegend();
  }

  initMap() {
    this.placeMarkers();
    this.bindEvents();
    this.fitMapToViewport();
  }

  placeMarkers() {
    const layer = this.container.querySelector('#map-markers-layer');
    if (!layer) return;

    const markers = [
      ...stagesData.map(s => ({ ...s, type: 'stage' })),
      ...mapMarkersData.map(m => ({ ...m, type: 'facility' }))
    ];

    layer.innerHTML = markers.map(m => `
      <button class="map-marker" data-type="${m.type}" data-id="${m.id}"
        style="left: ${(m.x / MAP_WIDTH) * 100}%; top: ${(m.y / MAP_HEIGHT) * 100}%;"
        aria-label="${m.name?.nl || m.name || ''}">
        <img src="${m.marker}" alt="" draggable="false" />
      </button>
    `).join('');

    layer.querySelectorAll('.map-marker').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const type = btn.getAttribute('data-type');
        const id = btn.getAttribute('data-id');
        if (type === 'stage') {
          const stage = stagesData.find(s => s.id === id);
          if (stage) this.showStagePopup(stage);
        } else {
          const fac = mapMarkersData.find(f => f.id === id);
          if (fac) this.showFacilityPopup(fac);
        }
      });
    });
  }

  bindEvents() {
    const viewport = this.container.querySelector('#map-viewport');
    const locateBtn = this.container.querySelector('#btn-map-locate');
    const legendBtn = this.container.querySelector('#btn-map-legend');
    const legendOverlay = this.container.querySelector('#map-legend-overlay');

    locateBtn?.addEventListener('click', () => this.toggleTracking());
    legendBtn?.addEventListener('click', () => {
      legendOverlay.classList.toggle('active');
      legendBtn.classList.toggle('active', legendOverlay.classList.contains('active'));
      if ('vibrate' in navigator) navigator.vibrate(15);
    });

    if (!viewport) return;

    this.hammer = new Hammer(viewport, { touchAction: 'none' });
    this.hammer.get('pinch').set({ enable: true });
    this.hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL, threshold: 0 });

    let lastScale = this.scale;
    let lastX = this.translateX;
    let lastY = this.translateY;

    this.hammer.on('pinchstart panstart', () => {
      lastScale = this.scale;
      lastX = this.translateX;
      lastY = this.translateY;
    });

    this.hammer.on('pinchmove', (e) => {
      this.scale = Math.min(this.maxScale, Math.max(this.minScale, lastScale * e.scale));
      this.applyTransform();
    });

    this.hammer.on('panmove', (e) => {
      if (e.type === 'panmove') {
        this.translateX = lastX + e.deltaX;
        this.translateY = lastY + e.deltaY;
        this.applyTransform();
      }
    });
  }

  applyTransform() {
    const layer = this.container.querySelector('#map-transform-layer');
    const userDot = this.container.querySelector('#map-user-dot');
    if (!layer) return;

    layer.style.transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;

    // Keep markers and user dot fixed pixel size regardless of zoom
    const inverse = 1 / this.scale;
    this.container.querySelectorAll('.map-marker').forEach(m => {
      m.style.transform = `translate(-50%, -50%) scale(${inverse})`;
    });
    if (userDot) {
      userDot.style.transform = `translate(-50%, -50%) scale(${inverse})`;
    }
  }

  fitMapToViewport() {
    const viewport = this.container.querySelector('#map-viewport');
    if (!viewport) return;

    const vw = viewport.clientWidth;
    const vh = viewport.clientHeight;
    const scaleX = vw / MAP_WIDTH;
    const scaleY = vh / MAP_HEIGHT;
    this.scale = Math.min(scaleX, scaleY) * 0.95;
    this.translateX = (vw - MAP_WIDTH * this.scale) / 2;
    this.translateY = (vh - MAP_HEIGHT * this.scale) / 2;
    this.applyTransform();
  }

  getSimulatedNowMinutes() {
    const now = new Date();
    const isSaturday = now.getFullYear() === 2026 && now.getMonth() === 7 && now.getDate() === 15;
    const isSunday = now.getFullYear() === 2026 && now.getMonth() === 7 && now.getDate() === 16;

    if (isSaturday || isSunday) {
      return now.getHours() * 60 + now.getMinutes();
    }
    return 16 * 60 + 30;
  }

  getActiveDay() {
    const now = new Date();
    if (now.getFullYear() === 2026 && now.getMonth() === 7 && now.getDate() === 16) return 'sunday';
    return 'saturday';
  }

  timeToMinutes(timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  }

  showStagePopup(stage) {
    const lang = this.languageManager.getLanguage();
    const t = (key) => this.languageManager.t(key);
    const nowMin = this.getSimulatedNowMinutes();
    const activeDay = this.getActiveDay();

    const stageActs = scheduleData
      .filter(s => s.day === activeDay && s.stageId === stage.id)
      .sort((a, b) => this.timeToMinutes(a.start) - this.timeToMinutes(b.start));

    const current = stageActs.find(s => {
      const start = this.timeToMinutes(s.start);
      const end = this.timeToMinutes(s.end);
      return nowMin >= start && nowMin < end;
    });

    const next = stageActs.find(s => this.timeToMinutes(s.start) > nowMin);

    let liveHTML = '';
    if (current) {
      const act = actsData.find(a => a.id === current.actId);
      liveHTML += `<div class="map-live-now"><span class="badge badge-primary">${t('map_now_playing')}</span> <strong>${act?.name}</strong> (${current.start}–${current.end})</div>`;
    }
    if (next) {
      const act = actsData.find(a => a.id === next.actId);
      liveHTML += `<div class="map-live-next"><span class="badge">${t('map_up_next')}</span> <strong>${act?.name}</strong> (${next.start})</div>`;
    }

    const actsHTML = stageActs.length ? `
      <div style="margin-top: 16px;">
        <h5 class="map-program-title">${t('map_program')}</h5>
        <div class="map-program-list">
          ${stageActs.map(slot => {
            const act = actsData.find(a => a.id === slot.actId);
            return `
              <div class="map-program-item" style="border-left-color: var(--${stage.id}-color);">
                <div>
                  <span class="map-program-name">${act.name}</span>
                  <span class="map-program-time">${slot.start} - ${slot.end}</span>
                </div>
                <button class="badge badge-primary btn-act-details" data-act-id="${act.id}" data-slot-start="${slot.start}" data-slot-end="${slot.end}">${t('map_details')}</button>
              </div>`;
          }).join('')}
        </div>
      </div>` : '';

    this.popup.open(stage.name, `
      <div>
        ${liveHTML}
        <img src="${stage.image}" style="width:100%;height:140px;object-fit:cover;border-radius:var(--radius-md);margin:12px 0;" alt="${stage.name}" />
        <p style="font-size:0.9rem;line-height:1.5;">${stage.description[lang]}</p>
        ${actsHTML}
      </div>
    `, (bodyEl) => {
      bodyEl.querySelectorAll('.btn-act-details').forEach(btn => {
        btn.addEventListener('click', () => {
          this.popup.close();
          this.showArtistCallback(btn.getAttribute('data-act-id'), btn.getAttribute('data-slot-start'), btn.getAttribute('data-slot-end'), stage.name);
        });
      });
    });
  }

  showFacilityPopup(fac) {
    const lang = this.languageManager.getLanguage();
    const t = (key) => this.languageManager.t(key);
    const descKey = `facility_${fac.id}`;
    const desc = t(descKey);

    this.popup.open(fac.name[lang], `
      <div style="display:flex;gap:16px;align-items:flex-start;padding:4px 0;">
        <img src="${fac.marker}" style="width:48px;height:48px;padding:4px;border:1px solid var(--border-color);border-radius:var(--radius-sm);background:var(--bg-color);" alt="" />
        <p style="font-size:0.9rem;line-height:1.5;flex:1;">${desc}</p>
      </div>
    `);
  }

  updateLegend() {
    const legendContainer = this.container.querySelector('#legend-items-container');
    if (!legendContainer) return;
    const lang = this.languageManager.getLanguage();

    const items = [
      { name: { nl: 'Podium 1: Ponton', en: 'Stage 1: Ponton' }, color: 'var(--stage1-color, var(--stage-1-color))' },
      { name: { nl: 'Podium 2: The Lake', en: 'Stage 2: The Lake' }, color: 'var(--stage-2-color)' },
      { name: { nl: 'Podium 3: The Club', en: 'Stage 3: The Club' }, color: 'var(--stage-3-color)' },
      { name: { nl: 'Podium 4: Hangar', en: 'Stage 4: Hangar' }, color: 'var(--stage-4-color)' },
      { name: { nl: 'Bars', en: 'Bars' }, marker: 'assets/FloorPlan/marker_bar.svg' },
      { name: { nl: 'Eten', en: 'Food' }, marker: 'assets/FloorPlan/marker_food.svg' },
      { name: { nl: 'Toiletten', en: 'Toilets' }, marker: 'assets/FloorPlan/marker_toilet.svg' },
      { name: { nl: 'Kluisjes', en: 'Lockers' }, marker: 'assets/FloorPlan/marker_locker.svg' },
      { name: { nl: 'EHBO', en: 'First Aid' }, marker: 'assets/FloorPlan/marker_first_aid.svg' },
      { name: { nl: 'Entree', en: 'Entrance' }, marker: 'assets/FloorPlan/marker_entrance_exit.svg' }
    ];

    legendContainer.innerHTML = items.map(item => `
      <div class="legend-item">
        ${item.color
          ? `<div class="legend-color" style="background-color:${item.color};"></div>`
          : `<img src="${item.marker}" style="width:14px;height:14px;object-fit:contain;" alt="" />`}
        <span>${item.name[lang]}</span>
      </div>
    `).join('');
  }

  updateControlsText() {
    const t = (key) => this.languageManager.t(key);
    const locateBtn = this.container.querySelector('#btn-map-locate');
    const legendBtn = this.container.querySelector('#btn-map-legend');
    if (locateBtn) locateBtn.title = t('map_locate');
    if (legendBtn) legendBtn.title = t('map_legend');
  }

  toggleTracking() {
    const locateBtn = this.container.querySelector('#btn-map-locate');
    if (this.isTracking) {
      this.stopTracking();
      locateBtn?.classList.remove('active');
    } else {
      this.startTracking();
      locateBtn?.classList.add('active');
    }
    if ('vibrate' in navigator) navigator.vibrate([30, 20, 30]);
  }

  startTracking() {
    if (!('geolocation' in navigator)) {
      alert(this.languageManager.t('map_gps_unsupported'));
      return;
    }

    this.isTracking = true;
    this.watchId = navigator.geolocation.watchPosition(
      (pos) => {
        // Map real GPS to approximate festival coordinates (demo simulation)
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const normX = ((lng - 5.0405) / (5.0505 - 5.0405)) * MAP_WIDTH;
        const normY = ((52.0815 - lat) / (52.0815 - 52.0745)) * MAP_HEIGHT;
        this.userPos = {
          x: Math.max(100, Math.min(MAP_WIDTH - 100, normX || 1100)),
          y: Math.max(100, Math.min(MAP_HEIGHT - 100, normY || 600))
        };
        this.updateUserDot();
      },
      () => {
        this.userPos = { x: 1100, y: 600 };
        this.updateUserDot();
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  }

  stopTracking() {
    this.isTracking = false;
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    const dot = this.container.querySelector('#map-user-dot');
    if (dot) dot.style.display = 'none';
  }

  updateUserDot() {
    const dot = this.container.querySelector('#map-user-dot');
    if (!dot) return;
    dot.style.display = 'block';
    dot.style.left = `${(this.userPos.x / MAP_WIDTH) * 100}%`;
    dot.style.top = `${(this.userPos.y / MAP_HEIGHT) * 100}%`;
    this.applyTransform();
    this.centerOnUser();
  }

  centerOnUser() {
    const viewport = this.container.querySelector('#map-viewport');
    if (!viewport) return;
    const vw = viewport.clientWidth;
    const vh = viewport.clientHeight;
    this.translateX = vw / 2 - this.userPos.x * this.scale;
    this.translateY = vh / 2 - this.userPos.y * this.scale;
    this.applyTransform();
  }

  panToStage(stageId) {
    const stage = stagesData.find(s => s.id === stageId);
    if (!stage) return;
    const viewport = this.container.querySelector('#map-viewport');
    if (!viewport) return;

    this.scale = 1.8;
    const vw = viewport.clientWidth;
    const vh = viewport.clientHeight;
    this.translateX = vw / 2 - stage.x * this.scale;
    this.translateY = vh / 2 - stage.y * this.scale;
    this.applyTransform();
  }
}
