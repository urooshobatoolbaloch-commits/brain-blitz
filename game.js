/**
 * ====================================================================
 * BRAIN BLITZ - GAME ENGINE (game.js)
 * Microsoft Computer & English Language Institute, Khairpur Mirs
 * 
 * Sections:
 * 1. CONFIGURATION (Tunable gameplay values)
 * 2. STATE MANAGEMENT (Global runtime state)
 * 3. LOCAL STORAGE & PERSISTENCE
 * 4. WEB AUDIO SYNTHESIZER (Pure Web Audio API sounds)
 * 5. MASCOT SYSTEM (Professor Hoot SVG & reactions)
 * 6. PARTICLES & FX CANVAS (Confetti, floating stars)
 * 7. SCREEN / HASH ROUTER (#menu, #select, #play, #typing, #results, #shop, #scores)
 * 8. CLASSIC QUIZ ENGINE (Timers, combos, answers, level-up)
 * 9. POWER-UPS LOGIC (50/50, Freeze, Extra Heart)
 * 10. TYPING RUSH MINI-GAME
 * 11. DAILY CHALLENGE ENGINE
 * 12. SHOP & OUTFITS
 * 13. ACHIEVEMENTS & BADGES
 * 14. INITIALIZATION & SERVICE WORKER
 * ====================================================================
 */

'use strict';

// ====================================================================
// 1. CONFIGURATION
// ====================================================================
const CONFIG = {
  INITIAL_HEARTS: 3,
  MAX_HEARTS: 3,
  BASE_TIMER_SEC: 12,
  MIN_TIMER_SEC: 6,
  TIMER_DECREMENT_PER_LEVEL: 0.8,
  QUESTIONS_PER_LEVEL: 5,
  BASE_POINTS: 100,
  MAX_SPEED_BONUS: 50,
  FREEZE_DURATION_SEC: 5,
  MAX_POWERUP_USES: 3,
  COMBO_THRESHOLDS: [
    { streak: 12, mult: 5 },
    { streak: 9, mult: 4 },
    { streak: 6, mult: 3 },
    { streak: 3, mult: 2 },
    { streak: 0, mult: 1 }
  ],
  STORAGE_KEYS: {
    SAVE_DATA: 'brain_blitz_save_v1'
  }
};

// ====================================================================
// 2. STATE MANAGEMENT
// ====================================================================
const GameState = {
  // User Persistent Data
  save: {
    coins: 0,
    equippedTheme: 'theme-default',
    equippedHat: 'grad-cap', // 'none', 'grad-cap', 'sunglasses', 'party-hat', 'headphones', 'crown'
    unlockedItems: ['theme-default', 'grad-cap'],
    highScores: {
      mix: 0,
      computers: 0,
      web: 0,
      graphic: 0,
      marketing: 0,
      english: 0,
      typing: 0
    },
    typingBestWords: 0,
    dailyStreak: 0,
    lastDailyDate: '', // 'YYYY-MM-DD'
    dailyCompletedDates: [],
    unlockedBadges: [],
    soundMuted: false
  },

  // Active Gameplay Session State
  session: {
    mode: 'classic', // 'classic' | 'daily' | 'typing'
    subject: 'mix',
    score: 0,
    level: 1,
    hearts: CONFIG.INITIAL_HEARTS,
    comboStreak: 0,
    maxCombo: 0,
    totalAnswered: 0,
    correctCount: 0,
    coinsEarnedThisRun: 0,
    
    // Question pool
    questionPool: [],
    currentQuestionIndex: 0,
    currentQuestion: null,
    currentShuffledOptions: [],
    correctOptionShuffledIndex: -1,
    hasAnsweredCurrent: false,

    // Timing
    timerDuration: CONFIG.BASE_TIMER_SEC,
    timeRemaining: CONFIG.BASE_TIMER_SEC,
    timerIntervalId: null,
    isFrozen: false,
    freezeTimeoutId: null,
    isPaused: false,

    // Power-up remaining uses
    powerups: {
      fiftyFifty: CONFIG.MAX_POWERUP_USES,
      freeze: CONFIG.MAX_POWERUP_USES,
      extraHeart: CONFIG.MAX_POWERUP_USES
    }
  },

  // Typing Rush State
  typing: {
    timeLeft: 30,
    timerId: null,
    wordsCompleted: 0,
    activeWord: '',
    currentTypedIndex: 0,
    wordList: [
      { word: 'HTML', cat: 'Web Tag' },
      { word: 'CODE', cat: 'Programming' },
      { word: 'DATA', cat: 'Information' },
      { word: 'BYTE', cat: 'Storage' },
      { word: 'FONT', cat: 'Typography' },
      { word: 'PIXEL', cat: 'Graphic Unit' },
      { word: 'MOUSE', cat: 'Input Hardware' },
      { word: 'SPEED', cat: 'Performance' },
      { word: 'LOGIC', cat: 'Reasoning' },
      { word: 'SERVER', cat: 'Cloud Host' },
      { word: 'DESIGN', cat: 'Creative Skill' },
      { word: 'VECTOR', cat: 'Scalable Art' },
      { word: 'SYSTEM', cat: 'Operating OS' },
      { word: 'BROWSER', cat: 'Web Explorer' },
      { word: 'MEMORY', cat: 'RAM Storage' },
      { word: 'GRAMMAR', cat: 'English Rules' },
      { word: 'MARKET', cat: 'Digital Ads' },
      { word: 'KEYBOARD', cat: 'Touch Typing' },
      { word: 'INSTITUTE', cat: 'Khairpur Mirs' },
      { word: 'EXCELLENCE', cat: 'Great Quality' }
    ]
  }
};

// ====================================================================
// 3. STORAGE & PERSISTENCE
// ====================================================================
function loadSavedData() {
  try {
    const raw = localStorage.getItem(CONFIG.STORAGE_KEYS.SAVE_DATA);
    if (raw) {
      const parsed = JSON.parse(raw);
      GameState.save = Object.assign({}, GameState.save, parsed);
      // Ensure highScores and arrays exist
      GameState.save.highScores = Object.assign({
        mix: 0, computers: 0, web: 0, graphic: 0, marketing: 0, english: 0, typing: 0
      }, GameState.save.highScores || {});
      GameState.save.unlockedItems = GameState.save.unlockedItems || ['theme-default', 'grad-cap'];
      GameState.save.unlockedBadges = GameState.save.unlockedBadges || [];
    }
  } catch (err) {
    console.warn('Brain Blitz: localStorage not available, continuing with session state.', err);
  }
}

function persistSaveData() {
  try {
    localStorage.setItem(CONFIG.STORAGE_KEYS.SAVE_DATA, JSON.stringify(GameState.save));
  } catch (err) {
    console.warn('Brain Blitz: Failed to persist to localStorage.', err);
  }
  updateGlobalCoinDisplay();
}

// ====================================================================
// 4. WEB AUDIO SYNTHESIZER (Pure Web Audio API)
// ====================================================================
class SoundManager {
  constructor() {
    this.ctx = null;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.initialized = true;
      }
    } catch (e) {
      console.warn('Web Audio not supported.', e);
    }
  }

  resumeIfNeeded() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  playTap() {
    if (GameState.save.soundMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {}
  }

  playCorrect() {
    if (GameState.save.soundMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (rising cheerful arpeggio)
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = now + (i * 0.06);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.12);
      });
    } catch (e) {}
  }

  playWrong() {
    if (GameState.save.soundMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.linearRampToValueAtTime(90, now + 0.25);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {}
  }

  playFanfare() {
    if (GameState.save.soundMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const melody = [
        { f: 523.25, t: 0 },
        { f: 659.25, t: 0.1 },
        { f: 783.99, t: 0.2 },
        { f: 1046.50, t: 0.35 },
        { f: 880.00, t: 0.5 },
        { f: 1046.50, t: 0.65 }
      ];
      melody.forEach(item => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const st = now + item.t;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(item.f, st);
        gain.gain.setValueAtTime(0.25, st);
        gain.gain.exponentialRampToValueAtTime(0.001, st + 0.22);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(st);
        osc.stop(st + 0.22);
      });
    } catch (e) {}
  }

  playPowerup() {
    if (GameState.save.soundMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.2);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } catch (e) {}
  }

  playKeypress() {
    if (GameState.save.soundMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(600, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.03);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.03);
    } catch (e) {}
  }
}

