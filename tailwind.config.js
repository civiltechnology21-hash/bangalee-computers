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
          // ── Base surfaces (light theme) ──
          bg:          '#F8FAFC',   // page background (slate-50)
          surface:     '#FFFFFF',   // navbar, card, modal
          'surface-alt':'#F1F5F9',  // footer, alternating sections (slate-100)
          card:        '#FFFFFF',   // kept for backward-compat with existing classes
          border:      '#E2E8F0',   // card/section borders (slate-200)

          // ── Blue accent family (primary) ──
          blue:        '#2563EB',   // primary actions, links, price highlight
          'blue-dark': '#1D4ED8',   // hero gradient end, hover state
          'blue-light':'#60A5FA',   // secondary highlight
          'blue-tint': '#DBEAFE',   // badge bg, soft hover bg

          // ── Legacy "gold" tokens kept but remapped to blue so old classes don't break ──
          gold:        '#2563EB',
          'gold-dark': '#1D4ED8',
          'gold-light':'#60A5FA',

          cyan:        '#0EA5E9',   // kept for compatibility, sky-blue tone

          // ── WhatsApp green — untouched, isolated to CTA/badge use only ──
          wa:          '#22C55E',
          'wa-dark':   '#16A34A',

          // ── Status colors — kept as-is ──
          amber:       '#f59e0b',
          red:         '#ef4444',
          purple:      '#a855f7',

          // ── Text ──
          text:        '#475569',   // body copy (slate-600)
          'text-dark': '#0F172A',   // headings (slate-900)
          muted:       '#64748B',   // secondary/premium gray (slate-500)
        },
      },

      fontFamily: {
        outfit:  ['Outfit', 'sans-serif'],
        bengali: ['"Hind Siliguri"', 'sans-serif'],
      },

      backgroundImage: {
        // subtle dot-grid instead of the old dark "circuit" look
        'circuit':
          'linear-gradient(to right, #E2E8F0 1px, transparent 1px),' +
          'linear-gradient(to bottom, #E2E8F0 1px, transparent 1px),' +
          'radial-gradient(circle, #2563EB 1px, transparent 1px)',

        'gold-gradient':
          'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',

        'hero-gradient':
          'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',

        'card-gradient':
          'linear-gradient(145deg, #FFFFFF 0%, #F8FAFC 100%)',
      },

      backgroundSize: {
        'circuit': '48px 48px, 48px 48px, 48px 48px',
      },

      boxShadow: {
        'card':        '0 1px 3px rgba(15,23,42,0.08), 0 1px 2px rgba(15,23,42,0.04)',
        'card-hover':  '0 12px 28px rgba(15,23,42,0.12), 0 0 0 1px rgba(37,99,235,0.20)',
        'gold-soft':   '0 6px 20px rgba(37,99,235,0.18)',
        'gold-glow':   '0 0 16px rgba(37,99,235,0.15)',
        'wa-soft':     '0 6px 20px rgba(34,197,94,0.28)',
        'input-focus': '0 0 0 3px rgba(37,99,235,0.18)',
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
