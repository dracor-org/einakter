const { NONAME } = require('dns')

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
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#333',
            strong: {
              fontWeight: '500',
            },
            h1: {
              fontWeight: '500',
            },
            h2: {
              fontWeight: '500',
            },
            h3: {
              fontWeight: '500',
            },
            a: {
              color: '#08f',
                '&:hover': {
                color: '#0056b3',
              },
              fontWeight: '400',
              textDecoration: false,
            },
          },
        },
      },  
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography')({
      className: 'markdown',
    }),
  ],
}
