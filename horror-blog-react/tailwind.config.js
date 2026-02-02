/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#08090b',
          surface: '#0e1013',
          raised: '#141820',
          hover: '#1a1f2b',
        },
        text: {
          primary: '#c9b99a',
          secondary: '#7a7060',
          muted: '#4a4540',
        },
        accent: {
          blood: '#9b2424',
          'blood-dim': 'rgba(155,36,36,0.15)',
          gold: '#c9a84c',
          'gold-dim': 'rgba(201,168,76,0.12)',
          mist: '#3a4a5c',
        },
        border: 'rgba(201,168,76,0.1)',
      },
      fontFamily: {
        display: ['"Cinzel Decorative"', 'serif'],
        heading: ['Cinzel', 'serif'],
        body: ['"Cormorant Garamond"', 'serif'],
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        fadeDown: {
          'from': { opacity: '0', transform: 'translateY(-14px)' },
          'to': { opacity: '1', transform: 'translateY(0)' }
        },
        mistPulse: {
          'from': { opacity: '0.4' },
          'to': { opacity: '1' }
        },
        arrowPulse: {
          '0%, 100%': { opacity: '0.3', transform: 'scaleY(0.6)' },
          '50%': { opacity: '1', transform: 'scaleY(1)' }
        },
        pageIn: {
          'from': { opacity: '0', transform: 'translateY(8px)' },
          'to': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        fadeDown: 'fadeDown 1s ease both',
        mistPulse: 'mistPulse 9s ease-in-out infinite alternate',
        arrowPulse: 'arrowPulse 2s ease-in-out infinite',
        pageIn: 'pageIn 0.5s ease both',
      }
    },
  },
  plugins: [],
}
