// Gamification System for Blog
class BlogGamification {
  constructor() {
    this.storage = window.localStorage;
    this.achievements = this.loadAchievements();
    this.stats = this.loadStats();
    this.init();
  }

  init() {
    this.updateDailyStreak();
    this.trackReadingProgress();
    this.setupInteractiveElements();
    this.showLevelUpUI();
    this.checkAchievements();
    this.initParticles();
    this.initEasterEggs();
  }

  // Stats Management
  loadStats() {
    const defaultStats = {
      xp: 0,
      level: 1,
      articlesRead: 0,
      totalReadTime: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastVisit: null,
      reactions: { fire: 0, heart: 0, laugh: 0, mind_blown: 0 },
      secretsFound: 0
    };
    const saved = this.storage.getItem('blogStats');
    return saved ? { ...defaultStats, ...JSON.parse(saved) } : defaultStats;
  }

  saveStats() {
    this.storage.setItem('blogStats', JSON.stringify(this.stats));
  }

  loadAchievements() {
    const defaultAchievements = {
      firstVisit: false,
      articleReader: false,
      speedReader: false,
      dedicated: false,
      weekWarrior: false,
      monthMaster: false,
      reactionist: false,
      secretHunter: false,
      nightOwl: false,
      earlyBird: false,
      scrollMaster: false,
      levelFive: false,
      levelTen: false
    };
    const saved = this.storage.getItem('achievements');
    return saved ? { ...defaultAchievements, ...JSON.parse(saved) } : defaultAchievements;
  }

  saveAchievements() {
    this.storage.setItem('achievements', JSON.stringify(this.achievements));
  }

  // XP and Leveling
  addXP(amount, reason) {
    this.stats.xp += amount;
    const oldLevel = this.stats.level;
    this.stats.level = Math.floor(this.stats.xp / 100) + 1;
    
    this.saveStats();
    this.showXPGain(amount, reason);
    
    if (this.stats.level > oldLevel) {
      this.levelUp(this.stats.level);
    }
    
    this.updateLevelDisplay();
  }

  showXPGain(amount, reason) {
    const xpNotif = document.createElement('div');
    xpNotif.className = 'xp-notification';
    xpNotif.innerHTML = `
      <span class="xp-amount">+${amount} XP</span>
      <span class="xp-reason">${reason}</span>
    `;
    document.body.appendChild(xpNotif);
    
    setTimeout(() => xpNotif.classList.add('show'), 10);
    setTimeout(() => {
      xpNotif.classList.remove('show');
      setTimeout(() => xpNotif.remove(), 300);
    }, 3000);
  }

  levelUp(newLevel) {
    this.unlockAchievement('levelFive', newLevel >= 5, 'Reached Level 5');
    this.unlockAchievement('levelTen', newLevel >= 10, 'Reached Level 10');
    
    const levelUpModal = document.createElement('div');
    levelUpModal.className = 'level-up-modal';
    levelUpModal.innerHTML = `
      <div class="level-up-content">
        <h2 class="pixel-text">LEVEL UP!</h2>
        <div class="level-number">${newLevel}</div>
        <p>You're getting good at this!</p>
        <button class="pixel-button" onclick="this.parentElement.parentElement.remove()">AWESOME!</button>
      </div>
    `;
    document.body.appendChild(levelUpModal);
    
    this.createFireworks();
  }

