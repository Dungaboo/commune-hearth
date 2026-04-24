/* ============================================================
   Commune Hearth — Storage
   Centralised localStorage helpers. All keys prefixed ch_
   ============================================================ */

const HS = {

  // ── RAW ────────────────────────────────────────────────────
  get(key) {
    try { return JSON.parse(localStorage.getItem('ch_' + key)); }
    catch(e) { return null; }
  },
  set(key, val) {
    try { localStorage.setItem('ch_' + key, JSON.stringify(val)); }
    catch(e) { console.warn('Hearth storage write failed:', e); }
  },
  remove(key) {
    try { localStorage.removeItem('ch_' + key); }
    catch(e) {}
  },

  // ── THEME ──────────────────────────────────────────────────
  getTheme() {
    return this.get('theme') || { preset: 'ember', custom: {} };
  },
  setTheme(preset, custom = {}) {
    this.set('theme', { preset, custom });
  },

  // ── USER / ONBOARDING ──────────────────────────────────────
  getUser() {
    return this.get('user') || {
      name: '',
      community: '',
      type: '',
      platforms: ['discord', 'reddit', 'bluesky'],
    };
  },
  setUser(data) {
    this.set('user', { ...this.getUser(), ...data });
  },
  isOnboarded() {
    return this.get('onboarded') === true;
  },
  setOnboarded() {
    this.set('onboarded', true);
  },
  resetOnboarding() {
    this.remove('onboarded');
    this.remove('user');
  },

  // ── VOICE WORKSPACE ────────────────────────────────────────
  getDrafts() {
    return this.get('drafts') || {};
  },
  setDraft(platform, content) {
    const d = this.getDrafts();
    d[platform] = content;
    this.set('drafts', d);
  },
  clearDrafts() {
    this.remove('drafts');
  },
  getSession() {
    return this.get('session') || { name: 'Untitled session', brief: '' };
  },
  setSession(data) {
    this.set('session', { ...this.getSession(), ...data });
  },

  // ── VOICE PROFILES ─────────────────────────────────────────
  getVoiceProfiles() {
    return this.get('voices') || {};
  },
  setVoiceProfile(platform, posts) {
    const v = this.getVoiceProfiles();
    v[platform] = posts;
    this.set('voices', v);
  },

};

window.HS = HS;
