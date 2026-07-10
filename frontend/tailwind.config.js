/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        safety: {
          pink: '#FF6B6B', // Premium Coral instead of common AI pink
          purple: '#16A34A', // Premium Emerald Green instead of purple
          dark: '#071A2F', // Premium Deep Navy background
          slate: '#0B2440', // Light Navy Card Base
          card: '#102F54', // Inner Navy Card
          light: '#FFFFFF',
          glow: 'rgba(255, 107, 107, 0.15)',
          gold: '#F4C542', // Soft Gold
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-pink': '0 0 15px rgba(255, 107, 107, 0.4)',
        'glow-purple': '0 0 15px rgba(22, 163, 74, 0.4)',
        'glow-gold': '0 0 15px rgba(244, 197, 66, 0.4)',
      }
    },
  },
  plugins: [],
}
