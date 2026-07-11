/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  theme: {
    extend: {

      colors: {
        bc: {
          bg:          '#0E1717',
          surface:     '#122020',
          card:        '#162626',
          border:      '#1E2E2D',
          gold:        '#FFBF00',
          'gold-dark': '#cc9900',
          'gold-light':'#ffda60',
          blue:        '#2563eb',
          'blue-light':'#60a5fa',
          cyan:        '#22d3ee',
          wa:          '#22c55e',
          'wa-dark':   '#16a34a',
          amber:       '#f59e0b',
          red:         '#ef4444',
          purple:      '#a855f7',
          text:        '#D1D5DB',
          'text-dark': '#111827',
          muted:       '#6b7280',
        },
      },

      fontFamily: {
        outfit:  ['Outfit', 'sans-serif'],
        bengali: ['"Hind Siliguri"', 'sans-serif'],
      },

      backgroundImage: {
        'circuit':
          'linear-gradient(to right, #1E2E2D 1px, transparent 1px),' +
          'linear-gradient(to bottom, #1E2E2D 1px, transparent 1px),' +
          'radial-gradient(circle, #FFBF00 1.2px, transparent 1.2px)',

        'gold-gradient':
          'linear-gradient(135deg, #FFBF00 0%, #ffda60 100%)',

        'card-gradient':
          'linear-gradient(145deg, #1a2a2a 0%, #162626 100%)',
      },

      backgroundSize: {
        'circuit': '48px 48px, 48px 48px, 48px 48px',
      },

      boxShadow: {
        'card':        '0 2px 12px rgba(0,0,0,0.40)',
        'card-hover':  '0 16px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,191,0,0.28)',
        'gold-soft':   '0 6px 24px rgba(255,191,0,0.30)',
        'gold-glow':   '0 0 20px rgba(255,191,0,0.25)',
        'wa-soft':     '0 6px 20px rgba(34,197,94,0.30)',
        'input-focus': '0 0 0 3px rgba(255,191,0,0.25)',
      },

      transitionTimingFunction: {
        'bc': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      animation: {
        'fade-up':    'fadeUp 0.60s cubic-bezier(0.4,0,0.2,1) forwards',
        'fade-up-d1': 'fadeUp 0.60s 0.12s cubic-bezier(0.4,0,0.2,1) forwards',
        'fade-up-d2': 'fadeUp 0.60s 0.24s cubic-bezier(0.4,0,0.2,1) forwards',
        'fade-up-d3': 'fadeUp 0.60s 0.36s cubic-bezier(0.4,0,0.2,1) forwards',
        'wa-pulse':   'waPulse 2.4s cubic-bezier(0.4,0,0.6,1) infinite',
        'cta-float':  'ctaFloat 5s ease-in-out infinite',
        'shimmer':    'shimmer 1.6s linear infinite',
      },

      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        waPulse: {
          '0%, 100%': { boxShadow: '0 0 0 0   rgba(34,197,94,0.55)' },
          '50%':      { boxShadow: '0 0 0 14px rgba(34,197,94,0)' },
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

      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },

      zIndex: {
        '60':  '60',
        '70':  '70',
        '100': '100',
      },

    },
  },

  plugins: [],
}
