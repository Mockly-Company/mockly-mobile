import designSystemConfig from '../../packages/design-system/tailwind.config.js';
import nativewindPreset from 'nativewind/preset';
/** @type {import('tailwindcss').Config} */
const confing = {
  ...designSystemConfig,
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    '../../packages/design-system/src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [nativewindPreset],
};

export default confing;
