import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#EBF3FF',
          100: '#CCE4FF',
          200: '#99C9FF',
          400: '#1A8FE3',
          500: '#0071C2',
          600: '#003B95',
          700: '#002D7A',
          800: '#001F5C',
          900: '#001240',
        },
        accent: {
          300: '#FFD84D',
          400: '#FFC914',
          500: '#FFB700',
          600: '#E6A500',
        },
        surface: '#F2F2F2',
      },
      boxShadow: {
        card: '0 2px 8px 0 rgba(0,0,0,0.10)',
        'card-hover': '0 6px 20px 0 rgba(0,0,0,0.14)',
      },
    },
  },
  plugins: [],
};

export default config;
