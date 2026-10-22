/* ==========================================================
   Gestion des Membres — Moustarchidine Junior
   Thème EVEIL : bleu du logo + orange du soleil, fond bleuté très clair.
   Pour revenir au thème vert d'origine : remplacer ce fichier par la
   sauvegarde « styles-vert.css », ou changer les variables ci-dessous
   (--brand: #0e5a42, --brand-rgb: 14, 90, 66, --gold: #d4a63d).
   ========================================================== */
@import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap");

:root {
  --font: "Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  --font-title: "Fraunces", Georgia, "Times New Roman", serif;

  --bg: #f3f6fb;
  --surface: #ffffff;
  --ink: #14202e;
  --muted: #5a6778;
  --line: #e1e7f0;
  --line-soft: #edf1f7;

  --brand: #1a64a8;
  --brand-rgb: 26, 100, 168;
  --brand-dark: #124d86;
  --brand-tint: #e6f0fa;
  --gold: #f5a60e;
  --gold-soft: #fdeccb;

  --ok: #18794e;
  --ok-tint: #e5f5ec;
  --bad: #b42318;
  --bad-tint: #fcebe9;
  --warn: #b54708;

  --radius: 14px;
  --shadow-sm: 0 1px 2px rgba(20, 32, 46, .05), 0 1px 3px rgba(20, 32, 46, .04);
  --shadow-md: 0 6px 20px rgba(20, 32, 46, .08);

  font-family: var(--font);
  color: var(--ink);
  background: var(--bg);
  font-synthesis: none;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); line-height: 1.5; }
::selection { background: var(--gold-soft); color: var(--ink); }
:focus-visible { outline: 2px solid var(--brand); outline-offset: 2px; }
a { color: inherit; }
h1, h2, h3 { letter-spacing: -.01em; }

