/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          dark: '#0A192F',
          navy: '#0F2C59',
          blue: '#1E3E62',
          primary: '#0B4F8A',
          light: '#E8F1F5',
          saffron: '#FF6B00',
          'saffron-light': '#FFF3E0',
          green: '#138808',
          'green-light': '#E8F5E9',
          gold: '#D4AF37'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
