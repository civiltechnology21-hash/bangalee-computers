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
         COLOR SYSTEM  — Warm Amber / Dark Tech
      ───────────────────────────────────────── */
      colors: {
        bc: {
          bg:           '#0d0a05',
          surface:      '#161008',
          card:         '#1e1508',
          border:       '#2d2010',
          blue:         '#d97706',
          'blue-light': '#fbbf24',
          'blue-dark':  '#b45309',
          cyan:         '#f59e0b',
          wa:           '#22c55e',
          'wa-dark':    '#16a34a',
          amber:        '#d97706',
          red:          '#ef4444',
          purple:       '#a855f7',
          text:         '#fef9f0',
          muted:        '#a8956d',
          subtle:       '#6b5a3a',
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
      ───────────────────────────────────────── */
      backgroundImage: {
        'hero-ambient':
          'radial-gradient(ellipse 80% 60% at 15% 50%, rgba(217,119,6,0.12) 0%, transparent 60%),' +
          'radial-gradient(ellipse 60% 70% at 85% 20%, rgba(245,158,11,0.08) 0%, transparent 55%)',

        'surface-gradient':
          'linear-gradient(180deg, #161008 0%, #0d0a05 100%)',

        'card-gradient':
          'linear-gradient(145deg, #251a08 0%, #1e1508 100%)',

        'blue-gradient':
          'linear-gradient(135deg, #d97706 0%, #b45309 100%)',

        'metallic-text':
          'linear-gradient(135deg, #fef9f0 0%, #a8956d 100%)',
      },

      /* ─────────────────────────────────────────
         BOX SHADOWS
      ───────────────────────────────────────── */
      boxShadow: {
        'card':       '0 2px 12px rgba(0,0,0,0.50)',
        'card-hover': '0 16px 40px rgba(0,0,0,0.60), 0 0 0 1px rgba(217,119,6,0.30)',
        'blue-soft':  '0 6px 24px rgba(217,119,6,0.35)',
        'wa-soft':    '0 6px 20px rgba(34,197,94,0.30)',
        'inset-top':  'inset 0 1px 0 rgba(255,255,255,0.04)',
        'navbar':     '0 1px 0 rgba(45,32,16,0.9), 0 4px 16px rgba(0,0,0,0.40)',
        'modal':      '0 24px 64px rgba(0,0,0,0.80)',
        'input-focus':'0 0 0 3px rgba(217,119,6,0.28)',
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
         TRANSITIONS
      ───────────────────────────────────────── */
      transitionTimingFunction: {
        'bc':     'cubic-bezier(0.4, 0, 0.2, 1)',
        'bc-in':  'cubic-bezier(0.4, 0, 1, 1)',
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
        'fade-up':    'fadeUp 0.60s cubic-bezier(0.4,0,0.2,1) forwards',
        'fade-up-d1': 'fadeUp 0.60s 0.12s cubic-bezier(0.4,0,0.2,1) forwards',
        'fade-up-d2': 'fadeUp 0.60s 0.24s cubic-bezier(0.4,0,0.2,1) forwards',
        'fade-up-d3': 'fadeUp 0.60s 0.36s cubic-bezier(0.4,0,0.2,1) forwards',

        'hero-pulse': 'heroPulse 8s ease-in-out infinite alternate',
        'orb-drift':  'orbDrift 12s ease-in-out infinite alternate',
        'wa-pulse':   'waPulse 2.4s cubic-bezier(0.4,0,0.6,1) infinite',
        'nav-border': 'navBorderPulse 4s ease-in-out infinite alternate',
        'cta-float':  'ctaFloat 5s ease-in-out infinite',
        'shimmer':    'shimmer 1.6s linear infinite',
        'reveal':     'fadeUp 0.55s cubic-bezier(0.4,0,0.2,1) forwards',
      },

      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        heroPulse: {
          '0%':   { opacity: '0.80' },
          '50%':  { opacity: '1.00' },
          '100%': { opacity: '0.70' },
        },
        orbDrift: {
          '0%':   { transform: 'translate(0px, 0px) scale(1)' },
          '33%':  { transform: 'translate(24px, -18px) scale(1.06)' },
          '66%':  { transform: 'translate(-16px, 14px) scale(0.96)' },
          '100%': { transform: 'translate(10px, -8px) scale(1.03)' },
        },
        waPulse: {
          '0%, 100%': { boxShadow: '0 0 0 0   rgba(34,197,94,0.55)' },
          '50%':      { boxShadow: '0 0 0 14px rgba(34,197,94,0)' },
        },
        navBorderPulse: {
          '0%':   { borderBottomColor: 'rgba(217,119,6,0.12)' },
          '100%': { borderBottomColor: 'rgba(217,119,6,0.32)' },
        },
        ctaFloat: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition:  '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },

      /* ─────────────────────────────────────────
         SPACING & Z-INDEX
      ───────────────────────────────────────── */
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },

      zIndex: {
        '60': '60', '70': '70', '80': '80', '90': '90', '100': '100',
      },

    },
  },

  plugins: [],
}
