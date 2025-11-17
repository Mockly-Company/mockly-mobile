/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#007AFF',
        secondary: '#5856D6',
        success: '#34C759',
        warning: '#FF9500',
        error: '#FF3B30',
        background: '#FFFFFF',
        surface: '#F2F2F7',
        text: '#000000',
        'text-secondary': '#8E8E93',
        border: '#C6C6C8',
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        xxl: '48px',
      },
      fontSize: {
        xs: '12px',
        sm: '14px',
        md: '16px',
        lg: '18px',
        xl: '24px',
        xxl: '32px',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        full: '9999px',
      },
    },
  },
  plugins: [],
};

module.exports = config;
