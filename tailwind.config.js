/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  theme: {
    extend: {

      /* ─────────────────────────────────────────
         COLOR SYSTEM
      ───────────────────────────────────────── */
      colors: {
        bc: {
          bg:         '#0a0f1d',
          surface:    '#111827',
          card:       '#162032',
          border:     '#1e293b',
          blue:       '#2563eb',
          'blue-light': '#60a5fa',
          'blue-dark':  '#1d4ed8',
          cyan:       '#38bdf8',
          wa:         '#22c55e',
          'wa-dark':  '#16a34a',
          amber:      '#f59e0b',
          red:        '#ef4444',
          purple:     '#a855f7',
          text:       '#f8fafc',
          muted:      '#94a3b8',
          subtle:     '#475569',
        },
      },

      /* ─────────────────────────────────────────
         TYPOGRAPHY
      ───────────────────────────────────────── */
      fontFamily: {
        outfit:  ['Outfit', 'sans-serif'],
        bengali: ['"Hind Siliguri"', 'sans-serif'],
      },

      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem' }],
      },

      /* ─────────────────────────────────────────
         BACKGROUND IMAGES
         (clean, premium — no grid matrix)
      ───────────────────────────────────────── */
      backgroundImage: {
        'hero-ambient':
          'radial-gradient(ellipse 80% 60% at 15% 50%, rgba(37,99,235,0.10) 0%, transparent 60%),' +
          'radial-gradient(ellipse 60% 70% at 85% 20%, rgba(56,189,248,0.07) 0%, transparent 55%)',

        'surface-gradient':
          'linear-gradient(180deg, #111827 0%, #0a0f1d 100%)',

        'card-gradient':
          'linear-gradient(145deg, #1a2840 0%, #162032 100%)',

        'blue-gradient':
          'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',

        'metallic-text':
          'linear-gradient(135deg, #f8fafc 0%, #94a3b8 100%)',
      },

      /* ─────────────────────────────────────────
         BOX SHADOWS  (depth, not neon)
      ───────────────────────────────────────── */
      boxShadow: {
        'card':       '0 2px 12px rgba(0,0,0,0.35)',
        'card-hover': '0 16px 40px rgba(0,0,0,0.50), 0 0 0 1px rgba(37,99,235,0.28)',
        'blue-soft':  '0 6px 24px rgba(37,99,235,0.30)',
        'wa-soft':    '0 6px 20px rgba(34,197,94,0.30)',
        'inset-top':  'inset 0 1px 0 rgba(255,255,255,0.05)',
        'navbar':     '0 1px 0 rgba(30,41,59,0.8), 0 4px 16px rgba(0,0,0,0.25)',
        'modal':      '0 24px 64px rgba(0,0,0,0.70)',
        'input-focus':'0 0 0 3px rgba(37,99,235,0.25)',
      },

      /* ─────────────────────────────────────────
         BORDER RADIUS
      ───────────────────────────────────────── */
      borderRadius: {
        'xs':  '4px',
        '2xl': '16px',
        '3xl': '20px',
      },

      /* ─────────────────────────────────────────
         TRANSITIONS  (fast, physical, purposeful)
      ───────────────────────────────────────── */
      transitionTimingFunction: {
        'bc': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bc-in': 'cubic-bezier(0.4, 0, 1, 1)',
        'bc-out': 'cubic-bezier(0, 0, 0.2, 1)',
      },

      transitionDuration: {
        '175': '175ms',
        '250': '250ms',
      },

      /* ─────────────────────────────────────────
         ANIMATIONS
      ───────────────────────────────────────── */
      animation: {
        /* page entry */
        'fade-up':     'fadeUp 0.60s cubic-bezier(0.4,0,0.2,1) forwards',
        'fade-up-d1':  'fadeUp 0.60s 0.12s cubic-bezier(0.4,0,0.2,1) forwards',
        'fade-up-d2':  'fadeUp 0.60s 0.24s cubic-bezier(0.4,0,0.2,1) forwards',
        'fade-up-d3':  'fadeUp 0.60s 0.36s cubic-bezier(0.4,0,0.2,1) forwards',

        /* infinite — hero */
        'hero-pulse':  'heroPulse 8s ease-in-out infinite alternate',
        'orb-drift':   'orbDrift 12s ease-in-out infinite alternate',

        /* infinite — UI accents */
        'wa-pulse':    'waPulse 2.4s cubic-bezier(0.4,0,0.6,1) infinite',
        'nav-border':  'navBorderPulse 4s ease-in-out infinite alternate',
        'cta-float':   'ctaFloat 5s ease-in-out infinite',
        'shimmer':     'shimmer 1.6s linear infinite',

        /* scroll reveal (driven by JS, not pure CSS) */
        'reveal':      'fadeUp 0.55s cubic-bezier(0.4,0,0.2,1) forwards',
      },

      keyframes: {
        /* ── Entry ── */
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },

        /* ── Hero background ambient pulse ── */
        heroPulse: {
          '0%':   { opacity: '0.80' },
          '50%':  { opacity: '1.00' },
          '100%': { opacity: '0.70' },
        },

        /* ── Floating orb drift ── */
        orbDrift: {
          '0%':   { transform: 'translate(0px, 0px) scale(1)' },
          '33%':  { transform: 'translate(24px, -18px) scale(1.06)' },
          '66%':  { transform: 'translate(-16px, 14px) scale(0.96)' },
          '100%': { transform: 'translate(10px, -8px) scale(1.03)' },
        },

        /* ── WhatsApp ring ── */
        waPulse: {
          '0%, 100%': { boxShadow: '0 0 0 0   rgba(34,197,94,0.55)' },
          '50%':      { boxShadow: '0 0 0 14px rgba(34,197,94,0)' },
        },

        /* ── Navbar border breathe ── */
        navBorderPulse: {
          '0%':   { borderBottomColor: 'rgba(37,99,235,0.12)' },
          '100%': { borderBottomColor: 'rgba(37,99,235,0.32)' },
        },

        /* ── Floating CTA ── */
        ctaFloat: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-6px)' },
        },

        /* ── Skeleton shimmer ── */
        shimmer: {
          '0%':   { backgroundPosition:  '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },

      /* ─────────────────────────────────────────
         SPACING EXTRAS
      ───────────────────────────────────────── */
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },

      /* ─────────────────────────────────────────
         Z-INDEX SCALE
      ───────────────────────────────────────── */
      zIndex: {
        '60':  '60',
        '70':  '70',
        '80':  '80',
        '90':  '90',
        '100': '100',
      },

    },
  },

  plugins: [],
}
