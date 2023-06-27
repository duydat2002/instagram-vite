/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')

module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        textColor: {
          primary: 'var(--primary-text-color)',
          secondary: 'var(--secondary-text-color)'
        },
        bgColor: {
          primary: 'var(--primary-bg-color)',
          secondary: 'var(--secondary-bg-color)'
        },
        borderColor: {
          DEFAULT: 'var(--border-color)',
          dark: 'var(--border-dark-color)',
          superdark: 'var(--border-super-dark-color)'
        },
        buttonColor: {
          primary: {
            DEFAULT: 'var(--primary-button-color)',
            hover: 'var(--primary-button-hover-color)'
          },
          secondary: {
            DEFAULT: 'var(--secondary-button-color)',
            hover: 'var(--secondary-button-hover-color)'
          }
        },
        separator: {
          DEFAULT: 'var(--separator-color)',
          modal: 'var(--separator-modal-color)'
        },
        track: {
          DEFAULT: 'var(--track-color)',
          active: 'var(--active-track-color)'
        },
        gradient: {
          lavender: 'rgb(211, 0, 197)',
          orange: 'rgb(255, 122, 0)',
          pink: 'rgb(255, 1, 105)',
          purple: 'rgb(118, 56, 250)',
          red: 'rgb(255, 48, 64)',
          yellow: 'rgb(255, 214, 0)'
        },
        thumb: 'var(--thumb-color)',
        link: 'var(--link-color)',
        error: 'var(--error-color)',
        hover: 'var(--hover-color)',
        modal: 'var(--modal-color)',
        skeleton: 'var(--skeleton-bg-color)',
        placeholder: 'var(--placeholder-color)'
      },
      width: {
        'nav-narrow': 'var(--nav-narrow-width)',
        'nav-medium': 'var(--nav-medium-width)'
      },
      spacing: {
        'nav-narrow': 'var(--nav-narrow-width)',
        'nav-medium': 'var(--nav-medium-width)'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant('focus-el', '&.focus-el')
    })
  ]
}
