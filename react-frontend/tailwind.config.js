/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4a90e2', // A slightly brighter blue for better contrast
        primaryDark: '#357abd',
        lightGray: '#f5f7fa',
        darkText: '#e0e6f0', // Light text for dark backgrounds
        borderColor: '#4a5568', // Darker border color
        danger: '#e53935',
        'dark-slate-grey': '#2F4F4F',
        'dark-bg': '#2F4F4F', // Main dark background
        'dark-card': '#3a5a5a', // Card and modal backgrounds
        'dark-hover': '#4a6a6a', // Hover effect color
      },
      fontFamily: {
        sans: ['"Open Sans"', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}