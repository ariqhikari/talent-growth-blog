/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          50: '#FDFDFC',
          100: '#F7F7F4',
          200: '#EFEFEA',
          300: '#E3E3DC',
        },
        ink: {
          950: '#0F1115',
          900: '#181A20',
          800: '#272B35',
          700: '#3F4452',
          600: '#5C6375',
          500: '#7B8296',
          400: '#9DA3B4',
        },
        accent: {
          DEFAULT: '#C2410C', // Rich terracotta/burnt orange
          hover: '#9A3412',
          subtle: '#FFEDD5',
        },
        focus: '#C2410C',
      },
      fontFamily: {
        serif: ['"Newsreader"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'tactile-sm': '0 1px 2px rgba(15, 17, 21, 0.05), 0 1px 1px rgba(15, 17, 21, 0.03)',
        'tactile': '0 4px 12px rgba(15, 17, 21, 0.05), 0 1px 3px rgba(15, 17, 21, 0.03)',
        'tactile-lg': '0 10px 24px -3px rgba(15, 17, 21, 0.07), 0 4px 6px -2px rgba(15, 17, 21, 0.03)',
      },
      spacing: {
        '18': '4.5rem',
      }
    },
  },
  plugins: [],
}

