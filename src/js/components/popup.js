import anime from 'animejs';

export class Popup {
  constructor(container) {
    this.container = container;
    this.isOpen = false;
    this.render();
    this.bindEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="popup-overlay" id="popup-overlay">
        <div class="popup-container" id="popup-container">
          <div class="popup-header">
            <h3 id="popup-title">Title</h3>
            <button class="popup-close" id="popup-close-btn">&times;</button>
          </div>
          <div class="popup-body-content" id="popup-body-content">
            <!-- Dynamic content goes here -->
          </div>
        </div>
      </div>
    `;
    
    this.overlay = this.container.querySelector('#popup-overlay');
    this.contentContainer = this.container.querySelector('#popup-container');
    this.titleEl = this.container.querySelector('#popup-title');
    this.bodyEl = this.container.querySelector('#popup-body-content');
    this.closeBtn = this.container.querySelector('#popup-close-btn');
  }

  bindEvents() {
    // Close on X click
    this.closeBtn.addEventListener('click', () => this.close());
    
    // Close on clicking outside the container
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.close();
      }
    });
  }

  open(title, contentHTML, onOpenCallback) {
    this.titleEl.innerHTML = title;
    this.bodyEl.innerHTML = contentHTML;
    
    this.overlay.classList.add('active');
    this.isOpen = true;
    
    // Animate open
    anime.remove([this.overlay, this.contentContainer]);
    
    anime({
      targets: this.overlay,
      opacity: [0, 1],
      duration: 300,
      easing: 'easeOutQuad'
    });

    anime({
      targets: this.contentContainer,
      translateY: ['100%', '0%'],
      duration: 350,
      easing: 'easeOutCubic',
      complete: () => {
        if (onOpenCallback) onOpenCallback(this.bodyEl);
      }
    });
    
    if ('vibrate' in navigator) {
      navigator.vibrate(15);
    }
  }

  close() {
    if (!this.isOpen) return;
    
    // Animate close
    anime.remove([this.overlay, this.contentContainer]);
    
    anime({
      targets: this.overlay,
      opacity: [1, 0],
      duration: 250,
      easing: 'easeInQuad',
      complete: () => {
        this.overlay.classList.remove('active');
        this.isOpen = false;
      }
    });

    anime({
      targets: this.contentContainer,
      translateY: ['0%', '100%'],
      duration: 250,
      easing: 'easeInCubic'
    });
  }
}
