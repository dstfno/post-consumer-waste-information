/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        recovinyl: {
          blue: '#006eb6',
          dark: '#004b7c',
          light: '#e6f3fb',
          green: '#84bd3a',
          greenDark: '#639324',
          greenLight: '#f2f9e9',
        },
        pvc: {
          rigid: '#006eb6',
          flexible: '#84bd3a',
          both: '#004b7c',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
