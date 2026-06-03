import { Animations } from '../animations';
import actsData from '../../data/acts.json';
import stagesData from '../../data/stages.json';
import newsData from '../../data/news.json';

export class HomePage {
  constructor(container, languageManager, popup, navigateToTab) {
    this.container = container;
    this.languageManager = languageManager;
    this.popup = popup;
    this.navigateToTab = navigateToTab;
    this.photoDataUrl = null;
    this.audioDataUrl = null;
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.isRecording = false;

    this.lastX = null;
    this.lastY = null;
    this.lastZ = null;
    this.lastUpdate = 0;
    this.shakeThreshold = 15;
    this.shakeBoundHandler = this.onDeviceMotion.bind(this);

    window.addEventListener('languagechanged', () => this.render());
  }

  activate() {
    this.render();
    this.bindEvents();
    this.startShakeDetection();
  }

  deactivate() {
    this.stopShakeDetection();
    this.stopRecording();
  }

  render() {
    const t = (key) => this.languageManager.t(key);
    const lang = this.languageManager.getLanguage();

    this.container.innerHTML = `
      <div class="page active" id="home-page">
        <div class="home-hero">
          <h2 class="home-hero-title">❤️U FESTIVAL</h2>
          <p class="home-hero-subtitle" data-i18n="header_subtitle">${t('header_subtitle')}</p>
          <span class="badge badge-primary">15 - 16 Augustus 2026</span>
        </div>

        <div class="home-section-title">
          <span data-i18n="news_title">${t('news_title')}</span>
        </div>
        <div class="news-feed" id="news-feed">
          ${this.renderNewsBlocks(lang)}
        </div>

        <div class="shake-banner" id="shake-trigger">
          <div class="shake-text">
            <h4 data-i18n="shake_title">${t('shake_title')}</h4>
            <p data-i18n="shake_desc">${t('shake_desc')}</p>
          </div>
          <div class="shake-icon">📱</div>
        </div>

        <div class="home-section-title">
          <span data-i18n="social_title">${t('social_title')}</span>
          <span class="badge" id="post-count-badge">0</span>
        </div>

        <div class="social-feed-container">
          <div class="feed-input-box">
            <textarea class="feed-input-textarea" id="feed-input" data-i18n-placeholder="social_placeholder" placeholder="${t('social_placeholder')}"></textarea>
            <div class="feed-input-actions">
              <div class="feed-media-btns">
                <label class="action-btn" id="camera-trigger" title="${t('social_camera')}">
                  📷
                  <input type="file" id="camera-file-input" accept="image/*" capture="environment" hidden />
                </label>
                <button class="action-btn" id="mic-trigger" title="${t('social_mic')}" type="button">🎤</button>
              </div>
              <img id="camera-preview" class="photo-preview" alt="" />
              <audio id="audio-preview" class="audio-preview" controls hidden></audio>
              <button class="btn btn-primary btn-post" id="btn-post-feed" data-i18n="social_post">${t('social_post')}</button>
            </div>
          </div>
          <div class="feed-posts" id="feed-posts-container"></div>
        </div>
      </div>
    `;

    this.renderPosts();
    Animations.fadeInList(this.container.querySelectorAll('.news-card'));
  }

  renderNewsBlocks(lang) {
    if (!newsData.length) {
      return `<div class="card news-card news-empty" data-i18n="news_empty">${this.languageManager.t('news_empty')}</div>`;
    }

    return newsData.map(item => `
      <article class="card news-card news-${item.type}">
        <div class="news-card-header">
          <span class="news-type-badge">${item.type === 'warning' ? '⚠️' : '📢'}</span>
          <time class="news-date">${item.date}</time>
        </div>
        <h3 class="news-card-title">${item.title[lang]}</h3>
        <p class="news-card-content">${item.content[lang]}</p>
      </article>
    `).join('');
  }

