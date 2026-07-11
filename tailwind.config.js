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
          bg:      '#090e1a',
          surface: '#0f1729',
          card:    '#111d35',
          border:  '#1a2744',
          blue:    '#3b82f6',
          'blue-light': '#60a5fa',
          cyan:    '#22d3ee',
          wa:      '#22c55e',
          amber:   '#f59e0b',
          red:     '#ef4444',
          purple:  '#a855f7',
        }
      },
      fontFamily: {
        outfit:  ['Outfit', 'sans-serif'],
        bengali: ['"Hind Siliguri"', 'sans-serif'],
      },
      backgroundImage: {
        'grid-pattern': `
          linear-gradient(rgba(26,39,68,0.4) 1px, transparent 1px),
          linear-gradient(90deg, rgba(26,39,68,0.4) 1px, transparent 1px)
        `,
        'hero-glow': `
          radial-gradient(ellipse at 20% 50%, rgba(59,130,246,0.12) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 20%, rgba(34,211,238,0.10) 0%, transparent 50%)
        `,
      },
      backgroundSize: {
        'grid-40': '40px 40px',
      },
      animation: {
        'float':      'float 4s ease-in-out infinite',
        'wa-pulse':   'waPulse 2s ease-in-out infinite',
        'fade-up':    'fadeUp 0.6s ease forwards',
        'shimmer':    'shimmer 2s linear infinite',
        'glow':       'glow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-8px)' },
        },
        waPulse: {
          '0%':   { boxShadow: '0 0 0 0 rgba(34,197,94,0.6)' },
          '70%':  { boxShadow: '0 0 0 14px rgba(34,197,94,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(34,197,94,0)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glow: {
          from: { boxShadow: '0 0 20px rgba(59,130,246,0.3)' },
          to:   { boxShadow: '0 0 40px rgba(34,211,238,0.5)' },
        },
      },
      boxShadow: {
        'blue-glow':  '0 0 24px rgba(59,130,246,0.25)',
        'cyan-glow':  '0 0 24px rgba(34,211,238,0.25)',
        'card-hover': '0 12px 40px rgba(59,130,246,0.15)',
      },
    },
  },
  plugins: [],
}
