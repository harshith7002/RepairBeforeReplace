/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          50: '#F8FAF9',
          100: '#F1F4F3',
          200: '#E4E9E7',
          300: '#D2DCD8',
        },
        charcoal: {
          900: '#111315',
          800: '#181B1E',
          700: '#23272C',
          600: '#32373F',
          500: '#484F5A',
        },
        graphite: {
          DEFAULT: '#2B3037',
          border: '#3A414A',
          muted: '#86909D',
        },
        industrial: {
          orange: '#EA580C',
          amber: '#D97706',
          amberLight: '#FEF3C7',
          green: '#059669',
          greenLight: '#D1FAE5',
          steel: '#475569',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'workstation': '0 10px 30px -10px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.06)',
        'hud': '0 20px 40px -15px rgba(0, 0, 0, 0.25)',
      }
    },
  },
  plugins: [],
}
