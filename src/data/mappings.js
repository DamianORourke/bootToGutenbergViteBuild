/**
 * Bootstrap to WordPress Theme Mappings
 *
 * Maps Bootstrap utility classes to WordPress theme.json design tokens.
 * These are extracted from bootToGutenberg.html constructor (lines 310-388)
 *
 * @example
 * import { spacingMap, bgColorMap } from './data/mappings.js'
 *
 * spacingMap['3']  // → 'md' (1rem)
 * bgColorMap['bg-primary']  // → 'primary'
 */

/**
 * Bootstrap spacing (1-5) to theme.json spacing slugs
 */
export const spacingMap = {
  '0': '0',
  '1': '2xs',   // 0.25rem
  '2': 'sm',    // 0.75rem
  '3': 'md',    // 1rem
  '4': 'lg',    // 1.5rem
  '5': '2-xl'   // 3rem
}

/**
 * Bootstrap background colors to theme.json color slugs
 */
export const bgColorMap = {
  'bg-primary': 'primary',
  'bg-secondary': 'secondary',
  'bg-success': 'success',
  'bg-danger': 'error',
  'bg-warning': 'warning',
  'bg-info': 'info',
  'bg-light': 'surface',
  'bg-dark': 'dark',
  'bg-white': 'white',
  'bg-body': 'base',
  'bg-transparent': 'transparent'
}

/**
 * Bootstrap text colors to theme.json color slugs
 */
export const textColorMap = {
  'text-primary': 'primary',
  'text-secondary': 'secondary',
  'text-success': 'success',
  'text-danger': 'error',
  'text-warning': 'warning',
  'text-info': 'info',
  'text-light': 'surface',
  'text-dark': 'dark',
  'text-white': 'white',
  'text-muted': 'text-muted',
  'text-body': 'text-primary'
}

/**
 * Bootstrap font sizes to theme.json font size slugs
 */
export const fontSizeMap = {
  'fs-1': '6x-large',
  'fs-2': '5x-large',
  'fs-3': '4x-large',
  'fs-4': '3x-large',
  'fs-5': '2x-large',
  'fs-6': 'x-large'
}

/**
 * Bootstrap column widths to percentages
 */
export const colWidthMap = {
  '1': '8.33%',
  '2': '16.66%',
  '3': '25%',
  '4': '33.33%',
  '5': '41.66%',
  '6': '50%',
  '7': '58.33%',
  '8': '66.66%',
  '9': '75%',
  '10': '83.33%',
  '11': '91.66%',
  '12': '100%'
}

/**
 * Bootstrap theme mapping for CSS variable generation
 * Used by CSS library to output theme-native styles
 */
export const themeMapping = {
  colors: {
    primary: 'var(--wp--preset--color--primary)',
    secondary: 'var(--wp--preset--color--secondary)',
    success: 'var(--wp--preset--color--success)',
    error: 'var(--wp--preset--color--error)',
    warning: 'var(--wp--preset--color--warning)',
    info: 'var(--wp--preset--color--info)',
    surface: 'var(--wp--preset--color--surface)',
    dark: 'var(--wp--preset--color--dark)',
    white: 'var(--wp--preset--color--white)',
    border: 'var(--wp--preset--color--border)'
  },
  spacing: {
    '2xs': 'var(--wp--preset--spacing--2xs)',
    'xs': 'var(--wp--preset--spacing--xs)',
    'sm': 'var(--wp--preset--spacing--sm)',
    'md': 'var(--wp--preset--spacing--md)',
    'lg': 'var(--wp--preset--spacing--lg)',
    'xl': 'var(--wp--preset--spacing--xl)',
    '2-xl': 'var(--wp--preset--spacing--2-xl)'
  }
}

/**
 * Components that require Bootstrap JavaScript
 */
export const interactiveComponents = [
  'accordion', 'modal', 'carousel', 'tab', 'collapse',
  'dropdown', 'offcanvas', 'toast', 'popover', 'tooltip'
]

/**
 * Components that require JavaScript initialization
 */
export const initRequiredComponents = [
  'tooltip', 'popover', 'toast'
]
