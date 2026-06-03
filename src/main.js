import './style.css';
import { App } from './js/app';
import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('Nieuwe versie beschikbaar. Vernieuwen?')) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log('App ready for offline use.');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const mountPoint = document.querySelector('#app');
  if (mountPoint) {
    new App(mountPoint);
  }
});
