/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#241329',
        cream: '#FFF3DD',
        orange: '#FF6B22',
        blue: '#3A28E5',
        red: '#F23A2E'
      },
      fontFamily: {
        display: ['Arial Black', 'Impact', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        pop: '8px 8px 0 #241329',
        'pop-sm': '4px 4px 0 #241329'
      }
    }
  },
  plugins: []
}
