/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        therapy: {
          primary: '#4F46E5',
          secondary: '#10B981',
          accent: '#F59E0B',
          light: '#F3F4F6',
          dark: '#1F2937',
        }
      }
    },
  },
  plugins: [],
}

