/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        'movie-red': '#e50914',
        'movie-dark': '#141414',
        'movie-gray': '#1f1f1f',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
  // Allow custom CSS to coexist
  corePlugins: {
    preflight: false, // disabled to not break existing CSS
  },
};
