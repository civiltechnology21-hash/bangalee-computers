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
          bg:          '#f4f6f9',
          surface:     '#eef2f8',
          card:        '#ffffff',
          border:      '#c7ccce',
          metal:       '#A2AAAD',
          tint:        '#e6effd',

          gold:        '#6f95d6',
          'gold-dark': '#4a6fae',
          'gold-light':'#c7d9f4',

          blue:        '#6f95d6',
          'blue-light':'#a9c3ee',
          cyan:        '#a9c3ee',

          wa:          '#6f95d6',
          'wa-dark':   '#4a6fae',

          amber:       '#7d868a',
          red:         '#5f6669',
          purple:      '#8b9295',

          text:        '#4b5457',
          'text-dark': '#1a1f1f',
          muted:       '#8b9295',
        },
      },

      fontFamily: {
        outfit:  ['Outfit', 'sans-serif'],
        bengali: ['"Hind Siliguri"', 'sans-serif'],
      },

      backgroundImage: {
        'circuit':
          'linear-gradient(to right, rgba(162,170,173,0.20) 1px, transparent 1px),' +
          'linear-gradient(to bottom, rgba(162,170,173,0.20) 1px, transparent 1px),' +
          'radial-gradient(circle, #c7d9f4 1.6px, transparent 1.6px)',

        'gold-gradient':
          'linear-gradient(135deg, #4a6fae 0%, #a9c3ee 100%)',

        'card-gradient':
          'linear-gradient(145deg, #ffffff 0%, #e6effd 100%)',
      },

      backgroundSize: {
        'circuit': '48px 48px, 48px 48px, 48px 48px',
      },

      boxShadow: {
        'card':        '0 2px 12px rgba(162,170,173,0.20)',
        'card-hover':  '0 16px 40px rgba(111,149,214,0.20), 0 0 0 1px rgba(111,149,214,0.30)',
        'gold-soft':   '0 6px 24px rgba(111,149,214,0.25)',
        'gold-glow':   '0 0 20px rgba(111,149,214,0.20)',
        'wa-soft':     '0 6px 20px rgba(111,149,214,0.25)',
        'input-focus': '0 0 0 3px rgba(111,149,214,0.25)',
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
          '0%, 100%': { boxShadow: '0 0 0 0   rgba(111,149,214,0.45)' },
          '50%':      { boxShadow: '0 0 0 14px rgba(111,149,214,0)' },
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
