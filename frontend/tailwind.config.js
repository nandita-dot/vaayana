/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Strict 60/30/10 Color System
        vaayana: {
          dark: '#111713',          // 60% Dominant deep charcoal / near-black
          darkSurface: '#18221B',   // Dark structural card / panel
          darkElevated: '#1F2C23',  // Slightly elevated dark surface
          darkBorder: '#2A3C2F',    // Dark border
          darkMuted: '#384F3E',     // Muted dark state
          soft: '#F1F4EE',          // 30% Secondary soft white
          softSurface: '#FFFFFF',   // Bright reading surface
          softBorder: '#E2E8DC',    // Soft border
          softMuted: '#D3DDD1',     // Soft muted container
          lime: '#9ACD32',          // 10% Accent darker neon-lime green
          limeHover: '#88BA27',     // Lime interactive hover
          limeDark: '#6E941E',      // Deep lime for high-contrast borders
          limeLight: '#E8F5D0',     // Light lime tint for subtle chips
          limeGlow: 'rgba(154, 205, 50, 0.25)',
          textDark: '#111713',      // Primary dark text on soft white
          textDarkMuted: '#4C5D50',
          textLight: '#F1F4EE',     // Primary light text on dark background
          textLightMuted: '#9FB1A3',
        },
        // Semantic status feedback
        feedback: {
          success: '#22C55E',
          error: '#EF4444',
          warning: '#F59E0B',
          info: '#3B82F6',
        }
      },
      fontFamily: {
        sans: ['"Noto Sans Malayalam"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        malayalam: ['"Noto Sans Malayalam"', 'sans-serif'],
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(17, 23, 19, 0.08)',
        'darkCard': '0 10px 30px -4px rgba(0, 0, 0, 0.5), 0 2px 6px -1px rgba(0, 0, 0, 0.3)',
        'lifted': '0 20px 35px -5px rgba(0, 0, 0, 0.4), 0 8px 12px -6px rgba(0, 0, 0, 0.2)',
        'limeGlow': '0 0 25px -2px rgba(154, 205, 50, 0.45)',
        'limeBorder': '0 0 0 2px #9ACD32',
      }
    },
  },
  plugins: [],
}