  // Streak System
  updateDailyStreak() {
    const today = new Date().toDateString();
    const lastVisit = this.stats.lastVisit;
    
    if (!lastVisit) {
      this.stats.currentStreak = 1;
      this.unlockAchievement('firstVisit', true, 'First Visit');
    } else {
      const lastVisitDate = new Date(lastVisit);
      const daysDiff = Math.floor((Date.now() - lastVisitDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        this.stats.currentStreak++;
        this.addXP(10, 'Daily Streak!');
      } else if (daysDiff > 1) {
        this.stats.currentStreak = 1;
      }
    }
    
    if (this.stats.currentStreak > this.stats.longestStreak) {
      this.stats.longestStreak = this.stats.currentStreak;
    }
    
    this.stats.lastVisit = today;
    this.saveStats();
    
    this.unlockAchievement('weekWarrior', this.stats.currentStreak >= 7, '7-Day Streak');
    this.unlockAchievement('monthMaster', this.stats.currentStreak >= 30, '30-Day Streak');
  }

  // Reading Progress Tracker
  trackReadingProgress() {
    if (!document.querySelector('.post-content')) return;
    
    let progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.innerHTML = '<div class="reading-progress-fill"></div>';
    document.body.appendChild(progressBar);
    
    let startTime = Date.now();
    let hasReachedEnd = false;
    
    window.addEventListener('scroll', () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      
      document.querySelector('.reading-progress-fill').style.width = progress + '%';
      
      // Award XP for milestones
      if (progress >= 25 && !this.progressMilestones?.quarter) {
        this.progressMilestones = this.progressMilestones || {};
        this.progressMilestones.quarter = true;
        this.addXP(5, '25% Read');
      }
      if (progress >= 50 && !this.progressMilestones?.half) {
        this.progressMilestones = this.progressMilestones || {};
        this.progressMilestones.half = true;
        this.addXP(10, '50% Read');
      }
      if (progress >= 75 && !this.progressMilestones?.threeQuarter) {
        this.progressMilestones = this.progressMilestones || {};
        this.progressMilestones.threeQuarter = true;
        this.addXP(15, '75% Read');
      }
      if (progress >= 95 && !hasReachedEnd) {
        hasReachedEnd = true;
        this.completeArticle();
      }
      
      if (scrollTop > 1000 && !this.achievements.scrollMaster) {
        this.unlockAchievement('scrollMaster', true, 'Scroll Master');
      }
    });
    
    // Track reading time
    setInterval(() => {
      if (document.hasFocus()) {
        this.stats.totalReadTime++;
        this.saveStats();
      }
    }, 1000);
  }

  completeArticle() {
    this.stats.articlesRead++;
    this.addXP(50, 'Article Complete!');
    this.saveStats();
    
    this.unlockAchievement('articleReader', this.stats.articlesRead >= 1, 'Read Your First Article');
    this.unlockAchievement('dedicated', this.stats.articlesRead >= 10, 'Read 10 Articles');
    
    this.showCompletionCelebration();
  }

  showCompletionCelebration() {
    const celebration = document.createElement('div');
    celebration.className = 'completion-celebration';
    celebration.innerHTML = `
      <div class="celebration-content">
        <div class="pixel-trophy">🏆</div>
        <h3>Article Complete!</h3>
        <p>+50 XP</p>
      </div>
    `;
    document.body.appendChild(celebration);
    
    setTimeout(() => celebration.classList.add('show'), 10);
    setTimeout(() => {
      celebration.classList.remove('show');
      setTimeout(() => celebration.remove(), 500);
    }, 3000);
  }