const AudioSys = new SoundManager();

// ====================================================================
// 5. MASCOT SYSTEM (Professor Hoot SVG Generator & Speech Lines)
// ====================================================================
const MASCOT_LINES = {
  welcome: [
    "Ready to train your brain today?",
    "Welcome to Microsoft Institute!",
    "Let's boost your skills!",
    "Knowledge is true power!"
  ],
  correct: [
    "Brilliant answer!",
    "Spot on!",
    "Excellent work!",
    "You're a genius!",
    "Sharp thinking!"
  ],
  combo: [
    "Combo on fire! 🔥",
    "Unstoppable momentum!",
    "Speed bonus secured!",
    "Keep this streak going!"
  ],
  wrong: [
    "Oops! Check the tip below!",
    "Don't worry, learn and continue!",
    "Close one! Keep your chin up!",
    "Mistakes make us smarter!"
  ],
  levelup: [
    "LEVEL UP! Incredible job!",
    "You're flying high now!",
    "Institute Champion in the making!"
  ],
  gameover: [
    "Great effort! Practice makes permanent!",
    "You did Khairpur Mirs proud!",
    "Play again to beat your record!"
  ]
};

function getRandomSpeech(category) {
  const arr = MASCOT_LINES[category] || MASCOT_LINES.welcome;
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Builds dynamic SVG representation of Professor Hoot with custom outfits & expressions
 */
function generateOwlSVG(expression = 'normal', hat = null) {
  const activeHat = hat || GameState.save.equippedHat;
  
  // Eye variations
  let eyePupils = `
    <circle cx="38" cy="46" r="6.5" fill="#0f172a" />
    <circle cx="36" cy="44" r="2.5" fill="#ffffff" />
    <circle cx="62" cy="46" r="6.5" fill="#0f172a" />
    <circle cx="60" cy="44" r="2.5" fill="#ffffff" />
  `;

  if (expression === 'happy') {
    eyePupils = `
      <path d="M 31 48 Q 38 40 45 48" stroke="#0f172a" stroke-width="4.5" fill="none" stroke-linecap="round" />
      <path d="M 55 48 Q 62 40 69 48" stroke="#0f172a" stroke-width="4.5" fill="none" stroke-linecap="round" />
      <circle cx="28" cy="54" r="4" fill="#f43f5e" opacity="0.6"/>
      <circle cx="72" cy="54" r="4" fill="#f43f5e" opacity="0.6"/>
    `;
  } else if (expression === 'shocked') {
    eyePupils = `
      <circle cx="38" cy="46" r="3.5" fill="#0f172a" />
      <circle cx="62" cy="46" r="3.5" fill="#0f172a" />
    `;
  } else if (expression === 'sleepy') {
    eyePupils = `
      <path d="M 31 46 L 45 46" stroke="#0f172a" stroke-width="4" stroke-linecap="round" />
      <path d="M 55 46 L 69 46" stroke="#0f172a" stroke-width="4" stroke-linecap="round" />
    `;
  }

  // Accessories / Hats
  let accessorySvg = '';
  switch (activeHat) {
    case 'grad-cap':
      accessorySvg = `
        <!-- Tiny Graduation Cap -->
        <polygon points="50,14 18,25 50,34 82,25" fill="#1e1b4b" stroke="#f59e0b" stroke-width="1.2" />
        <rect x="38" y="27" width="24" height="8" rx="2" fill="#312e81" />
        <circle cx="50" cy="24" r="2.5" fill="#f59e0b" />
        <path d="M 50 24 Q 68 26 72 35" stroke="#f59e0b" stroke-width="2" fill="none" />
        <circle cx="72" cy="35" r="2.5" fill="#f59e0b" />
      `;
      break;

    case 'sunglasses':
      accessorySvg = `
        <!-- Cool Sunglasses -->
        <path d="M 26 44 Q 38 42 46 44 L 46 51 Q 38 56 26 51 Z" fill="#0f172a" />
        <path d="M 54 44 Q 62 42 74 44 L 74 51 Q 62 56 54 51 Z" fill="#0f172a" />
        <rect x="44" y="44" width="12" height="4" fill="#0f172a" />
        <line x1="28" y1="46" x2="42" y2="49" stroke="#38bdf8" stroke-width="1.5" />
        <line x1="56" y1="46" x2="70" y2="49" stroke="#38bdf8" stroke-width="1.5" />
      `;
      break;

    case 'party-hat':
      accessorySvg = `
        <!-- Party Cone Hat -->
        <polygon points="50,10 32,32 68,32" fill="#ec4899" stroke="#fbcfe8" stroke-width="1.5" />
        <circle cx="50" cy="8" r="4" fill="#facc15" />
        <line x1="38" y1="24" x2="62" y2="24" stroke="#facc15" stroke-width="2.5" />
      `;
      break;

    case 'headphones':
      accessorySvg = `
        <!-- DJ Headphones -->
        <path d="M 24 50 A 28 28 0 0 1 76 50" fill="none" stroke="#2563eb" stroke-width="5" stroke-linecap="round" />
        <rect x="20" y="44" width="9" height="18" rx="4" fill="#f59e0b" />
        <rect x="71" y="44" width="9" height="18" rx="4" fill="#f59e0b" />
      `;
      break;

    case 'crown':
      accessorySvg = `
        <!-- Golden Crown -->
        <polygon points="32,32 32,20 41,27 50,16 59,27 68,20 68,32" fill="#f59e0b" stroke="#d97706" stroke-width="1.5" />
        <circle cx="32" cy="19" r="2.5" fill="#ef4444" />
        <circle cx="50" cy="15" r="2.5" fill="#3b82f6" />
        <circle cx="68" cy="19" r="2.5" fill="#22c55e" />
      `;
      break;

    default: // 'none'
      accessorySvg = '';
      break;
  }

  return `
    <svg class="owl-svg" viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg">
      <!-- Shadow -->
      <ellipse cx="50" cy="102" rx="34" ry="7" fill="rgba(0,0,0,0.2)" />

      <!-- Feet -->
      <ellipse cx="40" cy="98" rx="6" ry="3" fill="#f59e0b" />
      <ellipse cx="60" cy="98" rx="6" ry="3" fill="#f59e0b" />

      <!-- Body -->
      <path d="M 50 25 C 25 25, 20 55, 20 75 C 20 95, 35 98, 50 98 C 65 98, 80 95, 80 75 C 80 55, 75 25, 50 25 Z" fill="#2563eb" />

      <!-- Belly Patch -->
      <path d="M 50 50 C 35 50, 32 70, 32 82 C 32 94, 42 96, 50 96 C 58 96, 68 94, 68 82 C 68 70, 65 50, 50 50 Z" fill="#93c5fd" />

      <!-- Left Ear Tuft -->
      <polygon points="26,34 32,18 42,27" fill="#1d4ed8" />
      <!-- Right Ear Tuft -->
      <polygon points="74,34 68,18 58,27" fill="#1d4ed8" />

      <!-- Eyes Background -->
      <circle cx="38" cy="46" r="13" fill="#ffffff" stroke="#1d4ed8" stroke-width="2" />
      <circle cx="62" cy="46" r="13" fill="#ffffff" stroke="#1d4ed8" stroke-width="2" />

      <!-- Pupils / Eye expressions -->
      ${eyePupils}

      <!-- Beak -->
      <polygon points="50,49 44,56 56,56" fill="#f59e0b" stroke="#d97706" stroke-width="1" />

      <!-- Wings -->
      <ellipse cx="20" cy="65" rx="6" ry="16" fill="#1d4ed8" transform="rotate(12 20 65)" />
      <ellipse cx="80" cy="65" rx="6" ry="16" fill="#1d4ed8" transform="rotate(-12 80 65)" />

      <!-- Accessories (Grad Cap, Sunglasses, Crown, etc.) -->
      ${accessorySvg}
    </svg>
  `;
}

function updateAllOwlRenders(expression = 'normal') {
  const containers = document.querySelectorAll('.owl-render');
  const svgHtml = generateOwlSVG(expression);
  containers.forEach(el => {
    el.innerHTML = svgHtml;
  });
}

function triggerMascotReaction(elementId, expression, speechText, animClass = 'happy') {
  const container = document.getElementById(elementId);
  if (container) {
    const owlEl = container.querySelector('.owl-character') || container;
    owlEl.classList.remove('happy', 'shocked', 'cheering', 'idle');
    void owlEl.offsetWidth; // Reflow
    owlEl.classList.add(animClass);
    
    // Update SVG expression
    const renderEl = owlEl.querySelector('.owl-render');
    if (renderEl) {
      renderEl.innerHTML = generateOwlSVG(expression);
    }
  }

  // Update speech bubble if provided
  const bubble = document.querySelector(`#${elementId} .owl-speech-bubble`) || 
                 document.getElementById(elementId + '-speech-bubble') ||
                 document.getElementById('play-speech-bubble') ||
                 document.getElementById('menu-speech-bubble');
  if (bubble && speechText) {
    bubble.textContent = `"${speechText}"`;
    bubble.style.transform = 'scale(1.05)';
    setTimeout(() => {
      bubble.style.transform = 'scale(1)';
    }, 300);
  }
}

// ====================================================================
// 6. PARTICLES & FX CANVAS (Confetti & Sparkle Celebrations)
// ====================================================================
class ParticleEngine {
  constructor() {
    this.canvas = document.getElementById('fx-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.particles = [];
    this.animating = false;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  burst(x, y, count = 40, colors = ['#f59e0b', '#3b82f6', '#22c55e', '#ec4899', '#ffffff']) {
    if (!this.canvas || !this.ctx) return;
    const px = x !== undefined ? x : this.canvas.width / 2;
    const py = y !== undefined ? y : this.canvas.height / 3;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 3;
      this.particles.push({
        x: px,
        y: py,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 12,
        life: 1.0,
        decay: Math.random() * 0.02 + 0.015
      });
    }

    if (!this.animating) {
      this.animating = true;
      this.loop();
    }
  }

  loop() {
    if (!this.animating || !this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.22; // Gravity
      p.rotation += p.vRot;
      p.life -= p.decay;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = Math.max(0, p.life);
      this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      requestAnimationFrame(() => this.loop());
    } else {
      this.animating = false;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}

let FX = null;

// ====================================================================
// 7. SCREEN / HASH ROUTER
// ====================================================================
function navigateToScreen(targetHash) {
  const hash = targetHash.startsWith('#') ? targetHash : '#' + targetHash;
  window.location.hash = hash;
  renderScreenFromHash();
}

function renderScreenFromHash() {
  const hash = window.location.hash.toLowerCase() || '#menu';
  const validScreens = ['#menu', '#select', '#play', '#typing', '#results', '#shop', '#scores'];
  const activeHash = validScreens.includes(hash) ? hash : '#menu';

  // Toggle screens - strictly ensure only one screen is visible
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.add('hide', 'hidden');
    screen.classList.remove('active');
    screen.setAttribute('hidden', '');
  });

  const screenMap = {
    '#menu': 'screen-menu',
    '#select': 'screen-select',
    '#play': 'screen-play',
    '#typing': 'screen-typing',
    '#results': 'screen-results',
    '#shop': 'screen-shop',
    '#scores': 'screen-scores'
  };

  const targetId = screenMap[activeHash];
  const targetEl = document.getElementById(targetId);
  if (targetEl) {
    targetEl.removeAttribute('hidden');
    targetEl.classList.remove('hide', 'hidden');
    targetEl.classList.add('active');
  }

  // Top bar visibility toggles
  const modePill = document.getElementById('play-mode-pill');
  const pauseBtn = document.getElementById('btn-pause');

  if (activeHash === '#play') {
    modePill.classList.remove('hide');
    pauseBtn.classList.remove('hide');
    document.getElementById('play-mode-title').textContent = 
      GameState.session.mode === 'daily' ? 'Daily Blitz' : 'Classic';
  } else {
    modePill.classList.add('hide');
    pauseBtn.classList.add('hide');
  }

  // Hook screen-specific renders
  if (activeHash === '#menu') {
    renderMenuState();
  } else if (activeHash === '#shop') {
    renderShopItems();
  } else if (activeHash === '#scores') {
    renderScoresAndBadges();
  }

  // Close modals when changing routes
  closeAllModals();
}

// Android Hardware Back Button integration via hashchange
window.addEventListener('hashchange', () => {
  renderScreenFromHash();
});

// ====================================================================
// 8. CLASSIC QUIZ ENGINE
// ====================================================================
function startClassicGame(subject = 'mix') {
  AudioSys.resumeIfNeeded();
  AudioSys.playTap();

  GameState.session.mode = 'classic';
  GameState.session.subject = subject;
  GameState.session.score = 0;
  GameState.session.level = 1;
  GameState.session.hearts = CONFIG.INITIAL_HEARTS;
  GameState.session.comboStreak = 0;
  GameState.session.maxCombo = 0;
  GameState.session.totalAnswered = 0;
  GameState.session.correctCount = 0;
  GameState.session.coinsEarnedThisRun = 0;
  GameState.session.timerDuration = CONFIG.BASE_TIMER_SEC;
  GameState.session.isFrozen = false;
  GameState.session.isPaused = false;
  
  GameState.session.powerups = {
    fiftyFifty: CONFIG.MAX_POWERUP_USES,
    freeze: CONFIG.MAX_POWERUP_USES,
    extraHeart: CONFIG.MAX_POWERUP_USES
  };

  buildQuestionPool(subject);
  GameState.session.currentQuestionIndex = 0;

  updateHUD();
  updatePowerupButtons();
  navigateToScreen('#play');
  loadNextQuestion();
}

function buildQuestionPool(subject) {
  // Filter questions according to subject
  let pool = QUESTIONS_DATA.filter(q => {
    return subject === 'mix' ? true : q.subject === subject;
  });

  // Fisher-Yates Shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  // Sort pool progressively: Easy at beginning, Medium in middle, Hard later
  pool.sort((a, b) => {
    const weights = { easy: 1, medium: 2, hard: 3 };
    return weights[a.difficulty] - weights[b.difficulty];
  });

  GameState.session.questionPool = pool;
}

function loadNextQuestion() {
  if (GameState.session.hearts <= 0) {
    endGame();
    return;
  }

  // Check if we exhausted pool
  if (GameState.session.currentQuestionIndex >= GameState.session.questionPool.length) {
    // Re-shuffle to keep game going infinitely
    buildQuestionPool(GameState.session.subject);
    GameState.session.currentQuestionIndex = 0;
  }

  const q = GameState.session.questionPool[GameState.session.currentQuestionIndex];
  GameState.session.currentQuestion = q;
  GameState.session.hasAnsweredCurrent = false;

  // Prepare shuffled options
  const rawOptions = q.options.map((text, idx) => ({
    text,
    isCorrect: idx === q.answer
  }));

  for (let i = rawOptions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rawOptions[i], rawOptions[j]] = [rawOptions[j], rawOptions[i]];
  }

  GameState.session.currentShuffledOptions = rawOptions;
  GameState.session.correctOptionShuffledIndex = rawOptions.findIndex(o => o.isCorrect);

  // Render to DOM
  renderQuestionDOM(q, rawOptions);

  // Start question countdown
  startQuestionTimer();
}

function renderQuestionDOM(q, options) {
  const subjectLabels = {
    computers: '💻 Computers & IT',
    web: '🌐 Web Design',
    graphic: '🎨 Graphic Design',
    marketing: '📈 Digital Marketing',
    english: '📚 English Language',
    typing: '⌨️ Typing & Office',
    mix: '🌈 Mix Topics'
  };

  document.getElementById('play-subject-badge').textContent = subjectLabels[q.subject] || 'Quiz';
  document.getElementById('play-q-counter').textContent = `Question ${GameState.session.totalAnswered + 1}`;
  document.getElementById('question-text').textContent = q.question;

  const explanationBox = document.getElementById('explanation-box');
  explanationBox.classList.add('hide');

  const optionBtns = document.querySelectorAll('.option-btn');
  const letters = ['A', 'B', 'C', 'D'];

  optionBtns.forEach((btn, idx) => {
    btn.disabled = false;
    btn.classList.remove('correct', 'wrong', 'eliminated');
    btn.querySelector('.opt-letter').textContent = letters[idx];
    btn.querySelector('.opt-text').textContent = options[idx] ? options[idx].text : '';
  });

  // Mascot prompt
  triggerMascotReaction('screen-play', 'normal', "Pick the best answer!", 'idle');
}

function startQuestionTimer() {
  clearQuestionTimer();

  // Compute timer duration based on level
  const computedTimer = Math.max(
    CONFIG.MIN_TIMER_SEC,
    CONFIG.BASE_TIMER_SEC - (GameState.session.level - 1) * CONFIG.TIMER_DECREMENT_PER_LEVEL
  );

  GameState.session.timerDuration = computedTimer;
  GameState.session.timeRemaining = computedTimer;

  updateTimerBar(1);

  const tickInterval = 50; // ms
  GameState.session.timerIntervalId = setInterval(() => {
    if (GameState.session.isPaused || GameState.session.isFrozen) {
      return;
    }

    GameState.session.timeRemaining -= tickInterval / 1000;
    const fraction = Math.max(0, GameState.session.timeRemaining / GameState.session.timerDuration);
    updateTimerBar(fraction);

    if (GameState.session.timeRemaining <= 0) {
      clearQuestionTimer();
      handleTimeOut();
    }
  }, tickInterval);
}

function clearQuestionTimer() {
  if (GameState.session.timerIntervalId) {
    clearInterval(GameState.session.timerIntervalId);
    GameState.session.timerIntervalId = null;
  }
}

function updateTimerBar(fraction) {
  const bar = document.getElementById('timer-bar');
  if (!bar) return;
  bar.style.width = `${fraction * 100}%`;

  bar.classList.remove('warning', 'critical');
  if (fraction < 0.25) {
    bar.classList.add('critical');
  } else if (fraction < 0.5) {
    bar.classList.add('warning');
  }
}

function handleAnswerSelection(selectedIndex) {
  if (GameState.session.hasAnsweredCurrent || GameState.session.isPaused) return;
  GameState.session.hasAnsweredCurrent = true;
  clearQuestionTimer();

  GameState.session.totalAnswered++;
  const isCorrect = selectedIndex === GameState.session.correctOptionShuffledIndex;
  const optionBtns = document.querySelectorAll('.option-btn');

  if (isCorrect) {
    // --- CORRECT ANSWER ---
    AudioSys.playCorrect();
    optionBtns[selectedIndex].classList.add('correct');

    // Scoring math
    GameState.session.correctCount++;
    GameState.session.comboStreak++;
    if (GameState.session.comboStreak > GameState.session.maxCombo) {
      GameState.session.maxCombo = GameState.session.comboStreak;
    }

    const mult = getMultiplierForStreak(GameState.session.comboStreak);
    const speedFraction = Math.max(0, GameState.session.timeRemaining / GameState.session.timerDuration);
    const speedBonus = Math.round(speedFraction * CONFIG.MAX_SPEED_BONUS);
    const gainedPoints = (CONFIG.BASE_POINTS + speedBonus) * mult;
    GameState.session.score += gainedPoints;

    // Coins: 1 per correct + bonus at combo milestones
    let coinsGained = 1;
    if (GameState.session.comboStreak % 3 === 0) {
      coinsGained += 2; // bonus coins
    }
    GameState.session.coinsEarnedThisRun += coinsGained;
    GameState.save.coins += coinsGained;
    persistSaveData();

    // Floating score pop-up
    spawnFloatingScore(optionBtns[selectedIndex], `+${gainedPoints}`);

    // Mascot celebration
    if (mult > 1) {
      triggerMascotReaction('screen-play', 'happy', getRandomSpeech('combo'), 'happy');
      popComboBadge();
    } else {
      triggerMascotReaction('screen-play', 'happy', getRandomSpeech('correct'), 'happy');
    }

    updateHUD();

    // Level up check: every QUESTIONS_PER_LEVEL correct answers
    if (GameState.session.correctCount % CONFIG.QUESTIONS_PER_LEVEL === 0) {
      handleLevelUp();
      return;
    }

    setTimeout(() => {
      GameState.session.currentQuestionIndex++;
      loadNextQuestion();
    }, 1100);

  } else {
    // --- WRONG ANSWER ---
    AudioSys.playWrong();
    if (optionBtns[selectedIndex]) {
      optionBtns[selectedIndex].classList.add('wrong');
    }
    // Highlight correct answer
    if (optionBtns[GameState.session.correctOptionShuffledIndex]) {
      optionBtns[GameState.session.correctOptionShuffledIndex].classList.add('correct');
    }

    shakeScreen();
    GameState.session.comboStreak = 0;
    GameState.session.hearts--;

    triggerMascotReaction('screen-play', 'shocked', getRandomSpeech('wrong'), 'shocked');
    revealExplanation();
    updateHUD();

    setTimeout(() => {
      if (GameState.session.hearts <= 0) {
        endGame();
      } else {
        GameState.session.currentQuestionIndex++;
        loadNextQuestion();
      }
    }, 2400);
  }
}

function handleTimeOut() {
  if (GameState.session.hasAnsweredCurrent) return;
  GameState.session.hasAnsweredCurrent = true;

  AudioSys.playWrong();
  GameState.session.totalAnswered++;
  GameState.session.comboStreak = 0;
  GameState.session.hearts--;

  const optionBtns = document.querySelectorAll('.option-btn');
  if (optionBtns[GameState.session.correctOptionShuffledIndex]) {
    optionBtns[GameState.session.correctOptionShuffledIndex].classList.add('correct');
  }

  shakeScreen();
  triggerMascotReaction('screen-play', 'shocked', "Time's up! Let's review the answer.", 'shocked');
  revealExplanation();
  updateHUD();

  setTimeout(() => {
    if (GameState.session.hearts <= 0) {
      endGame();
    } else {
      GameState.session.currentQuestionIndex++;
      loadNextQuestion();
    }
  }, 2400);
}

function revealExplanation() {
  const q = GameState.session.currentQuestion;
  const box = document.getElementById('explanation-box');
  const text = document.getElementById('explanation-text');
  if (q && box && text) {
    text.textContent = q.explain;
    box.classList.remove('hide');
  }
}

function getMultiplierForStreak(streak) {
  for (const item of CONFIG.COMBO_THRESHOLDS) {
    if (streak >= item.streak) {
      return item.mult;
    }
  }
  return 1;
}

let levelUpDismissTimer = null;
let levelUpSafetyTimer = null;

function hideLevelUpBanner() {
  const banner = document.getElementById('modal-celebrate');
  if (banner) {
    banner.classList.add('hide', 'hidden');
    banner.setAttribute('hidden', '');
  }
  if (levelUpDismissTimer) {
    clearTimeout(levelUpDismissTimer);
    levelUpDismissTimer = null;
  }
  if (levelUpSafetyTimer) {
    clearTimeout(levelUpSafetyTimer);
    levelUpSafetyTimer = null;
  }
}

function handleLevelUp() {
  GameState.session.level++;
  AudioSys.playFanfare();

  // Celebration overlay & confetti
  if (FX) FX.burst(window.innerWidth / 2, window.innerHeight / 3, 50);

  const banner = document.getElementById('modal-celebrate');
  const levelTitle = document.getElementById('levelup-title');
  if (banner && levelTitle) {
    levelTitle.textContent = `LEVEL ${GameState.session.level}`;
    banner.removeAttribute('hidden');
    banner.classList.remove('hide', 'hidden');

    // Click/tap to dismiss early
    banner.onclick = () => {
      hideLevelUpBanner();
      GameState.session.currentQuestionIndex++;
      loadNextQuestion();
    };
  }

  // Bonus level-up coins
  GameState.session.coinsEarnedThisRun += 10;
  GameState.save.coins += 10;
  persistSaveData();

  triggerMascotReaction('screen-play', 'happy', getRandomSpeech('levelup'), 'cheering');

  // Auto-hide after 1.5 seconds
  if (levelUpDismissTimer) clearTimeout(levelUpDismissTimer);
  levelUpDismissTimer = setTimeout(() => {
    hideLevelUpBanner();
    GameState.session.currentQuestionIndex++;
    loadNextQuestion();
  }, 1500);

  // Safety timer so it can NEVER stay stuck under any circumstances
  if (levelUpSafetyTimer) clearTimeout(levelUpSafetyTimer);
  levelUpSafetyTimer = setTimeout(() => {
    hideLevelUpBanner();
  }, 2500);
}

function updateHUD() {
  // Score & Level
  document.getElementById('hud-score-number').textContent = GameState.session.score;
  document.getElementById('hud-level-number').textContent = GameState.session.level;

  // Hearts
  const heartsContainer = document.getElementById('hud-hearts');
  const heartElements = heartsContainer.querySelectorAll('.heart');
  heartElements.forEach((h, index) => {
    if (index < GameState.session.hearts) {
      h.classList.remove('lost');
    } else {
      h.classList.add('lost');
    }
  });

  // Combo Badge
  const mult = getMultiplierForStreak(GameState.session.comboStreak);
  const comboEl = document.getElementById('hud-combo-multiplier');
  comboEl.textContent = `${mult}x`;
}

function popComboBadge() {
  const badge = document.getElementById('hud-combo-badge');
  badge.classList.remove('pop');
  void badge.offsetWidth;
  badge.classList.add('pop');
}

function shakeScreen() {
  const app = document.getElementById('app');
  app.classList.remove('shake-screen');
  void app.offsetWidth;
  app.classList.add('shake-screen');
}

function spawnFloatingScore(targetElement, text) {
  const rect = targetElement.getBoundingClientRect();
  const fly = document.createElement('div');
  fly.className = 'flying-score';
  fly.textContent = text;
  fly.style.left = `${rect.left + rect.width / 2}px`;
  fly.style.top = `${rect.top}px`;
  document.body.appendChild(fly);

  setTimeout(() => {
    fly.remove();
  }, 800);
}

// ====================================================================
// 9. POWER-UPS LOGIC (50/50, Freeze, Extra Heart)
// ====================================================================
function usePowerup5050() {
  if (GameState.session.hasAnsweredCurrent || GameState.session.isPaused) return;
  if (GameState.session.powerups.fiftyFifty <= 0) {
    showToast("No 50/50 uses remaining!");
    return;
  }

  GameState.session.powerups.fiftyFifty--;
  AudioSys.playPowerup();
  updatePowerupButtons();

  const correctIdx = GameState.session.correctOptionShuffledIndex;
  const wrongIndices = [0, 1, 2, 3].filter(idx => idx !== correctIdx);

  // Shuffle wrong indices and take 2 to eliminate
  wrongIndices.sort(() => Math.random() - 0.5);
  const toEliminate = wrongIndices.slice(0, 2);

  const optionBtns = document.querySelectorAll('.option-btn');
  toEliminate.forEach(idx => {
    if (optionBtns[idx]) {
      optionBtns[idx].classList.add('eliminated');
      optionBtns[idx].disabled = true;
    }
  });

  showToast("Two wrong answers eliminated! ✂️");
}

function usePowerupFreeze() {
  if (GameState.session.hasAnsweredCurrent || GameState.session.isPaused) return;
  if (GameState.session.powerups.freeze <= 0) {
    showToast("No Freeze uses remaining!");
    return;
  }
  if (GameState.session.isFrozen) return;

  GameState.session.powerups.freeze--;
  AudioSys.playPowerup();
  updatePowerupButtons();

  GameState.session.isFrozen = true;
  const bar = document.getElementById('timer-bar');
  if (bar) bar.classList.add('frozen');
  showToast("Timer frozen for 5 seconds! ❄️");

  clearTimeout(GameState.session.freezeTimeoutId);
  GameState.session.freezeTimeoutId = setTimeout(() => {
    GameState.session.isFrozen = false;
    if (bar) bar.classList.remove('frozen');
  }, CONFIG.FREEZE_DURATION_SEC * 1000);
}

function usePowerupHeart() {
  if (GameState.session.hasAnsweredCurrent || GameState.session.isPaused) return;
  if (GameState.session.powerups.extraHeart <= 0) {
    showToast("No Heart power-ups left!");
    return;
  }
  if (GameState.session.hearts >= CONFIG.MAX_HEARTS) {
    showToast("Hearts already at maximum (3/3)!");
    return;
  }

  GameState.session.powerups.extraHeart--;
  GameState.session.hearts = Math.min(CONFIG.MAX_HEARTS, GameState.session.hearts + 1);
  AudioSys.playPowerup();
  updatePowerupButtons();
  updateHUD();
  showToast("Restored 1 Heart! 💖");
}

function updatePowerupButtons() {
  const b50 = document.getElementById('btn-powerup-5050');
  const bFr = document.getElementById('btn-powerup-freeze');
  const bHt = document.getElementById('btn-powerup-heart');

  document.getElementById('count-5050').textContent = GameState.session.powerups.fiftyFifty;
  document.getElementById('count-freeze').textContent = GameState.session.powerups.freeze;
  document.getElementById('count-heart').textContent = GameState.session.powerups.extraHeart;

  b50.disabled = GameState.session.powerups.fiftyFifty <= 0;
  bFr.disabled = GameState.session.powerups.freeze <= 0;
  bHt.disabled = GameState.session.powerups.extraHeart <= 0;
}

// ====================================================================
// GAME OVER & RESULTS SCREEN
// ====================================================================
function endGame() {
  clearQuestionTimer();
  clearTimeout(GameState.session.freezeTimeoutId);

  // Update records
  const subjectKey = GameState.session.subject;
  const currentBest = GameState.save.highScores[subjectKey] || 0;
  const isNewBest = GameState.session.score > currentBest;

  if (isNewBest) {
    GameState.save.highScores[subjectKey] = GameState.session.score;
  }

  // Check achievements unlock
  checkAchievementsOnEnd();
  persistSaveData();

  // Populate Results Screen
  document.getElementById('res-score').textContent = GameState.session.score;
  document.getElementById('res-best').textContent = GameState.save.highScores[subjectKey];
  document.getElementById('res-coins').textContent = `+${GameState.session.coinsEarnedThisRun}`;

  const accuracy = GameState.session.totalAnswered > 0
    ? Math.round((GameState.session.correctCount / GameState.session.totalAnswered) * 100)
    : 0;
  document.getElementById('res-accuracy').textContent = `${accuracy}%`;
  document.getElementById('res-max-combo').textContent = `${getMultiplierForStreak(GameState.session.maxCombo)}x`;

  document.getElementById('results-mode-subtitle').textContent = 
    GameState.session.mode === 'daily' ? 'Daily Blitz Results' : `Subject: ${subjectKey.toUpperCase()}`;

  triggerMascotReaction('screen-results', 'sleepy', getRandomSpeech('gameover'), 'idle');

  navigateToScreen('#results');
}

// ====================================================================
// 10. TYPING RUSH MINI-GAME (30-second Speed Typing)
// ====================================================================
function startTypingRush() {
  AudioSys.resumeIfNeeded();
  AudioSys.playTap();

  GameState.typing.timeLeft = 30;
  GameState.typing.wordsCompleted = 0;
  GameState.typing.currentTypedIndex = 0;

  // Shuffle word list
  GameState.typing.wordList.sort(() => Math.random() - 0.5);

  updateTypingHUD();
  loadNextTypingWord();
  navigateToScreen('#typing');

  // Focus hidden input for mobile/desktop keyboards
  const hiddenInput = document.getElementById('typing-hidden-input');
  if (hiddenInput) {
    hiddenInput.value = '';
    hiddenInput.focus();
  }

  clearInterval(GameState.typing.timerId);
  GameState.typing.timerId = setInterval(() => {
    GameState.typing.timeLeft--;
    updateTypingHUD();

    if (GameState.typing.timeLeft <= 0) {
      clearInterval(GameState.typing.timerId);
      endTypingRush();
    }
  }, 1000);
}

function loadNextTypingWord() {
  const wordObj = GameState.typing.wordList[
    GameState.typing.wordsCompleted % GameState.typing.wordList.length
  ];
  GameState.typing.activeWord = wordObj.word.toUpperCase();
  GameState.typing.currentTypedIndex = 0;

  document.getElementById('typing-category-hint').textContent = wordObj.cat;
  renderTypingSlots();
}

function renderTypingSlots() {
  const container = document.getElementById('typing-letters-container');
  container.innerHTML = '';

  const word = GameState.typing.activeWord;
  for (let i = 0; i < word.length; i++) {
    const slot = document.createElement('span');
    slot.className = 'letter-slot';
    slot.textContent = word[i];

    if (i < GameState.typing.currentTypedIndex) {
      slot.classList.add('correct');
    } else if (i === GameState.typing.currentTypedIndex) {
      slot.classList.add('active');
    }
    container.appendChild(slot);
  }
}

function handleTypingInputChar(char) {
  if (GameState.typing.timeLeft <= 0) return;

  const expectedChar = GameState.typing.activeWord[GameState.typing.currentTypedIndex];
  if (char.toUpperCase() === expectedChar) {
    // Correct letter
    AudioSys.playKeypress();
    GameState.typing.currentTypedIndex++;
    renderTypingSlots();

    if (GameState.typing.currentTypedIndex >= GameState.typing.activeWord.length) {
      // Completed word!
      AudioSys.playCorrect();
      GameState.typing.wordsCompleted++;
      GameState.save.coins += 2; // +2 coins per word
      persistSaveData();
      updateTypingHUD();

      if (FX) FX.burst(window.innerWidth / 2, window.innerHeight / 2, 25);
      loadNextTypingWord();
    }
  } else {
    // Incorrect letter
    AudioSys.playWrong();
    shakeScreen();
  }
}

function handleTypingBackspace() {
  if (GameState.typing.currentTypedIndex > 0) {
    GameState.typing.currentTypedIndex--;
    renderTypingSlots();
  }
}

function updateTypingHUD() {
  document.getElementById('typing-timer-display').textContent = `${GameState.typing.timeLeft}s`;
  document.getElementById('typing-words-display').textContent = GameState.typing.wordsCompleted;

  // WPM estimation: words * (60 / elapsed)
  const elapsed = 30 - GameState.typing.timeLeft;
  const wpm = elapsed > 0 ? Math.round((GameState.typing.wordsCompleted / elapsed) * 60) : 0;
  document.getElementById('typing-wpm-display').textContent = wpm;
}

function endTypingRush() {
  clearInterval(GameState.typing.timerId);

  // High score update
  if (GameState.typing.wordsCompleted > GameState.save.typingBestWords) {
    GameState.save.typingBestWords = GameState.typing.wordsCompleted;
  }

  if (GameState.typing.wordsCompleted >= 10) {
    unlockBadge('badge-typing-master');
  }
  persistSaveData();

  // Results screen
  GameState.session.score = GameState.typing.wordsCompleted * 200;
  GameState.session.coinsEarnedThisRun = GameState.typing.wordsCompleted * 2;
  GameState.session.totalAnswered = GameState.typing.wordsCompleted;
  GameState.session.correctCount = GameState.typing.wordsCompleted;
  GameState.session.maxCombo = GameState.typing.wordsCompleted;

  document.getElementById('res-score').textContent = `${GameState.typing.wordsCompleted} Words`;
  document.getElementById('res-best').textContent = `${GameState.save.typingBestWords} Words`;
  document.getElementById('res-coins').textContent = `+${GameState.session.coinsEarnedThisRun}`;
  document.getElementById('res-accuracy').textContent = '100%';
  document.getElementById('res-max-combo').textContent = `${GameState.typing.wordsCompleted}x`;
  document.getElementById('results-mode-subtitle').textContent = 'Typing Rush Completed';

  navigateToScreen('#results');
}

// ====================================================================
// 11. DAILY CHALLENGE ENGINE
// ====================================================================
function getTodayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function hasPlayedDailyToday() {
  return GameState.save.lastDailyDate === getTodayString();
}

function startDailyChallenge() {
  if (hasPlayedDailyToday()) {
    showToast("You already played today's Daily Challenge! Come back tomorrow.");
    return;
  }

  AudioSys.resumeIfNeeded();
  AudioSys.playTap();

  GameState.session.mode = 'daily';
  GameState.session.subject = 'mix';
  GameState.session.score = 0;
  GameState.session.level = 1;
  GameState.session.hearts = CONFIG.INITIAL_HEARTS;
  GameState.session.comboStreak = 0;
  GameState.session.maxCombo = 0;
  GameState.session.totalAnswered = 0;
  GameState.session.correctCount = 0;
  GameState.session.coinsEarnedThisRun = 0;
  GameState.session.timerDuration = CONFIG.BASE_TIMER_SEC;
  GameState.session.isFrozen = false;
  GameState.session.isPaused = false;

  GameState.session.powerups = {
    fiftyFifty: 1, // Only 1 use per powerup in daily challenge for high stakes
    freeze: 1,
    extraHeart: 1
  };

  // Deterministic seed based on today's date string
  const todayStr = getTodayString();
  let seed = 0;
  for (let i = 0; i < todayStr.length; i++) {
    seed = (seed * 31 + todayStr.charCodeAt(i)) % 1000000;
  }

  // Pick deterministic 10 questions
  const clone = [...QUESTIONS_DATA];
  const deterministicList = [];
  while (deterministicList.length < 10 && clone.length > 0) {
    seed = (seed * 9301 + 49297) % 233280;
    const index = Math.floor((seed / 233280) * clone.length);
    deterministicList.push(clone.splice(index, 1)[0]);
  }

  GameState.session.questionPool = deterministicList;
  GameState.session.currentQuestionIndex = 0;

  // Mark played & update streak
  GameState.save.lastDailyDate = todayStr;
  GameState.save.dailyStreak = (GameState.save.dailyStreak || 0) + 1;
  if (!GameState.save.dailyCompletedDates.includes(todayStr)) {
    GameState.save.dailyCompletedDates.push(todayStr);
  }
  if (GameState.save.dailyStreak >= 3) {
    unlockBadge('badge-daily-streak-3');
  }
  persistSaveData();

  updateHUD();
  updatePowerupButtons();
  navigateToScreen('#play');
  loadNextQuestion();
}

// ====================================================================
// 12. SHOP & OUTFITS
// ====================================================================
const SHOP_CATALOG = {
  accessories: [
    { id: 'grad-cap', name: 'Graduation Cap', icon: '🎓', price: 0, desc: 'Classic scholar look' },
    { id: 'sunglasses', name: 'Cool Shades', icon: '🕶️', price: 25, desc: 'Smooth dark sunglasses' },
    { id: 'party-hat', name: 'Party Cone Hat', icon: '🎉', price: 40, desc: 'Festive birthday vibe' },
    { id: 'headphones', name: 'DJ Headphones', icon: '🎧', price: 60, desc: 'High-fidelity audio cans' },
    { id: 'crown', name: 'Royal Crown', icon: '👑', price: 100, desc: 'Khairpur Mirs royalty' }
  ],
  themes: [
    { id: 'theme-default', name: 'Deep Navy (Default)', icon: '🌌', price: 0, desc: 'Classic institute theme' },
    { id: 'theme-midnight', name: 'Midnight Blue', icon: '🌃', price: 30, desc: 'Darker contrast mode' },
    { id: 'theme-cyberpunk', name: 'Cyber Neon', icon: '🔮', price: 50, desc: 'Vibrant violet & cyan' },
    { id: 'theme-emerald', name: 'Emerald Forest', icon: '🌲', price: 50, desc: 'Rich green aesthetic' }
  ]
};

function renderShopItems() {
  // Update shop preview mascot
  const shopOwl = document.querySelector('#shop-owl .owl-render');
  if (shopOwl) {
    shopOwl.innerHTML = generateOwlSVG('happy');
  }

  // Accessories tab
  const accContainer = document.getElementById('shop-items-accessories');
  accContainer.innerHTML = '';
  SHOP_CATALOG.accessories.forEach(item => {
    const isUnlocked = GameState.save.unlockedItems.includes(item.id);
    const isEquipped = GameState.save.equippedHat === item.id;

    const card = document.createElement('div');
    card.className = `shop-item-card ${isEquipped ? 'equipped' : ''}`;
    card.innerHTML = `
      <div class="shop-item-icon">${item.icon}</div>
      <div class="shop-item-title">${item.name}</div>
      <div class="shop-item-price">${isUnlocked ? 'Unlocked' : `🪙 ${item.price}`}</div>
      <button class="shop-btn ${isEquipped ? 'equipped' : (isUnlocked ? 'equip' : 'buy')}" data-id="${item.id}" data-type="hat">
        ${isEquipped ? 'EQUIPPED' : (isUnlocked ? 'EQUIP' : 'BUY')}
      </button>
    `;
    accContainer.appendChild(card);
  });

  // Themes tab
  const themesContainer = document.getElementById('shop-items-themes');
  themesContainer.innerHTML = '';
  SHOP_CATALOG.themes.forEach(item => {
    const isUnlocked = GameState.save.unlockedItems.includes(item.id);
    const isEquipped = GameState.save.equippedTheme === item.id;

    const card = document.createElement('div');
    card.className = `shop-item-card ${isEquipped ? 'equipped' : ''}`;
    card.innerHTML = `
      <div class="shop-item-icon">${item.icon}</div>
      <div class="shop-item-title">${item.name}</div>
      <div class="shop-item-price">${isUnlocked ? 'Unlocked' : `🪙 ${item.price}`}</div>
      <button class="shop-btn ${isEquipped ? 'equipped' : (isUnlocked ? 'equip' : 'buy')}" data-id="${item.id}" data-type="theme">
        ${isEquipped ? 'EQUIPPED' : (isUnlocked ? 'EQUIP' : 'BUY')}
      </button>
    `;
    themesContainer.appendChild(card);
  });
}

function handleShopAction(id, type) {
  const isHat = type === 'hat';
  const list = isHat ? SHOP_CATALOG.accessories : SHOP_CATALOG.themes;
  const item = list.find(i => i.id === id);
  if (!item) return;

  const isUnlocked = GameState.save.unlockedItems.includes(id);

  if (isUnlocked) {
    // Equip
    if (isHat) {
      GameState.save.equippedHat = id;
    } else {
      GameState.save.equippedTheme = id;
      applyTheme(id);
    }
    AudioSys.playTap();
    showToast(`Equipped ${item.name}! ✨`);
    persistSaveData();
    updateAllOwlRenders();
    renderShopItems();
  } else {
    // Buy
    if (GameState.save.coins >= item.price) {
      GameState.save.coins -= item.price;
      GameState.save.unlockedItems.push(id);
      if (isHat) {
        GameState.save.equippedHat = id;
      } else {
        GameState.save.equippedTheme = id;
        applyTheme(id);
      }
      AudioSys.playPowerup();
      if (FX) FX.burst(window.innerWidth / 2, window.innerHeight / 2, 30);
      showToast(`Purchased & Equipped ${item.name}! 🎉`);
      persistSaveData();
      updateAllOwlRenders();
      renderShopItems();
    } else {
      AudioSys.playWrong();
      showToast(`Not enough coins! Need ${item.price} coins.`);
    }
  }
}

function applyTheme(themeClass) {
  document.body.className = '';
  document.body.classList.add(themeClass || 'theme-default');
}

// ====================================================================
// 13. ACHIEVEMENTS & BADGES
// ====================================================================
const ACHIEVEMENTS_DATA = [
  { id: 'badge-first-win', title: 'First Steps', icon: '🌟', desc: 'Complete your first quiz game round' },
  { id: 'badge-combo-5', title: '5 Streak Star', icon: '🔥', desc: 'Achieve a 5-question answer combo' },
  { id: 'badge-combo-10', title: '10 Blitz Blast', icon: '⚡', desc: 'Achieve a 10-question answer combo' },
  { id: 'badge-perfect-10', title: 'Perfect Round', icon: '🎯', desc: 'Score 10 correct answers in a row without mistake' },
  { id: 'badge-daily-streak-3', title: 'Daily Devotee', icon: '📅', desc: 'Reach a 3-day Daily Blitz streak' },
  { id: 'badge-typing-master', title: 'Typing Master', icon: '⌨️', desc: 'Complete 10+ words in a Typing Rush' },
  { id: 'badge-subject-master', title: 'Subject Scholar', icon: '🎓', desc: 'Score 1000+ points across any subject' }
];

function unlockBadge(badgeId) {
  if (!GameState.save.unlockedBadges.includes(badgeId)) {
    GameState.save.unlockedBadges.push(badgeId);
    persistSaveData();
    const b = ACHIEVEMENTS_DATA.find(a => a.id === badgeId);
    if (b) {
      showToast(`Badge Unlocked: ${b.title}! 🏆`);
      AudioSys.playFanfare();
    }
  }
}

function checkAchievementsOnEnd() {
  unlockBadge('badge-first-win');
  if (GameState.session.maxCombo >= 5) unlockBadge('badge-combo-5');
  if (GameState.session.maxCombo >= 10) unlockBadge('badge-combo-10');
  if (GameState.session.correctCount >= 10 && GameState.session.hearts === CONFIG.INITIAL_HEARTS) {
    unlockBadge('badge-perfect-10');
  }
  if (GameState.session.score >= 1000) unlockBadge('badge-subject-master');
}

function renderScoresAndBadges() {
  // Records
  document.getElementById('score-best-mix').textContent = GameState.save.highScores.mix || 0;
  document.getElementById('score-best-typing').textContent = `${GameState.save.typingBestWords || 0} Words`;
  document.getElementById('score-daily-streak').textContent = `${GameState.save.dailyStreak || 0} Days`;

  const subjectList = document.getElementById('subject-scores-list');
  subjectList.innerHTML = '';
  const subjects = [
    { id: 'computers', name: 'Computers & IT', icon: '💻' },
    { id: 'web', name: 'Web Design', icon: '🌐' },
    { id: 'graphic', name: 'Graphic Design', icon: '🎨' },
    { id: 'marketing', name: 'Digital Marketing', icon: '📈' },
    { id: 'english', name: 'English Language', icon: '📚' },
    { id: 'typing', name: 'Typing & Office', icon: '⌨️' }
  ];

  subjects.forEach(s => {
    const card = document.createElement('div');
    card.className = 'score-record-card';
    card.innerHTML = `
      <div class="rec-icon">${s.icon}</div>
      <div class="rec-details">
        <span class="rec-title">${s.name}</span>
      </div>
      <span class="rec-score-value">${GameState.save.highScores[s.id] || 0}</span>
    `;
    subjectList.appendChild(card);
  });

  // Badges
  const badgesGrid = document.getElementById('tab-badges-content');
  badgesGrid.innerHTML = '';
  ACHIEVEMENTS_DATA.forEach(b => {
    const isUnlocked = GameState.save.unlockedBadges.includes(b.id);
    const card = document.createElement('div');
    card.className = `badge-card ${isUnlocked ? 'unlocked' : 'locked'}`;
    card.innerHTML = `
      <div class="badge-icon">${b.icon}</div>
      <div class="badge-title">${b.title}</div>
      <div class="badge-desc">${b.desc}</div>
      <div class="badge-status">${isUnlocked ? 'UNLOCKED' : 'LOCKED'}</div>
    `;
    badgesGrid.appendChild(card);
  });
}

// ====================================================================
// UTILITIES, MODALS & TOAST
// ====================================================================
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2500);
}

