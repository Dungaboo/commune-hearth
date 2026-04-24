/* ============================================================
   Commune Hearth — Theme Engine
   Handles presets, custom colours, CSS var application,
   theme panel HTML and localStorage persistence.
   Depends on: storage.js
   ============================================================ */

const THEME_PRESETS = {
  ember: {
    bg:'#100d0a', bg2:'#1a1410', bg3:'#221a12',
    accent:'#c4622d', accent2:'#e8924a', text:'#f0e8dc',
    muted:'#a89880', faint:'#5a4a38', btnText:'#f0e8dc',
    surfaceRgb:'255,255,255', borderRgb:'255,255,255',
    activeNavRgb:'196,98,45',
    fireCore:'#ff4500', fireMid:'#ff8c00', fireBright:'#ffe066',
    fireTop:'#fff5cc', fireGlowRgb:'255,107,0',
    headingFont:"'Cormorant Garamond', serif", headingWeight:'300',
    neverBg:'#2d1f0e',
  },
  bloom: {
    bg:'#fdf6f0', bg2:'#fff0ec', bg3:'#ffe8e0',
    accent:'#e8405a', accent2:'#ff6b35', text:'#1a1018',
    muted:'#7a5f6a', faint:'#c4a8b0', btnText:'#ffffff',
    surfaceRgb:'0,0,0', borderRgb:'0,0,0',
    activeNavRgb:'232,64,90',
    fireCore:'#ff2060', fireMid:'#ff6040', fireBright:'#ffaa60',
    fireTop:'#ffe8d0', fireGlowRgb:'255,80,60',
    headingFont:"'Cormorant Garamond', serif", headingWeight:'300',
    neverBg:'#fff0ec',
  },
  neon: {
    bg:'#0d0d14', bg2:'#13131f', bg3:'#1a1a2a',
    accent:'#00e5ff', accent2:'#b94fff', text:'#e8f4ff',
    muted:'#6080a0', faint:'#304050', btnText:'#0d0d14',
    surfaceRgb:'255,255,255', borderRgb:'0,229,255',
    activeNavRgb:'0,229,255',
    fireCore:'#0080ff', fireMid:'#00ccff', fireBright:'#88eeff',
    fireTop:'#ccf8ff', fireGlowRgb:'0,180,255',
    headingFont:"'Syne', sans-serif", headingWeight:'800',
    neverBg:'#13131f',
  },
  meadow: {
    bg:'#f4f7f2', bg2:'#eaf2e8', bg3:'#e0ece0',
    accent:'#3a7d44', accent2:'#5aaa66', text:'#1a2a1c',
    muted:'#5a7060', faint:'#9ab89e', btnText:'#ffffff',
    surfaceRgb:'0,0,0', borderRgb:'0,0,0',
    activeNavRgb:'58,125,68',
    fireCore:'#00a020', fireMid:'#40c060', fireBright:'#90e898',
    fireTop:'#d0f8d8', fireGlowRgb:'0,160,60',
    headingFont:"'Fraunces', serif", headingWeight:'300',
    neverBg:'#eaf2e8',
  },
};

// ── HELPERS ──────────────────────────────────────────────────
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `${r},${g},${b}`;
}
function isDark(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return (r*0.299 + g*0.587 + b*0.114) < 140;
}

