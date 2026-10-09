/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        marino: '#1A3256',
        principal: '#2C4A7C',
        acero: '#7A94B5',
        dresscode: '#6B88B5',
        crema: '#F5F0E8',
        boutton: '#5B7BA6',
      },
      fontFamily: {
        script: ['"Dancing Script"', 'cursive'],
        serif: ['"Cormorant Garamond"', 'serif'],
        playfair: ['"Playfair Display"', 'serif'],
      },
    },
  },
  plugins: [],
};
