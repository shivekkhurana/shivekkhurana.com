/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"-apple-system"',
          '"BlinkMacSystemFont"',
          '"Inter"',
          'sans-serif',
        ],
        'mlm-roman': ['MLMRoman', 'serif'],
      },
    },
  },
  plugins: [],
};
