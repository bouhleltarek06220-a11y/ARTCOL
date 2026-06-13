/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        stone: '#361e15',       // couleur principale sombre (charte)
        parchment: '#f4e2c7',   // parchemin (charte)
        torch: '#ff9d4d',       // lumière torche orange
        twitch: '#9146ff',      // lumière violette Twitch / numérique
        gold: '#c99b5c',
        goldbright: '#e5c788',
      },
      fontFamily: {
        medieval: ['"Cinzel Decorative"', '"Cinzel"', 'serif'],   // placeholder médiéval (sera remplacé par Kingthings Exeter)
        display: ['"League Spartan"', 'system-ui', 'sans-serif'],
        ui: ['"Montserrat"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
