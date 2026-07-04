import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sapphire: {
          50: "#EFF4FA", 100: "#D6E2F1", 200: "#ADC4E3", 300: "#6F94CB",
          400: "#3D69B0", 500: "#1E4685", 600: "#163562", 700: "#0F2647",
          800: "#0A1A33", 900: "#050E1F", 950: "#030A17",
        },
        gold: {
          300: "#F0D78A", 400: "#E5C25D", 500: "#D4AF37", 600: "#B8941F", 700: "#8F7115",
        },
      },
      boxShadow: {
        card: "0 1px 2px rgba(3,10,23,.5), 0 8px 24px rgba(3,10,23,.45), 0 32px 64px rgba(3,10,23,.35)",
        float: "0 4px 8px rgba(3,10,23,.4), 0 20px 40px rgba(3,10,23,.5), 0 60px 100px rgba(3,10,23,.45)",
        "glow-gold": "0 0 0 1px rgba(212,175,55,.35), 0 0 40px rgba(212,175,55,.22)",
        "glow-blue": "0 0 0 1px rgba(91,141,239,.3), 0 0 40px rgba(91,141,239,.22)",
      },
      fontFamily: {
        display: ['"Sora"', "system-ui", "sans-serif"],
        body: ['"Inter"', "system-ui", "sans-serif"],
      },
      animation: {
        marquee: "marquee 28s linear infinite",
        float: "float 6s ease-in-out infinite",
        "pulse-dot": "pulseDot 2s ease-in-out infinite",
        "spin-slow": "spin 14s linear infinite",
        shimmer: "shimmer 2.4s linear infinite",
      },
      keyframes: {
        marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-14px)" } },
        pulseDot: { "0%,100%": { opacity: "1", transform: "scale(1)" }, "50%": { opacity: ".55", transform: "scale(1.35)" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
      },
    },
  },
  plugins: [],
};
export default config;
