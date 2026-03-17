import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#080808',
        secondary: '#0f0f0f',
        glass: {
          DEFAULT: 'rgba(255, 255, 255, 0.05)',
          border: 'rgba(255, 255, 255, 0.1)',
          hover: 'rgba(255, 255, 255, 0.08)',
        },
        accent: {
          violet: '#8b5cf6',
          cyan: '#06b6d4',
          purple: '#a855f7',
        },
      },
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      fontWeight: {
        'sora-semibold': '600',
        'sora-bold': '700',
        'sora-extrabold': '800',
      },
      backdropBlur: {
        glass: '12px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 4s ease infinite',
        'shimmer': 'shimmer 2s infinite',
        'border-glow': 'border-glow 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '25%': { transform: 'translateY(-10px) rotate(1deg)' },
          '50%': { transform: 'translateY(-5px) rotate(0deg)' },
          '75%': { transform: 'translateY(-15px) rotate(-1deg)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'border-glow': {
          '0%, 100%': { borderColor: 'rgba(139, 92, 246, 0.5)' },
          '50%': { borderColor: 'rgba(6, 182, 212, 0.5)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(6, 182, 212, 0.4)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
        'gradient-secondary': 'linear-gradient(135deg, #a855f7, #8b5cf6)',
        'gradient-animated': 'linear-gradient(135deg, #8b5cf6, #06b6d4, #a855f7, #8b5cf6)',
      },
      boxShadow: {
        'glow-violet': '0 0 40px rgba(139, 92, 246, 0.3)',
        'glow-cyan': '0 0 40px rgba(6, 182, 212, 0.3)',
        'glow-gradient': '0 0 40px rgba(139, 92, 246, 0.2), 0 0 80px rgba(6, 182, 212, 0.1)',
      },
    },
  },
  plugins: [],
}

export default config
