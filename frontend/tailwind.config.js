/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cohesive Dark Theme with Purple Identity & Warm Beige Patterns
        vaayana: {
          dark: '#563580',          // Deep purple for important actions & headers
          darkSurface: '#17151B',   // Dark charcoal card / panel
          darkElevated: '#1D1A24',  // Elevated dark charcoal container / pill
          darkBorder: '#2E263B',    // Subtle dark purple border
          darkMuted: '#A59CB5',     // Secondary muted text
          soft: '#111114',          // Near-black section surface
          softSurface: '#17151B',   // Dark card surface
          softBorder: '#2E263B',    // Subtle purple-tinted border
          softMuted: '#1D1A24',     // Elevated dark surface
          lime: '#7950B8',          // Primary purple accent
          limeHover: '#8C63D0',     // Bright purple interactive hover
          limeDark: '#563580',      // Deep purple
          limeLight: '#1D1A24',     // Dark lavender-purple container
          limeGlow: 'rgba(121, 80, 184, 0.45)',
          textDark: '#EDE5F7',      // Primary main text on dark surfaces
          textDarkMuted: '#A59CB5', // Secondary muted text
          textLight: '#EDE5F7',     // Main text
          textLightMuted: '#A59CB5',// Secondary text
          // Deep Black & Warm Beige tokens
          blackBg: '#090909',
          blackSurface: '#111114',
          blackElevated: '#17151B',
          purple: '#7950B8',
          deepPurple: '#563580',
          softLavender: '#EDE5F7',
          warmBeige: '#F5F0E6',
          warmIvory: '#E8DDC8',
        },
        // Playful Child-Friendly Accents (Selective pops of colour on dark canvas)
        playful: {
          yellow: '#FFD166',
          coral: '#FF8066',
          sky: '#65C7F7',
          mint: '#72D6B0',
          pink: '#F5A6C8',
          orange: '#FFA552',
        },
        // Semantic status feedback (PRESERVED)
        feedback: {
          success: '#16A34A',
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
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
        'darkCard': '0 8px 24px -4px rgba(0, 0, 0, 0.6), 0 2px 6px -1px rgba(121, 80, 184, 0.1)',
        'lifted': '0 16px 32px -4px rgba(0, 0, 0, 0.7), 0 4px 10px -2px rgba(121, 80, 184, 0.15)',
        'limeGlow': '0 0 25px -2px rgba(121, 80, 184, 0.45)',
        'limeBorder': '0 0 0 2px #7950B8',
      }
    },
  },
  plugins: [],
}
