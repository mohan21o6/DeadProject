/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6C4CF1',
          hover: '#5A38E6',
          light: '#EEF0FF',
          dark: '#482EC0'
        },
        secondary: {
          DEFAULT: '#4F46E5',
          light: '#EEF2FF',
          dark: '#3730A3'
        },
        accent: {
          DEFAULT: '#8B5CF6',
          light: '#F5F3FF',
          dark: '#6D28D9'
        },
        dark: {
          DEFAULT: '#0B1020',
          card: '#12182D',
          border: '#1F2942',
          surface: '#151C33'
        },
        surface: {
          bg: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E5E7EB',
          subtle: '#F1F5F9'
        },
        text: {
          primary: '#111827',
          secondary: '#64748B',
          muted: '#94A3B8'
        },
        status: {
          success: '#16A34A',
          warning: '#F59E0B',
          danger: '#EF4444',
          info: '#0284C7'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 10px 25px -3px rgba(108, 76, 241, 0.12), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 25px rgba(108, 76, 241, 0.35)',
        'glow-accent': '0 0 30px rgba(139, 92, 246, 0.45)',
      },
      borderRadius: {
        'xl': '0.875rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
