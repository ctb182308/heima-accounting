/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./src/renderer/**/*.{ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#007AFF',
          50: '#E6F2FF',
          100: '#CCE5FF',
          200: '#99CBFF',
          300: '#66B2FF',
          400: '#3398FF',
          500: '#007AFF',
          600: '#0062CC',
          700: '#004999',
          800: '#003166',
          900: '#001833'
        },
        success: '#34C759',
        warning: '#FF9500',
        danger: '#FF3B30',
        background: '#F5F5F7',
        card: '#FFFFFF',
        text: {
          primary: '#1D1D1F',
          secondary: '#86868B'
        },
        border: '#E5E5EA'
      },
      borderRadius: {
        lg: '12px',
        md: '8px',
        sm: '6px'
      },
      boxShadow: {
        card: '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 16px rgba(0, 0, 0, 0.12)'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
}
