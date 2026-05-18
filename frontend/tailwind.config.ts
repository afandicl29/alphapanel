import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
      },
      backgroundImage: {
        'alpha-gradient': 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 50%, #4f46e5 100%)',
        'alpha-mesh': 'radial-gradient(at 40% 20%, rgba(14,165,233,0.2) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(79,70,229,0.15) 0px, transparent 50%)',
        'alpha-mesh-dark': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(37,99,235,0.18), transparent), radial-gradient(ellipse 60% 40% at 100% 0%, rgba(14,165,233,0.1), transparent)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(37, 99, 235, 0.12)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
