const designSystemConfig = require('../../packages/design-system/tailwind.config.js');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.tsx',
    './components/**/*.{js,jsx,ts,tsx}',
    './.storybook/**/*.{js,jsx,ts,tsx}',
    './.rnstorybook/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {...designSystemConfig.theme.extend},
  },
  // important: 'html',
  plugins: [],
};
