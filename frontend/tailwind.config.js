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
        // Neutrals / Grey Scale
        neutral: {
          10: '#F5F5F5',
          20: '#E6E6E6',
          40: '#B3B3B3',
          60: '#666666',
          80: '#333333',
          100: '#000000',
        },
        // Steel Grey
        steel: {
          20: '#F4F4F5',
          60: '#D0D0D4',
          100: '#7A7A83',
          160: '#27272A',
          180: '#202024',
        },
        // Piramal Orange (Primary Accent)
        orange: {
          10: '#FEE0EC',
          60: '#F74A8D',
          100: '#F26841',
          140: '#913E27',
          180: '#30150D',
        },
        // Piramal Blue (Secondary Accent)
        blue: {
          10: '#EBEEF0',
          60: '#896A5A',
          100: '#365069',
          140: '#20303F',
          180: '#0B1015',
        },
        // Supportive Colors
        red: {
          100: '#FF354D',
        },
        green: {
          100: '#0AAE5F',
        },
        yellow: {
          100: '#FFBD07',
        },
        lavender: {
          100: '#9A55B2',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'base': '16px',
        'heading': '24px',
      },
      spacing: {
        'xs': '8px',
        'sm': '16px',
        'md': '24px',
        'lg': '32px',
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-in-out',
        'slide-up': 'slideUp 300ms ease-out',
        'scale-in': 'scaleIn 200ms ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
