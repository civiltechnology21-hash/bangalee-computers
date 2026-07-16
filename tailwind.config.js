@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Hind+Siliguri:wght@300;400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bc-bg:          #f4f6f9;
  --bc-surface:     #eef2f8;
  --bc-card:        #ffffff;
  --bc-border:      rgba(162,170,173,0.30);
  --bc-metal:       #A2AAAD;
  --bc-tint:        #e6effd;

  --bc-text-dark:   #1a1f1f;
  --bc-text:        #4b5457;
  --bc-muted:       #8b9295;

  --bc-accent:       #6f95d6;
  --bc-accent-dark:  #4a6fae;
  --bc-accent-light: #c7d9f4;

  --bc-blue:        #6f95d6;
  --bc-cyan:        #a9c3ee;
  --bc-wa:          #6f95d6;
  --bc-amber:       #7d868a;
  --bc-red:         #5f6669;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html { scroll-behavior: smooth; }

body {
  background-color: var(--bc-bg);
  color: var(--bc-text-dark);
  font-family: 'Outfit', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.bengali { font-family: 'Hind Siliguri', sans-serif; }

/* ── Scrollbar ── */
::-webkit-scrollbar        { width: 5px; }
::-webkit-scrollbar-track  { background: var(--bc-bg); }
::-webkit-scrollbar-thumb  { background: var(--bc-metal); border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: var(--bc-accent); }

/* ── Circuit board background ── */
.circuit-bg {
  background-color: var(--bc-bg);
  background-image:
    linear-gradient(to right, rgba(162,170,173,0.20) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(162,170,173,0.20) 1px, transparent 1px),
    radial-gradient(circle, #c7d9f4 1.6px, transparent 1.6px);
  background-size:
    48px 48px,
    48px 48px,
    48px 48px;
  background-position:
    0 0,
    0 0,
    24px 24px;
}

.grid-bg { @apply circuit-bg; }

/* ── Gradient text ── */
.gradient-text {
  background: linear-gradient(135deg, #4a6fae 0%, #a9c3ee 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.gradient-text-warm {
  background: linear-gradient(135deg, #A2AAAD 0%, #5f6669 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ── Badge system ── */
.badge-new         { background: rgba(111,149,214,0.14); color: #3d5680; border: 1px solid rgba(111,149,214,0.30); }
.badge-used        { background: rgba(125,134,138,0.14); color: #5f6669; border: 1px solid rgba(125,134,138,0.30); }
.badge-accessories { background: rgba(162,170,173,0.18); color: #4b5457; border: 1px solid rgba(162,170,173,0.35); }
.badge-services    { background: rgba(230,239,253,0.70); color: #3d5680; border: 1px solid rgba(111,149,214,0.25); }

/* ── Shimmer ── */
.shimmer {
  background: linear-gradient(90deg,
    var(--bc-card) 25%,
    var(--bc-tint) 50%,
    var(--bc-card) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.6s linear infinite;
}

@keyframes shimmer {
  0%   { background-position:  200% 0; }
  100% { background-position: -200% 0; }
}

/* ── WhatsApp pulse ── */
.wa-pulse { animation: waPulse 2.4s cubic-bezier(0.4,0,0.6,1) infinite; }

@keyframes waPulse {
  0%, 100% { box-shadow: 0 0 0 0   rgba(111,149,214,0.45); }
  50%       { box-shadow: 0 0 0 14px rgba(111,149,214,0); }
}

/* ── Floating CTA ── */
.float-cta { animation: ctaFloat 5s ease-in-out infinite; }

@keyframes ctaFloat {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-6px); }
}

/* ── Page entry ── */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

.fade-up    { animation: fadeUp 0.60s cubic-bezier(0.4,0,0.2,1) forwards; }
.fade-up-d1 { animation: fadeUp 0.60s 0.12s cubic-bezier(0.4,0,0.2,1) forwards; opacity: 0; }
.fade-up-d2 { animation: fadeUp 0.60s 0.24s cubic-bezier(0.4,0,0.2,1) forwards; opacity: 0; }
.fade-up-d3 { animation: fadeUp 0.60s 0.36s cubic-bezier(0.4,0,0.2,1) forwards; opacity: 0; }
.fade-up-d4 { animation: fadeUp 0.60s 0.48s cubic-bezier(0.4,0,0.2,1) forwards; opacity: 0; }

/* ── Scroll reveal ── */
.reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.55s cubic-bezier(0.4,0,0.2,1),
              transform 0.55s cubic-bezier(0.4,0,0.2,1);
}
.reveal.revealed          { opacity: 1; transform: translateY(0); }
.reveal-d1                { transition-delay: 0.10s; }
.reveal-d2                { transition-delay: 0.20s; }
.reveal-d3                { transition-delay: 0.30s; }
.reveal-d4                { transition-delay: 0.40s; }

.reveal-left {
  opacity: 0; transform: translateX(-28px);
  transition: opacity 0.55s cubic-bezier(0.4,0,0.2,1),
              transform 0.55s cubic-bezier(0.4,0,0.2,1);
}
.reveal-left.revealed  { opacity: 1; transform: translateX(0); }

.reveal-right {
  opacity: 0; transform: translateX(28px);
  transition: opacity 0.55s cubic-bezier(0.4,0,0.2,1),
              transform 0.55s cubic-bezier(0.4,0,0.2,1);
}
.reveal-right.revealed { opacity: 1; transform: translateX(0); }

/* ── Card hover ── */
.card-hover {
  transition:
    transform    0.25s cubic-bezier(0.4,0,0.2,1),
    box-shadow   0.25s cubic-bezier(0.4,0,0.2,1),
    border-color 0.25s cubic-bezier(0.4,0,0.2,1);
}
.card-hover:hover {
  transform:    translateY(-5px) scale(1.01);
  box-shadow:   0 16px 40px rgba(111,149,214,0.20), 0 0 0 1px rgba(111,149,214,0.35);
  border-color: rgba(111,149,214,0.45) !important;
}

/* ── Glow helpers ── */
.blue-glow { box-shadow: 0 0 20px rgba(111,149,214,0.25); }
.cyan-glow { box-shadow: 0 0 20px rgba(169,195,238,0.25); }
.gold-glow { box-shadow: 0 0 20px rgba(125,134,138,0.20); }
