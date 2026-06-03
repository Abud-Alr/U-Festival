import { ThemeManager } from './theme';
import { LanguageManager } from './language';
import { FavoritesManager } from './favorites';
import { NotificationManager } from './notifications';
import { Router } from './router';

import { Header } from './components/header';
import { Navbar } from './components/navbar';
import { Popup } from './components/popup';

import actsData from '../data/acts.json';
import scheduleData from '../data/schedule.json';
import stagesData from '../data/stages.json';
import { HomePage } from './pages/home';
import { InfoPage } from './pages/info';
import { SchedulePage } from './pages/schedule';
import { MapPage } from './pages/map';

export class App {
  constructor(mountElement) {
    this.mountElement = mountElement;
    this.deferredInstallPrompt = null;
    this.init();
  }

  init() {
    this.themeManager = new ThemeManager();
    this.languageManager = new LanguageManager();
    this.favoritesManager = new FavoritesManager();
    this.notificationManager = new NotificationManager(this.languageManager);

    this.mountElement.innerHTML = `
      <div id="pwa-install-banner" class="pwa-install-banner" hidden>
        <div class="pwa-install-text">
          <strong data-i18n="pwa_install">${this.languageManager.t('pwa_install')}</strong>
          <p data-i18n="pwa_install_desc">${this.languageManager.t('pwa_install_desc')}</p>
        </div>
        <div class="pwa-install-actions">
          <button class="btn btn-primary btn-sm" id="pwa-install-btn" data-i18n="pwa_install_btn">${this.languageManager.t('pwa_install_btn')}</button>
          <button class="btn btn-ghost btn-sm" id="pwa-dismiss-btn" data-i18n="pwa_dismiss">${this.languageManager.t('pwa_dismiss')}</button>
        </div>
      </div>
      <div id="header-mount"></div>
      <main id="main-content" class="no-scrollbar">
        <div id="home-page-container" style="display: none;"></div>
        <div id="info-page-container" style="display: none;"></div>
        <div id="schedule-page-container" style="display: none;"></div>
        <div id="map-page-container" style="display: none;"></div>
      </main>
      <div id="navbar-mount"></div>
      <div id="popup-mount"></div>
    `;

    const headerMount = this.mountElement.querySelector('#header-mount');
    const navbarMount = this.mountElement.querySelector('#navbar-mount');
    const popupMount = this.mountElement.querySelector('#popup-mount');

    this.popup = new Popup(popupMount);
    this.header = new Header(headerMount, this.themeManager, this.languageManager);

    const homeContainer = this.mountElement.querySelector('#home-page-container');
    const infoContainer = this.mountElement.querySelector('#info-page-container');
    const scheduleContainer = this.mountElement.querySelector('#schedule-page-container');
    const mapContainer = this.mountElement.querySelector('#map-page-container');

    this.pages = {
      home: new HomePage(homeContainer, this.languageManager, this.popup, (tab) => this.router.navigateTo(tab)),
      info: new InfoPage(infoContainer, this.languageManager),
      schedule: new SchedulePage(scheduleContainer, this.languageManager, this.favoritesManager, this.notificationManager, this.popup),
      map: new MapPage(mapContainer, this.languageManager, this.popup, (actId, start, end, stageName) => {
        this.router.navigateTo('schedule');
        setTimeout(() => this.pages.schedule.openArtistDetail(actId, start, end, stageName), 300);
      })
    };

    this.navbar = new Navbar(navbarMount, this.languageManager, (tab) => {
      this.router.navigateTo(tab);
    });

    this.router = new Router({
      home: this.pages.home,
      info: this.pages.info,
      schedule: this.pages.schedule,
      map: this.pages.map
    }, 'home');

    this.router.init();
    this.setupPWAInstall();
    this.setupNotificationPrompt();

    window.addEventListener('navchange', (e) => {
      this.navbar.setActiveTab(e.detail.route);
    });

    window.addEventListener('languagechanged', () => {
      this.languageManager.applyLanguage();
    });

    this.languageManager.applyLanguage();
    this.restoreFavoriteReminders();
  }

  restoreFavoriteReminders() {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    this.favoritesManager.getFavorites().forEach(actId => {
      const act = actsData.find(a => a.id === actId);
      if (!act) return;
      const slots = scheduleData.filter(s => s.actId === actId);
      const stage = slots[0] ? stagesData.find(s => s.id === slots[0].stageId) : null;
      this.notificationManager.scheduleActReminders(actId, act.name, stage?.name || 'Main', slots);
    });
  }

  setupPWAInstall() {
    const banner = this.mountElement.querySelector('#pwa-install-banner');
    const installBtn = this.mountElement.querySelector('#pwa-install-btn');
    const dismissBtn = this.mountElement.querySelector('#pwa-dismiss-btn');

    if (localStorage.getItem('pwa_dismissed') === 'true') return;

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredInstallPrompt = e;
      if (banner) banner.hidden = false;
    });

    installBtn?.addEventListener('click', async () => {
      if (!this.deferredInstallPrompt) return;
      this.deferredInstallPrompt.prompt();
      await this.deferredInstallPrompt.userChoice;
      this.deferredInstallPrompt = null;
      if (banner) banner.hidden = true;
    });

    dismissBtn?.addEventListener('click', () => {
      localStorage.setItem('pwa_dismissed', 'true');
      if (banner) banner.hidden = true;
    });

    window.addEventListener('appinstalled', () => {
      if (banner) banner.hidden = true;
    });
  }

  setupNotificationPrompt() {
    if (!('Notification' in window)) return;
    if (Notification.permission !== 'default') return;
    if (localStorage.getItem('notif_prompted') === 'true') return;

    setTimeout(() => {
      this.notificationManager.requestPermission();
      localStorage.setItem('notif_prompted', 'true');
    }, 5000);
  }
}
