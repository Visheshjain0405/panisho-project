/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust this based on your project structure
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors for Panisho beauty brand
        pink: {
          50: '#FFF1F5',  // Very light pink for backgrounds
          100: '#FFE4EC', // Light pink for subtle accents
          600: '#F06292', // Main pink for text and buttons
          800: '#C2185B', // Darker pink for hover states
        },
        lavender: {
          100: '#F3E8FF', // Light lavender for backgrounds
          600: '#CE93D8', // Medium lavender for accents
        },
        neutral: {
          50: '#FAFAFA', // Off-white for clean backgrounds
          200: '#E5E5E5', // Light gray for borders
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Clean, modern font for a beauty brand
        Jost: ['Jost', 'sans-serif'],
      },
    },
  },
  plugins: [],
}