/* ---------- Barres de défilement discrètes ---------- */
* { scrollbar-width: thin; scrollbar-color: #c3cddb transparent; }

/* ---------- Structure ---------- */
.app-shell { min-height: 100vh; }

/* ---------- Menu latéral ---------- */
.sidebar {
  position: fixed; inset: 0 auto 0 0; width: 264px; z-index: 20;
  display: flex; flex-direction: column;
  padding: 20px 14px;
  color: #d3e0f0;
  background:
    radial-gradient(120% 60% at 0% 0%, rgba(245, 166, 14, .15), transparent 55%),
    linear-gradient(180deg, #0d3560 0%, #07203f 100%);
  border-right: 1px solid rgba(255, 255, 255, .06);
}
.brand { position: relative; display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 4px 8px 22px; text-align: center; }
.brand .mobile-only { position: absolute; top: -4px; right: -4px; color: #d3e0f0; }
.brand-logo { width: 164px; height: auto; border-radius: 14px; border: 1px solid rgba(255, 255, 255, .1); box-shadow: 0 6px 18px rgba(0, 0, 0, .35); }
.login-logo { display: block; width: min(250px, 78%); height: auto; margin: 0 auto 18px; border-radius: 16px; box-shadow: 0 8px 22px rgba(0, 0, 0, .28); }
.brand strong, .brand small { display: block; }
.brand strong { font-size: 14.5px; font-weight: 700; color: #fff; line-height: 1.25; }
.brand small { font-size: 11.5px; color: #9db6d3; margin-top: 3px; }
.brand-mark {
  width: 42px; height: 42px; flex-shrink: 0; border-radius: 13px;
  display: grid; place-items: center;
  font-family: var(--font-title); font-weight: 700; font-size: 17px; letter-spacing: .02em;
  color: #0a2a4d;
  background: linear-gradient(145deg, #ffd061, var(--gold));
  box-shadow: 0 4px 14px rgba(245, 166, 14, .38), inset 0 1px 0 rgba(255, 255, 255, .5);
}
.brand-mark.large { width: 60px; height: 60px; font-size: 23px; border-radius: 18px; margin: 0 auto 14px; }

.sidebar nav { display: grid; gap: 3px; overflow-y: auto; padding-right: 2px; }
.nav-link {
  position: relative;
  display: flex; align-items: center; gap: 12px;
  padding: 11px 13px; border: 0; border-radius: 11px;
  background: transparent; color: #c4d5ea;
  font: inherit; font-size: 14px; font-weight: 500; text-align: left; text-decoration: none; cursor: pointer;
  transition: background .15s ease, color .15s ease;
}
.nav-link svg { opacity: .85; flex-shrink: 0; }
.nav-link:hover { background: rgba(255, 255, 255, .07); color: #fff; }
.nav-link.active { background: rgba(255, 255, 255, .11); color: #fff; font-weight: 700; }
.nav-link.active::before {
  content: ""; position: absolute; left: -14px; top: 9px; bottom: 9px; width: 4px;
  border-radius: 0 4px 4px 0; background: var(--gold);
}
.nav-link.active svg { opacity: 1; color: var(--gold); }

.sidebar-bottom { margin-top: auto; padding-top: 14px; border-top: 1px solid rgba(255, 255, 255, .08); }
.user-mini { font-size: 12.5px; color: #9db6d3; padding: 8px 13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.logout { width: 100%; }
.logout:hover { background: rgba(180, 35, 24, .25); }

/* ---------- Contenu principal ---------- */
.main { margin-left: 264px; min-height: 100vh; }
.topbar {
  position: sticky; top: 0; z-index: 5;
  height: 64px; display: flex; align-items: center; gap: 12px; padding: 0 32px;
  background: rgba(255, 255, 255, .82);
  -webkit-backdrop-filter: saturate(1.4) blur(10px); backdrop-filter: saturate(1.4) blur(10px);
  border-bottom: 1px solid var(--line);
}
.topbar-title { font-family: var(--font-title); font-weight: 700; font-size: 18px; color: var(--brand); }
.topbar-user {
  margin-left: auto; font-size: 13px; font-weight: 600; color: var(--muted);
  padding: 6px 12px; border-radius: 999px; background: var(--bg); border: 1px solid var(--line);
}
.content { padding: 32px; max-width: 1500px; margin: auto; }

.page-header { display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-bottom: 26px; }
.page-header h1 { font-family: var(--font-title); font-size: 32px; line-height: 1.15; margin: 0 0 6px; color: var(--ink); }
.page-header p { margin: 0; color: var(--muted); font-size: 15px; }
.page-header h1::after { content: ""; display: block; width: 46px; height: 4px; margin-top: 10px; border-radius: 4px; background: linear-gradient(90deg, #fcb017, #f08a00); }

/* ---------- Boutons ---------- */
.primary, .secondary {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  min-height: 42px; padding: 10px 16px; border-radius: 11px;
  font: inherit; font-size: 14px; font-weight: 700; cursor: pointer;
  transition: transform .12s ease, box-shadow .15s ease, background .15s ease, border-color .15s ease;
}
.primary {
  border: 0; color: #fff;
  background: linear-gradient(180deg, #2377c4, var(--brand));
  box-shadow: 0 1px 2px rgba(18, 77, 134, .32), 0 4px 12px rgba(var(--brand-rgb), .26);
}
.primary:hover:not(:disabled) { background: linear-gradient(180deg, var(--brand), var(--brand-dark)); transform: translateY(-1px); }
.primary:active:not(:disabled), .secondary:active:not(:disabled) { transform: translateY(0); }
.primary:disabled, .secondary:disabled { opacity: .55; cursor: not-allowed; }
.secondary { background: var(--surface); color: var(--ink); border: 1px solid #d4dce8; }
.secondary:hover:not(:disabled) { background: #f6f9fd; border-color: #bcc7d6; }
.full { width: 100%; }

.icon-btn {
  display: inline-grid; place-items: center;
  border: 0; background: transparent; padding: 8px; border-radius: 9px; cursor: pointer; color: var(--muted);
  transition: background .12s ease, color .12s ease;
}
.icon-btn:hover { background: var(--line-soft); color: var(--ink); }
.danger { color: var(--bad); }
.icon-btn.danger:hover { background: var(--bad-tint); color: var(--bad); }

/* ---------- Cartes de statistiques ---------- */
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 16px; margin-bottom: 22px; }
.stat-card {
  display: flex; justify-content: space-between; align-items: center; gap: 12px;
  padding: 20px; background: var(--surface);
  border: 1px solid var(--line); border-radius: 16px; box-shadow: var(--shadow-sm);
  transition: transform .15s ease, box-shadow .15s ease;
  animation: rise .4s ease both;
}
.stat-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
.stat-card:nth-child(2) { animation-delay: .05s; }
.stat-card:nth-child(3) { animation-delay: .1s; }
.stat-card:nth-child(4) { animation-delay: .15s; }
.stat-card:nth-child(5) { animation-delay: .2s; }
.stat-card:nth-child(6) { animation-delay: .25s; }
.stat-card span { display: block; color: var(--muted); font-size: 13px; font-weight: 600; }
.stat-card strong { display: block; margin-top: 6px; font-size: 30px; font-weight: 800; line-height: 1.1; font-variant-numeric: tabular-nums; letter-spacing: -.02em; }
.stat-card > svg {
  flex-shrink: 0; width: 48px; height: 48px; padding: 12px;
  border-radius: 14px; color: var(--brand); background: var(--brand-tint);
}

/* ---------- Panneaux ---------- */
.panel {
  background: var(--surface); border: 1px solid var(--line); border-radius: 16px;
  padding: 22px; margin-bottom: 20px; box-shadow: var(--shadow-sm);
}
.panel h2 { font-size: 17px; }
.chart { height: 400px; }
.muted { color: var(--muted); }

/* ---------- Recherche, formulaires ---------- */
.toolbar { display: flex; gap: 10px; margin-bottom: 16px; }
.input-icon {
  display: flex; align-items: center; gap: 9px; padding: 0 13px;
  background: var(--surface); border: 1px solid #d4dce8; border-radius: 11px; color: var(--muted);
  transition: border-color .15s ease, box-shadow .15s ease;
}
.input-icon:focus-within { border-color: var(--brand); box-shadow: 0 0 0 3px rgba(var(--brand-rgb), .16); }
.input-icon input { border: 0; outline: 0; padding: 12px 0; width: 100%; background: transparent; box-shadow: none; }
.input-icon input:focus { box-shadow: none; }
.search { max-width: 400px; width: 100%; }

label { display: grid; gap: 7px; font-size: 13px; font-weight: 700; color: #2f3d4f; }
input, select, textarea {
  border: 1px solid #d4dce8; border-radius: 10px; padding: 11px 12px;
  font: inherit; font-weight: 500; color: var(--ink); background: var(--surface); outline: none;
  transition: border-color .15s ease, box-shadow .15s ease;
}
textarea { resize: vertical; }
input::placeholder, textarea::placeholder { color: #93a0b2; }
input:focus, select:focus, textarea:focus { border-color: var(--brand); box-shadow: 0 0 0 3px rgba(var(--brand-rgb), .16); }
.form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }

/* ---------- Tableaux ---------- */
.table-wrap { overflow: auto; }
table { width: 100%; border-collapse: collapse; font-size: 14px; }
th, td { text-align: left; padding: 14px 14px; border-bottom: 1px solid var(--line-soft); white-space: nowrap; }
th { font-size: 11.5px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: .06em; background: #f7f9fc; border-bottom: 1px solid var(--line); }
tbody tr { transition: background .1s ease; }
tbody tr:hover { background: #f6f9fd; }
tbody tr:last-child td { border-bottom: 0; }

.badge {
  display: inline-flex; align-items: center; padding: 4px 10px; border-radius: 999px;
  background: #e9eef5; color: #394a5f; font-size: 12px; font-weight: 700;
}
.badge.active { background: var(--ok-tint); color: var(--ok); }
.badge.inactive { background: var(--bad-tint); color: var(--bad); }
.empty { padding: 40px 20px; text-align: center; color: #8795a8; }

/* ---------- Fenêtres (modales) ---------- */
.modal-backdrop {
  position: fixed; inset: 0; z-index: 50; display: grid; place-items: center; padding: 20px;
  background: rgba(7, 32, 63, .5);
  -webkit-backdrop-filter: blur(3px); backdrop-filter: blur(3px);
  animation: fade .15s ease both;
}
.modal {
  width: min(680px, 100%); max-height: 92vh; overflow-y: auto; padding: 24px;
  background: var(--surface); border-radius: 20px; box-shadow: 0 24px 70px rgba(7, 32, 63, .3);
  animation: pop .2s ease both;
}
.modal-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 20px; }
.modal-head h2 { margin: 0; font-family: var(--font-title); font-size: 22px; }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px; }

/* ---------- Messages ---------- */
.error-box { background: #fef3f2; color: var(--bad); border: 1px solid #fecdca; padding: 11px 13px; border-radius: 10px; font-size: 13.5px; font-weight: 500; }
.success-box { background: #ecfdf3; color: #067647; border: 1px solid #abefc6; padding: 11px 13px; border-radius: 10px; font-size: 13.5px; font-weight: 500; margin-top: 14px; }
.error-text { color: #b91c1c; }
.success-text { color: #15803d; }
.center-screen { min-height: 100vh; display: grid; place-items: center; color: var(--muted); }

/* ---------- Connexion et pointage QR ---------- */
.login-screen {
  min-height: 100vh; display: grid; place-items: center; padding: 20px;
  background:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='84' height='84' viewBox='0 0 84 84'%3E%3Cg fill='none' stroke='%23f5b942' stroke-opacity='.17' stroke-width='1'%3E%3Crect x='24' y='24' width='36' height='36'/%3E%3Crect x='24' y='24' width='36' height='36' transform='rotate(45 42 42)'/%3E%3C/g%3E%3C/svg%3E"),
    radial-gradient(90% 70% at 15% 0%, rgba(245, 166, 14, .12), transparent 60%),
    linear-gradient(160deg, #10427d 0%, #07203f 100%);
}
.login-card {
  width: min(430px, 100%); padding: 36px 34px;
  background: var(--surface); border: 1px solid rgba(255, 255, 255, .4); border-radius: 22px;
  box-shadow: 0 30px 80px rgba(0, 0, 0, .3);
  animation: pop .3s ease both;
}
.login-card h1 { margin: 0; text-align: center; font-family: var(--font-title); font-size: 27px; line-height: 1.2; }
.login-card > p { text-align: center; color: var(--muted); margin: 8px 0 26px; }
.login-card label { margin-top: 16px; }
.login-card .error-box { margin-top: 16px; }
.login-card .primary.full { margin-top: 20px; min-height: 46px; }
.forgot-password {
  display: flex; align-items: center; justify-content: center; gap: 6px; width: 100%;
  margin-top: 14px; padding: 8px; border: 0; background: transparent;
  color: var(--brand); font: inherit; font-size: 14px; font-weight: 700; cursor: pointer;
  text-decoration: underline; text-underline-offset: 3px;
}
.forgot-password:hover:not(:disabled) { color: var(--brand-dark); }
.forgot-password:disabled { opacity: .6; cursor: not-allowed; }

/* ---------- Présences ---------- */
.att-bar { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 14px; }
.att-counts { display: flex; gap: 8px; flex-wrap: wrap; font-size: 13px; font-weight: 700; }
.att-counts span { padding: 6px 12px; border-radius: 999px; background: #e9eef5; }
.att-counts .c-p { background: var(--ok-tint); color: var(--ok); }
.att-counts .c-a { background: var(--bad-tint); color: var(--bad); }
.att-counts .att-info { background: transparent; color: var(--muted); }
.att-actions { display: flex; gap: 8px; }
.att-list { background: var(--surface); border: 1px solid var(--line); border-radius: 16px; overflow: hidden; box-shadow: var(--shadow-sm); }
.att-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 11px 16px; border-bottom: 1px solid var(--line-soft); transition: background .1s ease; }
.att-row:hover { background: #f6f9fd; }
.att-row:last-child { border-bottom: 0; }
.att-name { font-weight: 600; }
.att-btns { display: flex; gap: 8px; }
.att-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 6px; min-width: 108px;
  padding: 10px 12px; border-radius: 10px; border: 1.5px solid #d4dce8;
  background: var(--surface); color: #46556a; font: inherit; font-weight: 700; cursor: pointer;
  transition: background .12s ease, border-color .12s ease, color .12s ease, transform .1s ease;
}
.att-btn:hover { border-color: #a9b7ca; }
.att-btn:active { transform: scale(.97); }
.att-btn.p.on { background: var(--ok); border-color: var(--ok); color: #fff; }
.att-btn.a.on { background: var(--bad); border-color: var(--bad); color: #fff; }

.type-tabs { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 18px; }
.type-tab {
  border: 1.5px solid #d4dce8; background: var(--surface); color: #46556a; border-radius: 999px;
  padding: 8px 16px; font: inherit; font-size: 13px; font-weight: 700; cursor: pointer;
  transition: background .12s ease, color .12s ease, border-color .12s ease;
}
.type-tab:hover { border-color: var(--brand); color: var(--brand); }
.type-tab.on { background: var(--brand); border-color: var(--brand); color: #fff; }

.import-box { border: 2px dashed #c6d1e0; border-radius: 14px; padding: 20px; text-align: center; margin-bottom: 14px; background: #f9fbfe; }

/* ---------- Mobile ---------- */
.mobile-only { display: none; }
.overlay { display: none; }

@media (max-width: 900px) {
  .sidebar { transform: translateX(-100%); transition: transform .22s ease; box-shadow: none; }
  .sidebar-open { transform: translateX(0); box-shadow: 10px 0 40px rgba(0, 0, 0, .35); }
  .nav-link.active::before { left: -14px; }
  .main { margin-left: 0; }
  .mobile-only { display: inline-flex; }
  .overlay { display: block; position: fixed; inset: 0; z-index: 10; background: rgba(7, 32, 63, .55); }
  .topbar { padding: 0 16px; }
  .content { padding: 22px 18px; }
}

@media (max-width: 600px) {
  .form-grid { grid-template-columns: 1fr; }
  .page-header { align-items: flex-start; flex-direction: column; }
  .page-header h1 { font-size: 26px; }
  .topbar-user { display: none; }
  .content { padding: 16px 14px; }
  .panel { padding: 16px; }
  .stat-card { padding: 16px; }
  .modal { padding: 18px; border-radius: 18px; }
  .login-card { padding: 28px 22px; }
  .att-row { flex-direction: column; align-items: stretch; }
  .att-btns .att-btn { flex: 1; }
}

/* ---------- Animations ---------- */
@keyframes rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
@keyframes fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes pop { from { opacity: 0; transform: translateY(8px) scale(.98); } to { opacity: 1; transform: none; } }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
}

/* ---------- Confort smartphone ---------- */
html { -webkit-text-size-adjust: 100%; -webkit-tap-highlight-color: transparent; }
body { overflow-x: hidden; }
.table-wrap { -webkit-overflow-scrolling: touch; }

@media (max-width: 900px) {
  .topbar { padding-top: env(safe-area-inset-top); height: calc(64px + env(safe-area-inset-top)); }
  .sidebar { padding-bottom: calc(14px + env(safe-area-inset-bottom)); overflow-y: auto; }
}

@media (max-width: 600px) {
  /* 16 px minimum : évite le zoom automatique sur iPhone dans les champs */
  input, select, textarea { font-size: 16px; padding: 12px; }
  .input-icon input { font-size: 16px; }

  /* Zones tactiles confortables */
  .primary, .secondary { min-height: 48px; font-size: 15px; }
  .icon-btn { padding: 11px; min-width: 44px; min-height: 44px; }
  .nav-link { min-height: 48px; }
  .type-tab { padding: 10px 16px; }
  .att-btn { min-height: 48px; }

  /* Barres d'outils et boutons d'action empilés */
  .toolbar { flex-wrap: wrap; }
  .toolbar > * { flex: 1 1 100%; }
  .search { max-width: none; }
  .page-header > div:last-child:not(:first-child) { width: 100%; display: flex; flex-wrap: wrap; gap: 8px; }

  /* Fenêtres plein écran avec défilement */
  .modal-backdrop { padding: 0; align-items: end; }
  .modal { max-height: 94vh; border-radius: 20px 20px 0 0; padding-bottom: calc(18px + env(safe-area-inset-bottom)); }
  .modal-actions { flex-direction: column-reverse; }
  .modal-actions button { width: 100%; }

  /* Tableaux : défilement horizontal, texte non coupé */
  table { font-size: 13px; }
  th, td { white-space: nowrap; }

  .chart { height: 300px; }
  .login-screen { padding: 14px; align-items: start; padding-top: 24px; }
}


/* ---------- Pied de page ---------- */
.main { display: flex; flex-direction: column; }
.main .content { flex: 1 0 auto; width: 100%; }
.site-footer {
  margin-top: 24px; padding: 18px 16px calc(18px + env(safe-area-inset-bottom));
  text-align: center; font-size: 12.5px; line-height: 1.7; color: var(--muted);
  border-top: 1px solid var(--line);
}
.site-footer div:first-child { font-weight: 700; color: var(--ink); }
.login-card .site-footer { margin-top: 22px; padding: 14px 0 0; }