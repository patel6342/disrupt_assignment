import { transform } from 'lodash';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        appear: {
          '0%': {transform: 'translate(500px)'},
          '100%': {transform: 'translate(0px)'}
          // '0%': {transform: 'opacity(0%)'},
          // '100%': {transform: 'opacity(100%)'}
        }
      },
      animation: {
        appear: 'appear 3s  infinite'
      }
    },
  },
  plugins: [],
}