  bindEvents() {
    const postBtn = this.container.querySelector('#btn-post-feed');
    const inputField = this.container.querySelector('#feed-input');
    const fileInput = this.container.querySelector('#camera-file-input');
    const previewImg = this.container.querySelector('#camera-preview');
    const audioPreview = this.container.querySelector('#audio-preview');
    const micBtn = this.container.querySelector('#mic-trigger');
    const shakeTrigger = this.container.querySelector('#shake-trigger');

    postBtn?.addEventListener('click', () => {
      const text = inputField.value.trim();
      if (!text && !this.photoDataUrl && !this.audioDataUrl) return;
      this.addPost(text, this.photoDataUrl, this.audioDataUrl);
      inputField.value = '';
      this.photoDataUrl = null;
      this.audioDataUrl = null;
      previewImg.style.display = 'none';
      previewImg.src = '';
      audioPreview.hidden = true;
      audioPreview.src = '';
    });

    fileInput?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        this.photoDataUrl = event.target.result;
        previewImg.src = this.photoDataUrl;
        previewImg.style.display = 'block';
      };
      reader.readAsDataURL(file);
    });

    micBtn?.addEventListener('click', () => {
      if (this.isRecording) {
        this.stopRecording();
      } else {
        this.startRecording();
      }
    });

    shakeTrigger?.addEventListener('click', () => {
      this.requestDeviceMotionPermission().then(() => this.triggerShakeDiscovery());
    });
  }

  async startRecording() {
    if (!navigator.mediaDevices?.getUserMedia) {
      alert(this.languageManager.t('social_mic_unsupported'));
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];
      this.isRecording = true;

      const micBtn = this.container.querySelector('#mic-trigger');
      if (micBtn) micBtn.classList.add('recording');

      this.mediaRecorder.ondataavailable = (e) => this.audioChunks.push(e.data);
      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.audioDataUrl = URL.createObjectURL(blob);
        const audioPreview = this.container.querySelector('#audio-preview');
        if (audioPreview) {
          audioPreview.src = this.audioDataUrl;
          audioPreview.hidden = false;
        }
        stream.getTracks().forEach(track => track.stop());
      };

      this.mediaRecorder.start();
      if ('vibrate' in navigator) navigator.vibrate(50);
    } catch (e) {
      console.error('Microphone access denied:', e);
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
      const micBtn = this.container.querySelector('#mic-trigger');
      if (micBtn) micBtn.classList.remove('recording');
    }
  }

  getPosts() {
    return JSON.parse(localStorage.getItem('social_posts') || '[]');
  }

  addPost(content, image, audio) {
    const posts = this.getPosts();
    posts.unshift({
      id: Date.now(),
      user: this.languageManager.getLanguage() === 'nl' ? 'Bezoeker' : 'Visitor',
      time: this.languageManager.getLanguage() === 'nl' ? 'Zojuist' : 'Just now',
      content,
      image,
      audio
    });
    localStorage.setItem('social_posts', JSON.stringify(posts));
    this.renderPosts();
    if ('vibrate' in navigator) navigator.vibrate([40, 20, 40]);
  }

  renderPosts() {
    const posts = this.getPosts();
    const postsContainer = this.container.querySelector('#feed-posts-container');
    const postCountBadge = this.container.querySelector('#post-count-badge');
    if (!postsContainer) return;

    if (postCountBadge) postCountBadge.textContent = `${posts.length}`;

    if (!posts.length) {
      postsContainer.innerHTML = `<div class="card" style="padding:16px;text-align:center;" data-i18n="social_empty">${this.languageManager.t('social_empty')}</div>`;
      return;
    }

    postsContainer.innerHTML = posts.map(post => `
      <div class="feed-post">
        <div class="post-header">
          <span class="post-user">${post.user}</span>
          <span>${post.time}</span>
        </div>
        <div class="post-content">${post.content}</div>
        ${post.image ? `<img src="${post.image}" class="post-image" alt="" />` : ''}
        ${post.audio ? `<audio src="${post.audio}" controls class="post-audio"></audio>` : ''}
      </div>
    `).join('');

    Animations.fadeInList(postsContainer.querySelectorAll('.feed-post'));
  }

  startShakeDetection() {
    if ('DeviceMotionEvent' in window) {
      window.addEventListener('devicemotion', this.shakeBoundHandler, true);
    }
  }

  stopShakeDetection() {
    window.removeEventListener('devicemotion', this.shakeBoundHandler, true);
  }

  async requestDeviceMotionPermission() {
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
      try {
        const response = await DeviceMotionEvent.requestPermission();
        if (response === 'granted') this.startShakeDetection();
      } catch (e) {
        console.error('Permission error:', e);
      }
    }
  }

  onDeviceMotion(event) {
    const acceleration = event.accelerationIncludingGravity;
    if (!acceleration) return;

    const curTime = Date.now();
    if (curTime - this.lastUpdate > 100) {
      const diffTime = curTime - this.lastUpdate;
      this.lastUpdate = curTime;
      const { x, y, z } = acceleration;

      if (this.lastX !== null) {
        const speed = Math.abs(x + y + z - this.lastX - this.lastY - this.lastZ) / diffTime * 10000;
        if (speed > this.shakeThreshold) this.triggerShakeDiscovery();
      }
      this.lastX = x;
      this.lastY = y;
      this.lastZ = z;
    }
  }

  triggerShakeDiscovery() {
    const now = Date.now();
    if (this.lastShakeTime && now - this.lastShakeTime < 2000) return;
    this.lastShakeTime = now;

    if ('vibrate' in navigator) navigator.vibrate([100, 50, 100, 50, 200]);

    const isAct = Math.random() > 0.5;
    const lang = this.languageManager.getLanguage();
    const t = (key) => this.languageManager.t(key);

    if (isAct) {
      const randomAct = actsData[Math.floor(Math.random() * actsData.length)];
      this.popup.open(t('shake_success'), `
        <div style="text-align:center;padding:12px 0;">
          <img src="${randomAct.image}" style="width:120px;height:120px;border-radius:50%;object-fit:cover;margin:0 auto 16px;border:3px solid var(--primary-color);" alt="${randomAct.name}" />
          <h4 style="font-size:1.3rem;margin-bottom:8px;">${randomAct.name}</h4>
          <p style="color:var(--text-muted);font-size:0.9rem;margin-bottom:16px;">${randomAct.tagline[lang]}</p>
          <button class="btn btn-primary" id="btn-discovered-go-schedule">${t('shake_view_schedule')}</button>
        </div>
      `, (bodyEl) => {
        bodyEl.querySelector('#btn-discovered-go-schedule')?.addEventListener('click', () => {
          this.popup.close();
          this.navigateToTab('schedule');
        });
      });
    } else {
      const randomStage = stagesData[Math.floor(Math.random() * stagesData.length)];
      this.popup.open(t('shake_success'), `
        <div style="text-align:center;padding:12px 0;">
          <img src="${randomStage.image}" style="width:100%;height:120px;border-radius:var(--radius-md);object-fit:cover;margin:0 auto 16px;" alt="${randomStage.name}" />
          <h4 style="font-size:1.3rem;margin-bottom:8px;">${randomStage.name}</h4>
          <p style="color:var(--text-muted);font-size:0.9rem;margin-bottom:16px;">${randomStage.description[lang]}</p>
          <button class="btn btn-primary" id="btn-discovered-go-map">${t('shake_view_map')}</button>
        </div>
      `, (bodyEl) => {
        bodyEl.querySelector('#btn-discovered-go-map')?.addEventListener('click', () => {
          this.popup.close();
          this.navigateToTab('map');
          setTimeout(() => window.dispatchEvent(new CustomEvent('pantostage', { detail: { stageId: randomStage.id } })), 400);
        });
      });
    }
  }
}