function updateGlobalCoinDisplay() {
  const el = document.getElementById('global-coin-count');
  if (el) el.textContent = GameState.save.coins;
}

function renderMenuState() {
  updateGlobalCoinDisplay();
  const streakText = document.getElementById('menu-daily-streak-text');
  if (streakText) {
    const played = hasPlayedDailyToday();
    streakText.textContent = played
      ? `Streak: ${GameState.save.dailyStreak} Days (Done)`
      : `Streak: ${GameState.save.dailyStreak} Days`;
  }
  triggerMascotReaction('menu-mascot-box', 'normal', getRandomSpeech('welcome'), 'idle');
}

function closeAllModals() {
  ['modal-how', 'modal-pause', 'modal-celebrate'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.classList.add('hide', 'hidden');
      el.setAttribute('hidden', '');
    }
  });
  if (levelUpDismissTimer) clearTimeout(levelUpDismissTimer);
  if (levelUpSafetyTimer) clearTimeout(levelUpSafetyTimer);
}

function showModal(modalId) {
  const el = document.getElementById(modalId);
  if (el) {
    el.removeAttribute('hidden');
    el.classList.remove('hide', 'hidden');
  }
}

function hideModal(modalId) {
  const el = document.getElementById(modalId);
  if (el) {
    el.classList.add('hide', 'hidden');
    el.setAttribute('hidden', '');
  }
}

