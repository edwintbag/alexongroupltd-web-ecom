import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './data/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#00131D',
        ink: '#002537',
        slate: { 900: '#062E42', 800: '#0B3346', 700: '#12404F' },
        gold: { DEFAULT: '#DA9629', 400: '#E8AC48', 300: '#F2B23E', 600: '#B77A19' },
        clay: { DEFAULT: '#991728', 400: '#B93244' },
        bone: '#F2EFE9',
        mute: '#8FA3AE',
        line: 'rgba(242,239,233,0.12)',
        success: '#2E9E6B',
        warning: '#D9A227',
        error: '#C3383F',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Futura', 'Trebuchet MS', 'system-ui', 'sans-serif'],
        sans: ['var(--font-body)', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'Consolas', 'monospace'],
      },
      fontSize: {
        'display-xl': ['clamp(2.75rem, 7vw, 6.5rem)', { lineHeight: '0.92', letterSpacing: '-0.03em' }],
        'display-lg': ['clamp(2.25rem, 5.2vw, 4.5rem)', { lineHeight: '0.96', letterSpacing: '-0.025em' }],
        'display-md': ['clamp(1.75rem, 3.6vw, 3rem)', { lineHeight: '1.02', letterSpacing: '-0.02em' }],
        'display-sm': ['clamp(1.35rem, 2.4vw, 2rem)', { lineHeight: '1.1', letterSpacing: '-0.015em' }],
        eyebrow: ['0.6875rem', { lineHeight: '1', letterSpacing: '0.22em' }],
      },
      borderRadius: { none: '0', xs: '2px', sm: '3px', DEFAULT: '4px', md: '6px', lg: '10px' },
      boxShadow: {
        lift: '0 18px 50px -22px rgba(0,0,0,0.75)',
        panel: '0 1px 0 rgba(242,239,233,0.06) inset, 0 24px 60px -30px rgba(0,0,0,0.9)',
        gold: '0 12px 40px -16px rgba(218,150,41,0.55)',
      },
      transitionTimingFunction: {
        rule: 'cubic-bezier(0.16, 1, 0.3, 1)',
        press: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      maxWidth: { shell: '1440px', prose: '68ch' },
      keyframes: {
        'rule-in': { '0%': { transform: 'scaleX(0)' }, '100%': { transform: 'scaleX(1)' } },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        'fade-up': { '0%': { opacity: '0', transform: 'translateY(14px)' }, '100%': { opacity: '1', transform: 'none' } },
      },
      animation: {
        'rule-in': 'rule-in .7s cubic-bezier(0.16,1,0.3,1) forwards',
        shimmer: 'shimmer 1.6s infinite',
        'fade-up': 'fade-up .5s cubic-bezier(0.16,1,0.3,1) both',
      },
    },
  },
  plugins: [],
};
export default config;
