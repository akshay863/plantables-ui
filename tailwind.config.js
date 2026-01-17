/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2F7D32',
          dark: '#1B5E20',
          light: '#4E9F3D',
        },
        earth: {
          DEFAULT: '#8D6E63',
          light: '#D7CCC8',
        },
        paper: '#F9F7F2',
        urgent: '#D32F2F',
        completed: '#1976D2',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
