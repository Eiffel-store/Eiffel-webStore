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
        // Dynamic CSS Variable Brand Colors (Adapts automatically in Dark/Light modes)
        "background": "var(--color-background)",
        "surface": "var(--color-surface)",
        "primary": "var(--color-primary)",
        "on-surface": "var(--color-primary)",
        "secondary": "var(--color-secondary)",
        
        // Neutral Surfaces & Containers
        "surface-container-lowest": "var(--color-surface)",
        "surface-container-low": "var(--color-surface-container-low)",
        "surface-container": "var(--color-border)",
        "surface-container-high": "var(--color-surface-container-high)",
        "surface-container-highest": "var(--color-surface-container-high)",
        
        // Inverted & Dark References
        "inverse-surface": "var(--color-surface-container-low)",
        "inverse-on-surface": "var(--color-primary)",
        "inverse-primary": "var(--color-background)",
        
        // Luxury Accents
        "gold-accent": "#c5a880",
        "gold-light": "#e8d5be",
        "error": "#dc2626",
        "error-container": "#fee2e2",
        "success": "#16a34a",
        
        // Neutral Slate / Zinc Overrides
        "outline": "var(--color-border)",
        "outline-variant": "var(--color-border)",
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
        "headline-md": ["Cairo", "Bebas Neue", "sans-serif"],
        "headline-lg-mobile": ["Cairo", "Bebas Neue", "sans-serif"],
        "body-md": ["Cairo", "Inter", "sans-serif"],
        "label-bold": ["Cairo", "Inter", "sans-serif"],
        "label-sm": ["Cairo", "Inter", "sans-serif"],
        "display-xl": ["Cairo", "Bebas Neue", "sans-serif"],
        "headline-lg": ["Cairo", "Bebas Neue", "sans-serif"],
        "display-lg": ["Cairo", "Bebas Neue", "sans-serif"],
        "body-lg": ["Cairo", "Inter", "sans-serif"],
        "bebas": ["Cairo", "Bebas Neue", "sans-serif"],
        "inter": ["Cairo", "Inter", "sans-serif"],
        "editorial": ["Cairo", "Bebas Neue", "sans-serif"],
        "cairo": ["Cairo", "sans-serif"],
        "sans": ["Cairo", "Inter", "sans-serif"]
      },
    },
  },
  plugins: [],
}
