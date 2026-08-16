/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core Brand Luxury Palette
        "background": "#ffffff",
        "surface": "#ffffff",
        "primary": "#09090b",
        "on-surface": "#09090b",
        "secondary": "#64748b",
        
        // Crisp Neutral Surfaces & Containers
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f8f8f9",
        "surface-container": "#f1f1f3",
        "surface-container-high": "#e9e9ec",
        "surface-container-highest": "#e2e2e5",
        
        // Inverted & Dark References
        "inverse-surface": "#18181b",
        "inverse-on-surface": "#f8f8f9",
        "inverse-primary": "#ffffff",
        
        // Luxury Accents
        "gold-accent": "#c5a880",
        "gold-light": "#e8d5be",
        "error": "#dc2626",
        "error-container": "#fee2e2",
        "success": "#16a34a",
        
        // Neutral Slate / Zinc Overrides
        "outline": "#d4d4d8",
        "outline-variant": "#e4e4e7",
      },
      borderRadius: {
        "DEFAULT": "0px",
        "none": "0px",
        "sm": "0px",
        "md": "0px",
        "lg": "0px",
        "xl": "0px",
        "2xl": "0px",
        "full": "9999px"
      },
      spacing: {
        "container-max": "1440px",
        "gutter": "24px",
        "margin-desktop": "64px",
        "unit": "4px",
        "margin-mobile": "20px",
        "stack-xl": "120px",
        "stack-lg": "80px"
      },
      fontFamily: {
        "headline-md": ["Bebas Neue", "sans-serif"],
        "headline-lg-mobile": ["Bebas Neue", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "label-bold": ["Inter", "sans-serif"],
        "label-sm": ["Inter", "sans-serif"],
        "display-xl": ["Bebas Neue", "sans-serif"],
        "headline-lg": ["Bebas Neue", "sans-serif"],
        "display-lg": ["Bebas Neue", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "bebas": ["Bebas Neue", "sans-serif"],
        "inter": ["Inter", "sans-serif"]
      },
    },
  },
  plugins: [],
}
