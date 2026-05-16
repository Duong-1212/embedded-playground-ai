/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        pastel: {
          primary: '#A8E6CF',
          secondary: '#FFD3B6',
          accent: '#FFAAA5',
          background: '#F0F8F0',
          card: '#FFFFFF',
          sciFi: '#1E3A8A',
          glow: '#667eea',
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-gentle': 'bounce-gentle 2s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translate3d(0,0,0)' },
          '50%': { transform: 'translate3d(0,-10px,0)' }
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' }
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(102, 126, 234, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(102, 126, 234, 0.6)' }
        }
      },
      boxShadow: {
        'glow': '0 0 20px rgba(168, 230, 207, 0.4)',
        'glow-lg': '0 0 30px rgba(168, 230, 207, 0.6)',
        'sci-fi': '0 0 40px rgba(30, 58, 138, 0.3)'
      }
    },
  },
  plugins: [],
}