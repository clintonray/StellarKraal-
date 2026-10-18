import type { Config } from 'tailwindcss';

/**
 * Semantic color tokens for the design system.
 *
 * Each semantic role (primary, secondary, surface, error, warning, success, info)
 * exposes a `DEFAULT` value plus light/dark variants. Components should reference
 * these tokens (e.g. `bg-primary`, `text-error-dark`) instead of raw color values
 * so brand updates and dark mode stay consistent across the app.
 */
const semanticColors = {
  primary: {
    DEFAULT: '#2563eb',
    light: '#3b82f6',
    dark: '#1d4ed8',
  },
  secondary: {
    DEFAULT: '#7c3aed',
    light: '#8b5cf6',
    dark: '#6d28d9',
  },
  surface: {
    DEFAULT: '#ffffff',
    light: '#f8fafc',
    dark: '#0f172a',
  },
  error: {
    DEFAULT: '#dc2626',
    light: '#ef4444',
    dark: '#b91c1c',
  },
  warning: {
    DEFAULT: '#d97706',
    light: '#f59e0b',
    dark: '#b45309',
  },
  success: {
    DEFAULT: '#16a34a',
    light: '#22c55e',
    dark: '#15803d',
  },
  info: {
    DEFAULT: '#0891b2',
    light: '#06b6d4',
    dark: '#0e7490',
  },
} as const;

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ...semanticColors,
      },
    },
  },
  plugins: [],
};

export default config;
