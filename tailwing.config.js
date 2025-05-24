/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: ['./src/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}'],
    theme: {
      extend: {
        fontFamily: {
          poppins: ['var(--font-poppins)', 'sans-serif'],
        },
      },
    },
    plugins: [],
  };
  