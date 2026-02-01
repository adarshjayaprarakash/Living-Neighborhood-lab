/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#f0fdf4', // Light pastel green background
        surface: 'rgba(255, 255, 255, 0.7)', // Glassy white
        primary: '#4ade80',    // Green 400
        secondary: '#60a5fa',  // Blue 400
        accent: '#fbbf24',     // Amber 400
        text: '#1e293b',       // Slate 800 (Dark text for light theme)
        muted: '#64748b',      // Slate 500
        danger: '#f87171',     // Red 400
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
