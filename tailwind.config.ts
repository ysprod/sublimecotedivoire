import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ─── ORANGE (primaire) ──────────────────────────────
        orange: {
          50:  '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316', // Orange principal
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
          950: '#431407',
        },
        
        // ─── VERT (secondaire) ──────────────────────────────
        green: {
          50:  '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981', // Vert principal
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
          950: '#022C22',
        },

        // ─── ORANGE-VERT (dégradés / accents) ──────────────
        primary: {
          DEFAULT: '#F97316', // Orange vif
          light:   '#FB923C',
          dark:    '#EA580C',
        },

        secondary: {
          DEFAULT: '#10B981', // Vert émeraude
          light:   '#34D399',
          dark:    '#059669',
        },

        accent: {
          orange:   '#F97316',
          'orange-light': '#FB923C',
          'orange-dark':  '#EA580C',
          green:    '#10B981',
          'green-light': '#34D399',
          'green-dark':  '#059669',
          // Aliases pour compatibilité
          gold:     '#F97316',
          'gold-light': '#FB923C',
          'gold-dark':  '#EA580C',
          violet:   '#10B981',
          'violet-light': '#34D399',
          'violet-dark':  '#059669',
        },

        // ─── FONDS CLAIRS (blanc & nuances) ─────────────────
        light: {
          bg:    '#FFFFFF',     // Fond principal blanc pur
          alt:   '#F9FAFB',    // Gris clair pour sections alternées
          card:  '#FFFFFF',    // Fond des cartes
          hover: '#FFF7ED',    // Orange très clair pour survol
          border: '#FED7AA',   // Orange pâle pour bordures
          text:  '#1A1A1A',    // Texte principal
          muted: '#6B7280',    // Texte secondaire
        },

        // ─── FONDS SOMBRES (pour le mode dark) ──────────────
        dark: {
          bg:     '#0C0A0A',
          bgAlt:  '#1A1616',
          card:   '#1F1A1A',
          hover:  '#2D2418',
          border: '#3D2A1A',
          text:   '#F5F0EB',
          muted:  '#A3A3A3',
        },

        // ─── DÉGRADÉS ───────────────────────────────────────
        gradient: {
          light: '#FFFFFF',
          dark:  '#F9FAFB',
        },
      },

      // ─── ANIMATIONS ───────────────────────────────────────
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-gentle': 'bounce 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },

      // ─── ARRIÈRE-PLANS ────────────────────────────────────
      backgroundImage: {
        'orange-gradient': 'linear-gradient(135deg, #F97316 0%, #FB923C 50%, #EA580C 100%)',
        'green-gradient': 'linear-gradient(135deg, #10B981 0%, #34D399 50%, #059669 100%)',
        'orange-green': 'linear-gradient(135deg, #F97316 0%, #FB923C 30%, #10B981 70%, #059669 100%)',
        'light-bg': 'linear-gradient(180deg, #FFFFFF 0%, #F9FAFB 100%)',
        'card-shadow': 'linear-gradient(180deg, #FFFFFF 0%, #FFF7ED 100%)',
      },

      // ─── OMBRES ───────────────────────────────────────────
      boxShadow: {
        'orange': '0 4px 14px rgba(249, 115, 22, 0.25)',
        'orange-lg': '0 8px 30px rgba(249, 115, 22, 0.35)',
        'green': '0 4px 14px rgba(16, 185, 129, 0.25)',
        'green-lg': '0 8px 30px rgba(16, 185, 129, 0.35)',
        'card': '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 10px 40px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)',
      },

      // ─── BORDURES ─────────────────────────────────────────
      borderColor: {
        'orange-light': '#FED7AA',
        'green-light': '#A7F3D0',
      },

      // ─── TYPOGRAPHIE ──────────────────────────────────────
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },

      // ─── ESPACEMENT ──────────────────────────────────────
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },

      // ─── BORDER RADIUS ────────────────────────────────────
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
    },
  },
  plugins: [],
};

export default config;