// ── APPLY ─────────────────────────────────────────────────────
function applyThemeVars(preset, custom = {}) {
  const base = THEME_PRESETS[preset] || THEME_PRESETS.ember;
  const c = { ...base };

  // Merge custom colour overrides
  const keyMap = { bg:'bg', accent:'accent', accent2:'accent2', text:'text', muted:'muted' };
  Object.entries(custom).forEach(([k,v]) => {
    if (keyMap[k]) c[keyMap[k]] = v;
  });

  // Recompute derived values from possibly-overridden accent
  c.activeNavRgb = hexToRgb(c.accent);
  c.fireGlowRgb  = hexToRgb(c.accent);
  c.surface = `rgba(${c.surfaceRgb},0.04)`;
  c.surface2 = `rgba(${c.surfaceRgb},0.07)`;
  c.border  = `rgba(${c.borderRgb},0.08)`;
  c.border2 = `rgba(${c.borderRgb},0.14)`;
  c.activeNavBg = `rgba(${c.activeNavRgb},0.15)`;
  c.heroGlow = `rgba(${hexToRgb(c.accent)},0.15)`;

  const root = document.documentElement;
  const vars = {
    '--bg': c.bg, '--bg2': c.bg2, '--bg3': c.bg3,
    '--surface': c.surface, '--surface2': c.surface2,
    '--border': c.border, '--border2': c.border2,
    '--accent': c.accent, '--accent2': c.accent2,
    '--text': c.text, '--muted': c.muted, '--faint': c.faint,
    '--btn-text': c.btnText,
    '--never-bg': c.neverBg || c.bg2,
    '--heading-font': c.headingFont,
    '--heading-weight': c.headingWeight,
    '--active-nav-bg': c.activeNavBg,
    '--hero-glow': c.heroGlow,
    '--fire-core': c.fireCore, '--fire-mid': c.fireMid,
    '--fire-bright': c.fireBright, '--fire-top': c.fireTop,
    '--fire-glow-rgb': c.fireGlowRgb,
  };
  Object.entries(vars).forEach(([k,v]) => root.style.setProperty(k, v));
}

// ── LOAD FROM STORAGE ────────────────────────────────────────
function loadTheme() {
  const saved = HS.getTheme();
  applyThemeVars(saved.preset, saved.custom);
  return saved;
}

// ── CURRENT STATE ────────────────────────────────────────────
let _currentPreset = 'ember';
let _currentCustom = {};

function applyPreset(name) {
  _currentPreset = name;
  _currentCustom = {};
  applyThemeVars(name, {});
  HS.setTheme(name, {});
  syncThemePanelUI();
}

function applyCustomColor(key, val) {
  _currentCustom[key] = val;
  applyThemeVars(_currentPreset, _currentCustom);
  HS.setTheme(_currentPreset, _currentCustom);
}

// ── THEME PANEL ───────────────────────────────────────────────
function buildThemePanelHTML() {
  return `
  <div class="tp-overlay" id="tp-overlay" onclick="closeThemePanel()"></div>
  <div class="tp-panel" id="tp-panel">
    <button class="tp-close" onclick="closeThemePanel()">✕</button>
    <div class="tp-head">
      <div class="tp-title">Themes &amp; Seasons</div>
      <div class="tp-sub">Make it yours</div>
    </div>
    <div class="tp-sect-label">Choose a vibe</div>
    <div class="tp-presets">
      <div class="tp-preset" data-preset="ember" onclick="applyPreset('ember')">
        <div class="tp-swatch" style="background:linear-gradient(135deg,#100d0a 40%,#c4622d)"></div>
        <span>Ember</span>
      </div>
      <div class="tp-preset" data-preset="bloom" onclick="applyPreset('bloom')">
        <div class="tp-swatch" style="background:linear-gradient(135deg,#fdf6f0 40%,#e8405a)"></div>
        <span>Bloom</span>
      </div>
      <div class="tp-preset" data-preset="neon" onclick="applyPreset('neon')">
        <div class="tp-swatch" style="background:linear-gradient(135deg,#0d0d14 40%,#00e5ff)"></div>
        <span>Neon</span>
      </div>
      <div class="tp-preset" data-preset="meadow" onclick="applyPreset('meadow')">
        <div class="tp-swatch" style="background:linear-gradient(135deg,#f4f7f2 40%,#3a7d44)"></div>
        <span>Meadow</span>
      </div>
    </div>
    <div class="tp-divider"></div>
    <div class="tp-sect-label">Fine-tune</div>
    <div class="tp-colors">
      ${['bg','accent','accent2','text','muted'].map(k => `
      <div class="tp-row">
        <span class="tp-label">${{bg:'Background',accent:'Accent',accent2:'Accent 2',text:'Text',muted:'Muted text'}[k]}</span>
        <div class="tp-sw-wrap">
          <div class="tp-sw-vis" id="vis-${k}"></div>
          <input type="color" id="pick-${k}" oninput="onThemePick('${k}',this.value)">
        </div>
        <input class="tp-hex" id="hex-${k}" maxlength="7" oninput="onThemeHex('${k}',this)" placeholder="#------">
      </div>`).join('')}
    </div>
    <button class="tp-reset" onclick="applyPreset(_currentPreset)">↺ Reset to preset</button>
    <div class="tp-chapter">
      Seasonal chapters change your workspace every few months.
      <em>The First Frost</em> is active.
    </div>
  </div>`;
}

