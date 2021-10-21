module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: '#1f2448',
        secondary: {
          100: '#aef',
          200: '#08f',
        }
      },
      fontFamily: {
        body: ['Rubik']
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
