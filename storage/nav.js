/* ============================================================
   Commune Hearth — Navigation
   Sidebar injection, active states, page transitions, toasts.
   Depends on: storage.js, theme.js
   ============================================================ */

// ── PAGE TRANSITIONS ─────────────────────────────────────────
function navigateTo(url) {
  document.body.classList.add('page-exit');
  setTimeout(() => { window.location.href = url; }, 280);
}

// Run on every page load — fade in from below
(function pageEnter() {
  document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('page-enter');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.body.classList.remove('page-enter');
      });
    });
  });
})();

// ── SIDEBAR ───────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'dashboard', icon: '🏠', label: 'Your Hearth',       url: 'dashboard.html' },
  { id: 'calendar',  icon: '🗓', label: 'Content Calendar',  url: null },
  { id: 'workspace', icon: '✍️', label: 'Voice Workspace',   url: 'workspace.html' },
  { id: 'platforms', icon: '💬', label: 'Platforms',         url: null },
  { id: 'pulse',     icon: '📊', label: 'Community Pulse',   url: null },
  { id: 'themes',    icon: '🎨', label: 'Themes & Seasons',  url: 'themes' },
];

function buildSidebarHTML(activePage) {
  const user = HS.getUser();
  const initial = user.name ? user.name.charAt(0).toUpperCase() : '?';
  const items = NAV_ITEMS.map(item => {
    const isActive = item.id === activePage;
    const isComingSoon = item.url === null;
    const isThemes = item.url === 'themes';
    let onclick = '';
    if (isThemes)       onclick = `onclick="openThemePanel()"`;
    else if (isComingSoon) onclick = `onclick="showToast('${item.label} is still being built. It\\'s coming.')"`;
    else                onclick = `onclick="navigateTo('${item.url}')"`;
    return `
      <button class="nav-item${isActive ? ' active' : ''}" ${onclick}>
        <span class="nav-icon">${item.icon}</span>
        <span class="nav-tooltip">${item.label}</span>
      </button>`;
  }).join('');

  return `
    <div class="sidebar-logo" onclick="navigateTo('dashboard.html')">🔥</div>
    <div class="nav-items">${items}</div>
    <div class="sidebar-bottom">
      <button class="nav-item" onclick="showToast('Settings coming soon.')">
        <span class="nav-icon">⚙️</span>
        <span class="nav-tooltip">Settings</span>
      </button>
      <div class="sidebar-avatar" title="${user.name || 'Your profile'}">${initial}</div>
    </div>`;
}

function mountSidebar(activePage) {
  const mount = document.getElementById('sidebar-mount');
  if (!mount) return;
  mount.innerHTML = buildSidebarHTML(activePage);
}

// ── TOAST ─────────────────────────────────────────────────────
function showToast(message, duration = 2800) {
  const existing = document.querySelector('.hearth-toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'hearth-toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('visible'));
  });
  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 400);
  }, duration);
}

// ── CLOCK ─────────────────────────────────────────────────────
function startClock(clockId, ampmId) {
  function tick() {
    const now = new Date();
    let h = now.getHours(), m = now.getMinutes();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    const clockEl = document.getElementById(clockId);
    const ampmEl  = document.getElementById(ampmId);
    if (clockEl) clockEl.textContent = h + ':' + String(m).padStart(2,'0');
    if (ampmEl)  ampmEl.textContent  = ampm;
  }
  tick();
  setInterval(tick, 1000);
}

// ── DATE ──────────────────────────────────────────────────────
function formatDate(el) {
  if (!el) return;
  const days   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December'];
  const now = new Date();
  el.textContent = days[now.getDay()] + ', ' + months[now.getMonth()] + ' ' + now.getDate();
}

// ── GREETING ─────────────────────────────────────────────────
const GREETINGS = {
  morning:   [
    'The hearth is warm.',
    'The fire glowed through the night.',
    'Time to tend the fire!',
  ],
  afternoon: [
    'The community is alive.',
    'Your people are gathering.',
    'Keep the fire going.',
  ],
  evening:   [
    'The night settles in.',
    'The hearth burns quieter now.',
    'Tend the evening well.',
  ],
};

function buildGreeting(name) {
  const h = new Date().getHours();
  const slot = h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening';
  const word = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  const opts = GREETINGS[slot];
  const tail = opts[Math.floor(Math.random() * opts.length)];
  return `${word}, <em>${name || 'friend'}</em>. ${tail}`;
}

window.navigateTo   = navigateTo;
window.mountSidebar = mountSidebar;
window.showToast    = showToast;
window.startClock   = startClock;
window.formatDate   = formatDate;
window.buildGreeting = buildGreeting;