function toggleSound() {
  GameState.save.soundMuted = !GameState.save.soundMuted;
  persistSaveData();

  const iconOn = document.querySelector('.icon-sound-on');
  const iconOff = document.querySelector('.icon-sound-off');
  if (iconOn && iconOff) {
    if (GameState.save.soundMuted) {
      iconOn.classList.add('hide');
      iconOff.classList.remove('hide');
      showToast('Sound muted 🔇');
    } else {
      iconOn.classList.remove('hide');
      iconOff.classList.add('hide');
      showToast('Sound enabled 🔊');
      AudioSys.resumeIfNeeded();
      AudioSys.playTap();
    }
  }
}

// ====================================================================
// 14. EVENT LISTENERS & INITIALIZATION
// ====================================================================
function initEventListeners() {
  // First-tap audio enabler (Web Audio policy compliance)
  window.addEventListener('click', () => AudioSys.resumeIfNeeded(), { once: true });
  window.addEventListener('touchstart', () => AudioSys.resumeIfNeeded(), { once: true });

  // Sound toggle button
  document.getElementById('btn-sound-toggle').addEventListener('click', toggleSound);

  // How to play button & modal
  document.getElementById('btn-how-to-play').addEventListener('click', () => {
    AudioSys.playTap();
    showModal('modal-how');
  });
  document.getElementById('btn-close-how').addEventListener('click', () => {
    AudioSys.playTap();
    hideModal('modal-how');
  });

  // Pause button & modal
  document.getElementById('btn-pause').addEventListener('click', () => {
    GameState.session.isPaused = true;
    AudioSys.playTap();
    showModal('modal-pause');
  });
  document.getElementById('btn-resume-game').addEventListener('click', () => {
    GameState.session.isPaused = false;
    AudioSys.playTap();
    hideModal('modal-pause');
  });
  document.getElementById('btn-quit-game').addEventListener('click', () => {
    GameState.session.isPaused = false;
    clearQuestionTimer();
    hideModal('modal-pause');
    navigateToScreen('#menu');
  });

  // Visibility Change: Fair timing (pauses game if tab hidden)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && window.location.hash === '#play') {
      GameState.session.isPaused = true;
      showModal('modal-pause');
    }
  });

  // Menu Navigation buttons
  document.getElementById('btn-play-classic').addEventListener('click', () => {
    AudioSys.playTap();
    navigateToScreen('#select');
  });

  document.getElementById('btn-daily-challenge').addEventListener('click', () => {
    startDailyChallenge();
  });

  document.getElementById('btn-typing-rush').addEventListener('click', () => {
    startTypingRush();
  });

  document.getElementById('btn-open-shop').addEventListener('click', () => {
    AudioSys.playTap();
    navigateToScreen('#shop');
  });

  document.getElementById('btn-open-scores').addEventListener('click', () => {
    AudioSys.playTap();
    navigateToScreen('#scores');
  });

  // Generic Back Buttons
  document.querySelectorAll('.back-btn, [data-target]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = btn.getAttribute('data-target') || '#menu';
      AudioSys.playTap();
      navigateToScreen(target);
    });
  });

  // Subject Select Cards
  document.querySelectorAll('.subject-card').forEach(card => {
    card.addEventListener('click', () => {
      const subj = card.getAttribute('data-subject');
      startClassicGame(subj);
    });
  });

  // Quiz Option buttons
  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index'), 10);
      handleAnswerSelection(idx);
    });
  });

  // Power-Up buttons
  document.getElementById('btn-powerup-5050').addEventListener('click', usePowerup5050);
  document.getElementById('btn-powerup-freeze').addEventListener('click', usePowerupFreeze);
  document.getElementById('btn-powerup-heart').addEventListener('click', usePowerupHeart);

  // Results screen buttons
  document.getElementById('btn-results-retry').addEventListener('click', () => {
    if (GameState.session.mode === 'typing') {
      startTypingRush();
    } else {
      startClassicGame(GameState.session.subject);
    }
  });

  document.getElementById('btn-results-share').addEventListener('click', () => {
    AudioSys.playTap();
    const score = GameState.session.score;
    const shareText = `I scored ${score} points in Brain Blitz for Microsoft Institute Khairpur Mirs! Can you beat my score? ⚡🦉`;
    if (navigator.share) {
      navigator.share({
        title: 'Brain Blitz High Score',
        text: shareText,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        showToast('Score copied to clipboard! Share with friends 📋');
      }).catch(() => {
        showToast(`Your score: ${score}!`);
      });
    }
  });

  // Shop Tabs
  document.querySelectorAll('.shop-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.shop-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetTab = tab.getAttribute('data-tab');
      if (targetTab === 'accessories') {
        document.getElementById('shop-items-accessories').classList.remove('hide');
        document.getElementById('shop-items-themes').classList.add('hide');
      } else {
        document.getElementById('shop-items-accessories').classList.add('hide');
        document.getElementById('shop-items-themes').classList.remove('hide');
      }
    });
  });

  // Shop items delegated click
  document.getElementById('screen-shop').addEventListener('click', (e) => {
    const btn = e.target.closest('.shop-btn');
    if (btn && !btn.classList.contains('equipped')) {
      const id = btn.getAttribute('data-id');
      const type = btn.getAttribute('data-type');
      handleShopAction(id, type);
    }
  });

  // Scores Tabs
  document.querySelectorAll('.scores-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.scores-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetTab = tab.getAttribute('data-tab');
      if (targetTab === 'records') {
        document.getElementById('tab-records-content').classList.remove('hide');
        document.getElementById('tab-badges-content').classList.add('hide');
      } else {
        document.getElementById('tab-records-content').classList.add('hide');
        document.getElementById('tab-badges-content').classList.remove('hide');
      }
    });
  });

  // Mascot interactive tap (makes Professor Hoot react cheerfully on tap)
  document.querySelectorAll('.owl-character').forEach(owl => {
    owl.addEventListener('click', () => {
      AudioSys.playTap();
      triggerMascotReaction(owl.parentElement.id || 'menu-mascot-box', 'happy', getRandomSpeech('welcome'), 'happy');
      if (FX) {
        const rect = owl.getBoundingClientRect();
        FX.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 15);
      }
    });
  });

  // Typing Rush: On-screen touch keyboard events
  const onscreenKb = document.getElementById('onscreen-keyboard');
  if (onscreenKb) {
    onscreenKb.addEventListener('click', (e) => {
      const keyBtn = e.target.closest('.key-btn');
      if (!keyBtn) return;
      const keyVal = keyBtn.getAttribute('data-key');
      if (keyVal === 'BACKSPACE') {
        handleTypingBackspace();
      } else if (keyVal) {
        handleTypingInputChar(keyVal);
      }
    });
  }

  // Typing Rush: Physical keyboard events
  window.addEventListener('keydown', (e) => {
    if (window.location.hash.toLowerCase() === '#typing') {
      if (e.key === 'Backspace') {
        handleTypingBackspace();
      } else if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
        handleTypingInputChar(e.key);
      }
    }
  });
}

