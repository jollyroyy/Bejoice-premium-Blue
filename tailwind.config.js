/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#c8a84e',
          light: '#e2c97a',
          dark: '#9a7a2e',
        },
        obsidian: {
          DEFAULT: '#050508',
          '50': '#0d0d14',
          '100': '#0a0a10',
          '200': '#07070d',
        },
        cream: '#f0e6d0',
      },
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        heading: ['Cormorant Garamond', 'serif'],
        body: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