  // Interactive Reactions
  setupInteractiveElements() {
    if (!document.querySelector('.post-content')) return;
    
    const reactionsContainer = document.createElement('div');
    reactionsContainer.className = 'reactions-container';
    reactionsContainer.innerHTML = `
      <h4 class="reactions-title">React to this post:</h4>
      <div class="reactions-buttons">
        <button class="reaction-btn" data-reaction="fire" title="Fire! 🔥">
          <span class="reaction-emoji">🔥</span>
          <span class="reaction-count">${this.getReactionCount('fire')}</span>
        </button>
        <button class="reaction-btn" data-reaction="heart" title="Love it! ❤️">
          <span class="reaction-emoji">❤️</span>
          <span class="reaction-count">${this.getReactionCount('heart')}</span>
        </button>
        <button class="reaction-btn" data-reaction="laugh" title="LOL 😂">
          <span class="reaction-emoji">😂</span>
          <span class="reaction-count">${this.getReactionCount('laugh')}</span>
        </button>
        <button class="reaction-btn" data-reaction="mind_blown" title="Mind Blown 🤯">
          <span class="reaction-emoji">🤯</span>
          <span class="reaction-count">${this.getReactionCount('mind_blown')}</span>
        </button>
      </div>
    `;
    
    const article = document.querySelector('.post');
    if (article) {
      article.appendChild(reactionsContainer);
      
      document.querySelectorAll('.reaction-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const reaction = e.currentTarget.dataset.reaction;
          this.addReaction(reaction, e.currentTarget);
        });
      });
    }
  }

  getReactionCount(type) {
    const key = `reaction_${window.location.pathname}_${type}`;
    return parseInt(this.storage.getItem(key) || '0');
  }

  addReaction(type, button) {
    const key = `reaction_${window.location.pathname}_${type}`;
    const count = this.getReactionCount(type) + 1;
    this.storage.setItem(key, count);
    
    const countSpan = button.querySelector('.reaction-count');
    countSpan.textContent = count;
    
    this.stats.reactions[type]++;
    this.saveStats();
    
    const totalReactions = Object.values(this.stats.reactions).reduce((a, b) => a + b, 0);
    this.unlockAchievement('reactionist', totalReactions >= 10, 'Gave 10 Reactions');
    
    this.addXP(2, 'Reaction!');
    
    // Animate
    button.classList.add('reacted');
    this.createReactionBurst(button, button.querySelector('.reaction-emoji').textContent);
    setTimeout(() => button.classList.remove('reacted'), 600);
  }

  createReactionBurst(element, emoji) {
    const rect = element.getBoundingClientRect();
    for (let i = 0; i < 5; i++) {
      const particle = document.createElement('div');
      particle.className = 'reaction-particle';
      particle.textContent = emoji;
      particle.style.left = rect.left + rect.width / 2 + 'px';
      particle.style.top = rect.top + rect.height / 2 + 'px';
      particle.style.setProperty('--x', (Math.random() - 0.5) * 200 + 'px');
      particle.style.setProperty('--y', -Math.random() * 100 - 50 + 'px');
      document.body.appendChild(particle);
      
      setTimeout(() => particle.remove(), 1000);
    }
  }

  // Achievements
  unlockAchievement(id, condition, title) {
    if (condition && !this.achievements[id]) {
      this.achievements[id] = true;
      this.saveAchievements();
      this.showAchievement(title);
      this.addXP(100, 'Achievement!');
    }
  }

  showAchievement(title) {
    const achievement = document.createElement('div');
    achievement.className = 'achievement-unlock';
    achievement.innerHTML = `
      <div class="achievement-content">
        <div class="achievement-icon">🏆</div>
        <div class="achievement-text">
          <div class="achievement-label">Achievement Unlocked!</div>
          <div class="achievement-title">${title}</div>
        </div>
      </div>
    `;
    document.body.appendChild(achievement);
    
    setTimeout(() => achievement.classList.add('show'), 10);
    setTimeout(() => {
      achievement.classList.remove('show');
      setTimeout(() => achievement.remove(), 500);
    }, 4000);
    
    this.playAchievementSound();
  }

  checkAchievements() {
    const hour = new Date().getHours();
    this.unlockAchievement('nightOwl', hour >= 0 && hour < 6, 'Night Owl - Reading Past Midnight');
    this.unlockAchievement('earlyBird', hour >= 5 && hour < 8, 'Early Bird - Reading Before 8 AM');
  }

  // Easter Eggs
  initEasterEggs() {
    let konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // Up Up Down Down Left Right Left Right B A
    let konamiIndex = 0;
    
    document.addEventListener('keydown', (e) => {
      if (e.keyCode === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          this.activateKonamiCode();
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }
    });
    
    // Secret double-click on header
    const header = document.querySelector('.site-header');
    if (header) {
      header.addEventListener('dblclick', () => {
        this.stats.secretsFound++;
        this.saveStats();
        this.unlockAchievement('secretHunter', this.stats.secretsFound >= 1, 'Found a Secret!');
        this.matrixRain();
      });
    }
  }

  activateKonamiCode() {
    this.stats.secretsFound++;
    this.saveStats();
    this.unlockAchievement('secretHunter', true, 'Konami Code Master!');
    this.addXP(500, 'KONAMI CODE!');
    
    document.body.classList.add('rainbow-mode');
    setTimeout(() => document.body.classList.remove('rainbow-mode'), 10000);
    
    const msg = document.createElement('div');
    msg.className = 'konami-message';
    msg.textContent = '🎮 KONAMI CODE ACTIVATED! 🎮';
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 3000);
  }

  matrixRain() {
    const canvas = document.createElement('canvas');
    canvas.className = 'matrix-rain';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    const chars = '01アイウエオカキクケコサシスセソタチツテト';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);
    
    let frame = 0;
    const maxFrames = 200;
    
    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#00ff41';
      ctx.font = fontSize + 'px monospace';
      
      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, y * fontSize);
        
        if (y * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      });
      
      frame++;
      if (frame < maxFrames) {
        requestAnimationFrame(draw);
      } else {
        canvas.remove();
      }
    };
    
    draw();
  }

  // Particle Effects
  initParticles() {
    const canvas = document.createElement('canvas');
    canvas.className = 'particle-canvas';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }

  createFireworks() {
    const colors = ['#00ff41', '#ff006e', '#00d4ff', '#ffff00'];
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight * 0.5;
        this.createFirework(x, y, colors[Math.floor(Math.random() * colors.length)]);
      }, i * 200);
    }
  }

  createFirework(x, y, color) {
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.className = 'firework-particle';
      particle.style.left = x + 'px';
      particle.style.top = y + 'px';
      particle.style.backgroundColor = color;
      
      const angle = (Math.PI * 2 * i) / 30;
      const velocity = 2 + Math.random() * 2;
      particle.style.setProperty('--x', Math.cos(angle) * velocity * 50 + 'px');
      particle.style.setProperty('--y', Math.sin(angle) * velocity * 50 + 'px');
      
      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 1000);
    }
  }

  playAchievementSound() {
    // Create a simple beep using Web Audio API
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'square';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
      // Silent fail if audio not supported
    }
  }

  // Level Display
  showLevelUpUI() {
    const levelDisplay = document.createElement('div');
    levelDisplay.className = 'level-display';
    levelDisplay.innerHTML = `
      <div class="level-info">
        <span class="level-label">LVL</span>
        <span class="level-value">${this.stats.level}</span>
      </div>
      <div class="xp-bar">
        <div class="xp-fill" style="width: ${(this.stats.xp % 100)}%"></div>
      </div>
      <button class="stats-toggle" onclick="gamification.toggleStats()">📊</button>
    `;
    document.body.appendChild(levelDisplay);
  }

  updateLevelDisplay() {
    const levelValue = document.querySelector('.level-value');
    const xpFill = document.querySelector('.xp-fill');
    if (levelValue) levelValue.textContent = this.stats.level;
    if (xpFill) xpFill.style.width = (this.stats.xp % 100) + '%';
  }

  toggleStats() {
    let statsPanel = document.querySelector('.stats-panel');
    if (statsPanel) {
      statsPanel.remove();
      return;
    }
    
    const achievementsList = Object.entries(this.achievements)
      .filter(([_, unlocked]) => unlocked)
      .map(([id]) => this.getAchievementName(id))
      .join('</li><li>') || 'None yet!';
    
    statsPanel = document.createElement('div');
    statsPanel.className = 'stats-panel';
    statsPanel.innerHTML = `
      <div class="stats-panel-content">
        <h3>Your Stats 📊</h3>
        <button class="close-stats" onclick="this.parentElement.parentElement.remove()">✕</button>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-label">Level</div>
            <div class="stat-value">${this.stats.level}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Total XP</div>
            <div class="stat-value">${this.stats.xp}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Articles Read</div>
            <div class="stat-value">${this.stats.articlesRead}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Current Streak</div>
            <div class="stat-value">${this.stats.currentStreak} days</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Longest Streak</div>
            <div class="stat-value">${this.stats.longestStreak} days</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Reading Time</div>
            <div class="stat-value">${Math.floor(this.stats.totalReadTime / 60)} min</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Secrets Found</div>
            <div class="stat-value">${this.stats.secretsFound}</div>
          </div>
        </div>
        <div class="achievements-section">
          <h4>Achievements Unlocked (${Object.values(this.achievements).filter(Boolean).length}/${Object.keys(this.achievements).length})</h4>
          <ul class="achievements-list">
            <li>${achievementsList}</li>
          </ul>
        </div>
      </div>
    `;
    document.body.appendChild(statsPanel);
  }

  getAchievementName(id) {
    const names = {
      firstVisit: '🎮 First Visit',
      articleReader: '📖 Article Reader',
      speedReader: '⚡ Speed Reader',
      dedicated: '💪 Dedicated Reader (10 Articles)',
      weekWarrior: '🔥 Week Warrior (7-Day Streak)',
      monthMaster: '👑 Month Master (30-Day Streak)',
      reactionist: '❤️ Reactionist (10 Reactions)',
      secretHunter: '🔍 Secret Hunter',
      nightOwl: '🦉 Night Owl',
      earlyBird: '🐦 Early Bird',
      scrollMaster: '📜 Scroll Master',
      levelFive: '⭐ Level 5',
      levelTen: '⭐⭐ Level 10'
    };
    return names[id] || id;
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.gamification = new BlogGamification();
  });
} else {
  window.gamification = new BlogGamification();
}
