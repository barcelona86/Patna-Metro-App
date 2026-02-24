module.exports = {
  darkMode: 'class',
  presets: [require("nativewind/preset")],
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0B3D91', // Navy Blue
        secondary: '#F4F6F8', // Light Gray Accent
        text: '#333333', // Dark Gray Text
        white: '#FFFFFF',
        'metro-red': '#D32F2F',
        'metro-yellow': '#FBC02D',
        'metro-blue': '#1976D2',
        // Keeping legacy colors mapped to new ones for safety if used elsewhere
        dark: '#0B3D91',
      },
      boxShadow: {
        'card': '0 2px 4px rgba(0,0,0,0.1)',
        'elevation': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}

