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
          bg:      '#f6f6f6',
          surface: '#e6effd',
          card:    '#f6f6f6',
          border:  '#A2AAAD',
          blue:    '#A2AAAD',
          'blue-light': '#e6effd',
          cyan:    '#A2AAAD',
          wa:      '#A2AAAD',
          amber:   '#f6f6f6',
          red:     '#A2AAAD',
          purple:  '#e6effd',
        }
      },
      fontFamily: {
        outfit:  ['Outfit', 'sans-serif'],
        bengali: ['"Hind Siliguri"', 'sans-serif'],
      },
      backgroundImage: {
        'grid-pattern': `
          linear-gradient(rgba(162, 170, 173, 0.2) 1px, transparent 1px),
          linear-gradient(90deg, rgba(162, 170, 173, 0.2) 1px, transparent 1px)
        `,
        'hero-glow': `
          radial-gradient(ellipse at 20% 50%, rgba(230, 239, 253, 0.8) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 20%, rgba(162, 170, 173, 0.3) 0%, transparent 50%)
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
          '0%':   { boxShadow: '0 0 0 0 rgba(162, 170, 173, 0.5)' },
          '70%':  { boxShadow: '0 0 0 14px rgba(162, 170, 173, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(162, 170, 173, 0)' },
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
          from: { boxShadow: '0 0 20px rgba(230, 239, 253, 0.6)' },
          to:   { boxShadow: '0 0 40px rgba(162, 170, 173, 0.4)' },
        },
      },
      boxShadow: {
        'blue-glow':  '0 0 24px rgba(230, 239, 253, 0.8)',
        'cyan-glow':  '0 0 24px rgba(162, 170, 173, 0.4)',
        'card-hover': '0 12px 40px rgba(230, 239, 253, 0.6)',
      },
    },
  },
  plugins: [],
}
