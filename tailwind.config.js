/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./*.html",
        "./**/*.html",
        "./js/**/*.js",
      ],
  theme: {
    extend: {
      colors: {
        primary: '#1e3a8a',
        secondary: '#db2777',
        accent: '#f59e0b',
        dark: '#1e3a8a',
        light: '#f3f4f6',
        maroon: '#db2777',
        maroonDark: '#9d174d',
        navy: '#1e3a8a',
        navyLight: '#3730a3',
        gradientStart: '#1e3a8a',
        gradientEnd: '#db2777',
      },
      backgroundImage: {
        'gradient-royal': 'linear-gradient(135deg, #1e3a8a 0%, #db2777 100%)',
        'gradient-royal-light': 'linear-gradient(135deg, #3730a3 0%, #f0468f 100%)',
      },
      animation: {
        'spin': 'spin 1s linear infinite',
      },
    },
  },
  plugins: [],
}
