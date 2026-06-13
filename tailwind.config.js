/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        'neon-cyan': '#00fff5',
        'neon-purple': '#9d4edd',
        'neon-gold': '#ffd700',
        'cyber-dark': '#1a1a2e',
        'cyber-darker': '#0f0f1a',
        'cyber-card': 'rgba(30, 30, 50, 0.8)',
      },
      fontFamily: {
        'cyber': ['Orbitron', 'sans-serif'],
        'body': ['Noto Sans SC', 'sans-serif'],
      },
      boxShadow: {
        'neon': '0 0 20px rgba(0, 255, 245, 0.3)',
        'neon-purple': '0 0 20px rgba(157, 78, 221, 0.3)',
        'neon-gold': '0 0 20px rgba(255, 215, 0, 0.3)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 255, 245, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 255, 245, 0.6)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
