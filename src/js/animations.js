import anime from 'animejs';

export const Animations = {
  // Page transition: slides out the current page, and slides/fades in the new page
  transitionPage(fromEl, toEl, callback) {
    if (!fromEl) {
      // Direct load
      toEl.style.display = 'block';
      toEl.style.opacity = '0';
      anime({
        targets: toEl,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 350,
        easing: 'easeOutQuart',
        complete: callback
      });
      return;
    }

    // Standard swap
    anime({
      targets: fromEl,
      opacity: [1, 0],
      translateY: [0, -20],
      duration: 200,
      easing: 'easeInQuad',
      complete: () => {
        fromEl.style.display = 'none';
        toEl.style.display = 'block';
        toEl.style.opacity = '0';
        
        anime({
          targets: toEl,
          opacity: [0, 1],
          translateY: [20, 0],
          duration: 300,
          easing: 'easeOutQuart',
          complete: callback
        });
      }
    });
  },

  // Accordion slide down/up
  toggleAccordion(contentEl, isOpen, callback) {
    if (isOpen) {
      contentEl.style.display = 'block';
      contentEl.style.maxHeight = '0px';
      
      const fullHeight = contentEl.scrollHeight;
      
      anime({
        targets: contentEl,
        maxHeight: [`0px`, `${fullHeight}px`],
        duration: 350,
        easing: 'easeOutCubic',
        complete: () => {
          contentEl.style.maxHeight = 'none'; // allow responsive resizing
          if (callback) callback();
        }
      });
    } else {
      const currentHeight = contentEl.scrollHeight;
      anime({
        targets: contentEl,
        maxHeight: [`${currentHeight}px`, `0px`],
        duration: 250,
        easing: 'easeInCubic',
        complete: () => {
          contentEl.style.display = 'none';
          if (callback) callback();
        }
      });
    }
  },

  // Slide/fade in items (e.g. news cards, artist details)
  fadeInList(targets) {
    anime({
      targets: targets,
      opacity: [0, 1],
      translateY: [15, 0],
      delay: anime.stagger(60),
      duration: 400,
      easing: 'easeOutBack'
    });
  },

  // Bounce animation for a badge/icon when favorited
  bounceElement(el) {
    anime({
      targets: el,
      scale: [1, 1.4, 0.9, 1.1, 1],
      duration: 500,
      easing: 'easeInOutBack'
    });
  }
};
