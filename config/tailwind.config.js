/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Nunito Sans', 'system-ui', '-apple-system', 'sans-serif'],
        'bold': ['Nunito Sans', 'system-ui', '-apple-system', 'sans-serif'],
        'heavy': ['Nunito Sans', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontWeight: {
        'heavy': '900',
        'extra-bold': '800',
      },
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        // Neumorphism colors for light theme
        neu: {
          light: '#e6e7ee',
          dark: '#d1d9e6',
          base: '#f0f0f3',
        },
        // Neumorphism colors for dark theme
        'neu-dark': {
          light: '#3a3d47',
          dark: '#2c2f36',
          base: '#32353c',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'neu-press': 'neuPress 0.1s ease-in-out',
      },
      keyframes: {
        neuPress: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.98)' },
          '100%': { transform: 'scale(1)' },
        }
      },
      boxShadow: {
        // Enhanced Light theme neumorphism shadows
        'neu-flat': '12px 12px 24px #d1d9e6, -12px -12px 24px #ffffff',
        'neu-pressed': 'inset 8px 8px 16px #d1d9e6, inset -8px -8px 16px #ffffff',
        'neu-hover': '16px 16px 32px #d1d9e6, -16px -16px 32px #ffffff',
        'neu-glow': '0 0 20px rgba(0,0,0,0.1), 12px 12px 24px #d1d9e6, -12px -12px 24px #ffffff',
        
        // Enhanced Dark theme neumorphism shadows  
        'neu-dark-flat': '12px 12px 24px #2c2f36, -12px -12px 24px #3a3d47',
        'neu-dark-pressed': 'inset 8px 8px 16px #2c2f36, inset -8px -8px 16px #3a3d47',
        'neu-dark-hover': '16px 16px 32px #2c2f36, -16px -16px 32px #3a3d47',
        'neu-dark-glow': '0 0 20px rgba(0,0,0,0.3), 12px 12px 24px #2c2f36, -12px -12px 24px #3a3d47',
        
        // Icon pressed-in effect
        'icon-pressed': 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -2px -2px 4px rgba(255,255,255,0.8)',
        'icon-dark-pressed': 'inset 4px 4px 8px rgba(0,0,0,0.3), inset -2px -2px 4px rgba(255,255,255,0.1)',
      }
    },
  },
  plugins: [],
}