export class NotificationManager {
  constructor(languageManager) {
    this.languageManager = languageManager;
    this.permission = 'default';
    this.timers = new Map();
    this.reminderOffsets = [15, 10, 5];
    this.checkPermission();
    this.restoreScheduledReminders();
  }

  checkPermission() {
    if ('Notification' in window) {
      this.permission = Notification.permission;
    }
  }

  async requestPermission() {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported in this browser.');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission === 'granted';
    } catch (e) {
      console.error('Error requesting notification permission:', e);
      return false;
    }
  }

  sendNotification(title, body) {
    if (this.permission !== 'granted') return;

    try {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
          registration.showNotification(title, {
            body,
            icon: '/icon-192.png',
            badge: '/icon-192.png',
            vibrate: [100, 50, 100],
            tag: 'u-festival-reminder'
          });
        }).catch(() => {
          new Notification(title, { body, icon: '/icon-192.png' });
        });
      } else {
        new Notification(title, { body, icon: '/icon-192.png' });
      }
    } catch (e) {
      console.error('Error sending notification:', e);
    }
  }

  getScheduledReminders() {
    return JSON.parse(localStorage.getItem('scheduled_reminders') || '[]');
  }

  saveScheduledReminders(reminders) {
    localStorage.setItem('scheduled_reminders', JSON.stringify(reminders));
  }

  clearActReminders(actId) {
    const prefix = `${actId}-`;
    this.timers.forEach((timerId, key) => {
      if (key.startsWith(prefix)) {
        clearTimeout(timerId);
        this.timers.delete(key);
      }
    });

    const remaining = this.getScheduledReminders().filter(r => r.actId !== actId);
    this.saveScheduledReminders(remaining);
  }

  scheduleActReminders(actId, actName, stageName, slots) {
    this.clearActReminders(actId);

    const reminders = this.getScheduledReminders().filter(r => r.actId !== actId);
    const now = Date.now();
    const festivalDates = { saturday: '2026-08-15', sunday: '2026-08-16' };

    slots.forEach(slot => {
      const dateStr = festivalDates[slot.day];
      if (!dateStr) return;

      const [h, m] = slot.start.split(':').map(Number);
      const startTime = new Date(`${dateStr}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`);

      this.reminderOffsets.forEach(minutes => {
        const fireAt = startTime.getTime() - minutes * 60 * 1000;
        if (fireAt <= now) return;

        const key = `${actId}-${slot.day}-${slot.start}-${minutes}`;
        reminders.push({ key, actId, actName, stageName, fireAt, minutes });

        const delay = fireAt - now;
        const timerId = setTimeout(() => {
          const title = this.languageManager.t('notification_alert_title');
          const body = this.languageManager.t('notification_alert_body', {
            act: actName,
            minutes,
            stage: stageName
          });
          this.sendNotification(title, body);
          if ('vibrate' in navigator) navigator.vibrate([80, 40, 80]);
        }, delay);

        this.timers.set(key, timerId);
      });
    });

    this.saveScheduledReminders(reminders);
  }

  restoreScheduledReminders() {
    if (this.permission !== 'granted') return;

    const now = Date.now();
    const reminders = this.getScheduledReminders().filter(r => r.fireAt > now);

    reminders.forEach(r => {
      const delay = r.fireAt - now;
      const timerId = setTimeout(() => {
        const title = this.languageManager.t('notification_alert_title');
        const body = this.languageManager.t('notification_alert_body', {
          act: r.actName,
          minutes: r.minutes,
          stage: r.stageName
        });
        this.sendNotification(title, body);
      }, delay);
      this.timers.set(r.key, timerId);
    });

    this.saveScheduledReminders(reminders);
  }

  scheduleDemoNotification(actName, stageName) {
    if (this.permission !== 'granted') return;

    [15, 10, 5].forEach((minutes, index) => {
      setTimeout(() => {
        const title = this.languageManager.t('notification_alert_title');
        const body = this.languageManager.t('notification_alert_body', {
          act: actName,
          minutes,
          stage: stageName
        });
        this.sendNotification(title, body);
      }, (index + 1) * 8000);
    });
  }
}