// ====================================================================
// SERVICE WORKER REGISTRATION
// ====================================================================
function registerServiceWorker() {
  const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
  );

  if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || isLocalhost)) {
    try {
      navigator.serviceWorker.register('./sw.js')
        .then(reg => {
          console.log('Brain Blitz: Offline Service Worker active.', reg.scope);
        })
        .catch(err => {
          console.warn('Brain Blitz: Service Worker registration failed.', err);
        });
    } catch (e) {
      console.warn('Brain Blitz: SW registration error.', e);
    }
  }
}

// Master App Initialization
document.addEventListener('DOMContentLoaded', () => {
  // Explicitly reset runtime session state
  GameState.session.level = 1;
  GameState.session.score = 0;
  GameState.session.hearts = CONFIG.INITIAL_HEARTS;
  GameState.session.comboStreak = 0;
  GameState.session.correctCount = 0;
  GameState.session.totalAnswered = 0;
  GameState.session.isPaused = false;
  GameState.session.isFrozen = false;

  loadSavedData();
  applyTheme(GameState.save.equippedTheme);

  // Sync sound mute icon
  if (GameState.save.soundMuted) {
    const iconOn = document.querySelector('.icon-sound-on');
    const iconOff = document.querySelector('.icon-sound-off');
    if (iconOn && iconOff) {
      iconOn.classList.add('hide', 'hidden');
      iconOff.classList.remove('hide', 'hidden');
    }
  }

  // Explicitly close and hide all overlays on load
  closeAllModals();

  FX = new ParticleEngine();
  updateAllOwlRenders();
  initEventListeners();

  // If no hash or invalid hash, default to #menu
  if (!window.location.hash || window.location.hash === '#') {
    window.location.hash = '#menu';
  }
  renderScreenFromHash();
  registerServiceWorker();
});
