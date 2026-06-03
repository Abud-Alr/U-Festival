export class FavoritesManager {
  constructor() {
    this.favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  }

  isFavorite(actId) {
    return this.favorites.includes(actId);
  }

  toggleFavorite(actId) {
    const index = this.favorites.indexOf(actId);
    let added = false;
    
    if (index === -1) {
      this.favorites.push(actId);
      added = true;
    } else {
      this.favorites.splice(index, 1);
    }
    
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
    
    // Dispatch custom event to notify UI
    window.dispatchEvent(new CustomEvent('favoriteschanged', { 
      detail: { actId, isFavorite: added, favorites: this.favorites } 
    }));
    
    // Trigger vibration feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(added ? [30, 50, 30] : 30);
    }

    return added;
  }

  getFavorites() {
    return this.favorites;
  }
}
