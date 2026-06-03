import { Animations } from './animations';

export class Router {
  constructor(routes, defaultRoute = 'home') {
    this.routes = routes;
    this.defaultRoute = defaultRoute;
    this.currentPage = null;
    this.currentPageEl = null;

    // Listen to hash changes
    window.addEventListener('hashchange', () => this.handleRoute());
  }

  init() {
    this.handleRoute();
  }

  navigateTo(route) {
    window.location.hash = `#${route}`;
  }

  handleRoute() {
    const hash = window.location.hash.substring(1) || this.defaultRoute;
    const route = this.routes[hash];

    if (!route) {
      this.navigateTo(this.defaultRoute);
      return;
    }

    const nextEl = document.getElementById(`${hash}-page-container`);
    if (!nextEl) return;

    if (this.currentPage === route) return;

    // Deactivate previous page
    if (this.currentPage && typeof this.currentPage.deactivate === 'function') {
      this.currentPage.deactivate();
    }

    // Activate next page
    if (typeof route.activate === 'function') {
      route.activate();
    }

    // Smooth page slide transition using Anime.js helper
    Animations.transitionPage(this.currentPageEl, nextEl, () => {
      this.currentPage = route;
      this.currentPageEl = nextEl;
    });

    // Notify navbar of active tab change
    window.dispatchEvent(new CustomEvent('navchange', { detail: { route: hash } }));
  }
}
