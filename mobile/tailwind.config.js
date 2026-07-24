module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        success: '#22c55e',
        error: '#ef4444',
        primary: '#6366f1',
        secondary: '#8b5cf6',
        muted: '#9ca3af',
      },
    },
  },
  plugins: [],
};