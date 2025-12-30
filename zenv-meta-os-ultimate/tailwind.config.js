/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        'touch': {'raw': '(hover: none)'},
        'desktop': {'min': '1024px'}
      },
      colors: {
        ios: {
          bg: '#000000',
          dock: 'rgba(25, 25, 25, 0.7)',
          folder: 'rgba(255, 255, 255, 0.2)'
        },
        win: {
          taskbar: 'rgba(0, 0, 0, 0.85)',
          window: '#1e1e1e'
        }
      },
      animation: {
        'pop': 'pop 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out'
      },
      keyframes: {
        pop: { '0%': { transform: 'scale(0.9)' }, '100%': { transform: 'scale(1)' } },
        slideUp: { '0%': { transform: 'translateY(100%)' }, '100%': { transform: 'translateY(0)' } }
      }
    },
  },
  plugins: [],
}