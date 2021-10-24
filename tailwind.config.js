module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: '#1f2448',
        secondary: {
          100: '#aef',
          200: '#08f',
        },
        neutral: {
          100: '#ebf0f7',
          200: '#1f244809',
        }
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
