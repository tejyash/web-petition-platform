module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          chinese: ['Figtree', 'sans-serif'],
        },
      },
    },
    plugins: {
        tailwindcss: {},
        autoprefixer: {},
    }
  };