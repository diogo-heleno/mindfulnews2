/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Calm, mindful palette
        cream: {
          50: '#FEFDFB',
          100: '#FDF9F3',
          200: '#FAF3E6',
          300: '#F5E9D4',
          400: '#EDDCC0',
        },
        sage: {
          50: '#F6F8F6',
          100: '#E8EDE8',
          200: '#D1DCD1',
          300: '#A8C0A8',
          400: '#7FA37F',
          500: '#5A855A',
          600: '#466B46',
          700: '#385438',
          800: '#2D442D',
          900: '#1A2E1A',
        },
        ocean: {
          50: '#F4F9FA',
          100: '#E4F0F3',
          200: '#C5DEE5',
          300: '#96C5D1',
          400: '#5FA5B8',
          500: '#3D8A9E',
          600: '#2F6E80',
          700: '#285A69',
        },
        stone: {
          50: '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E5E4',
          300: '#D6D3D1',
          400: '#A8A29E',
          500: '#78716C',
          600: '#57534E',
          700: '#44403C',
          800: '#292524',
          900: '#1C1917',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        sans: ['Avenir', 'Montserrat', 'Corbel', 'URW Gothic', 'source-sans-pro', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