function mountThemePanel() {
  const mount = document.getElementById('theme-panel-mount');
  if (!mount) return;
  mount.innerHTML = buildThemePanelHTML();
}

function openThemePanel() {
  document.getElementById('tp-panel').classList.add('open');
  document.getElementById('tp-overlay').classList.add('open');
}
function closeThemePanel() {
  document.getElementById('tp-panel').classList.remove('open');
  document.getElementById('tp-overlay').classList.remove('open');
}

function syncThemePanelUI() {
  const saved = HS.getTheme();
  _currentPreset = saved.preset;
  _currentCustom = saved.custom || {};
  const p = THEME_PRESETS[_currentPreset];
  const merged = { ...p, ..._currentCustom };
  document.querySelectorAll('.tp-preset').forEach(b => {
    b.classList.toggle('active', b.dataset.preset === _currentPreset);
  });
  ['bg','accent','accent2','text','muted'].forEach(k => {
    const val = merged[k];
    if (!val) return;
    const vis  = document.getElementById('vis-' + k);
    const pick = document.getElementById('pick-' + k);
    const hex  = document.getElementById('hex-' + k);
    if (vis)  vis.style.background = val;
    if (pick) pick.value = val;
    if (hex)  { hex.value = val.toUpperCase(); hex.classList.remove('invalid'); }
  });
}

function onThemePick(key, val) {
  applyCustomColor(key, val);
  const vis = document.getElementById('vis-' + key);
  const hex = document.getElementById('hex-' + key);
  if (vis) vis.style.background = val;
  if (hex) { hex.value = val.toUpperCase(); hex.classList.remove('invalid'); }
}
function onThemeHex(key, input) {
  let val = input.value.trim();
  if (!val.startsWith('#')) val = '#' + val;
  const valid = /^#[0-9a-fA-F]{6}$/.test(val);
  input.classList.toggle('invalid', !valid);
  if (!valid) return;
  applyCustomColor(key, val);
  const vis  = document.getElementById('vis-' + key);
  const pick = document.getElementById('pick-' + key);
  if (vis)  vis.style.background = val;
  if (pick) pick.value = val;
}

// ── INIT ──────────────────────────────────────────────────────
function initTheme() {
  const saved = loadTheme();
  _currentPreset = saved.preset || 'ember';
  _currentCustom = saved.custom || {};
}

window.THEME_PRESETS  = THEME_PRESETS;
window.applyPreset    = applyPreset;
window.applyCustomColor = applyCustomColor;
window.loadTheme      = loadTheme;
window.initTheme      = initTheme;
window.mountThemePanel = mountThemePanel;
window.openThemePanel  = openThemePanel;
window.closeThemePanel = closeThemePanel;
window.syncThemePanelUI = syncThemePanelUI;
window.onThemePick    = onThemePick;
window.onThemeHex     = onThemeHex;
window._currentPreset = _currentPreset;
window._currentCustom = _currentCustom;
