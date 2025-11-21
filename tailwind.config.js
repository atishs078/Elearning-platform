/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Look for files in src/pages and all its subdirectories
    './src/pages/**/*.{js,ts,jsx,tsx}', 
    
    // Look for files in src/components and all its subdirectories
    './src/components/**/*.{js,ts,jsx,tsx}',
    
    // You might also need to include your main application file (e.g., in a Next.js or create-react-app setup)
    './src/**/*.{js,ts,jsx,tsx}', 
  ],
 theme: {
  extend: {
    fontFamily: {
      sans: ["Inter", "sans-serif"],
    },
  }, 
},
  plugins: [],
}