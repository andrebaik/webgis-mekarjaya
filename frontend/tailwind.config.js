/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Lexend', 'sans-serif'],
        body: ['Source Sans 3', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#059669',
          light: '#10b981',
          dark: '#047857',
        },
        secondary: {
          DEFAULT: '#D97706',
          light: '#F59E0B',
        },
        accent: {
          DEFAULT: '#2563EB',
          light: '#60A5FA',
        },
        surface: {
          DEFAULT: '#FAFAF9',
          card: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#F5F5F4',
          foreground: '#78716C',
        },
        border: '#E7E5E4',
      },
    },
  },
  plugins: [],
}
