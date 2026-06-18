import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";
import containerQueries from "@tailwindcss/container-queries";

/**
 * AgriFetch design system.
 * Tokens mirror the Material-derived dark theme defined in design.html and are
 * the single source of truth for color, type, spacing, and radius.
 */
const config: Config = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "surface-container": "#1d2020",
        "surface-container-high": "#282a2a",
        "surface-container-highest": "#323535",
        "surface-container-low": "#191c1c",
        "surface-container-lowest": "#0c0f0f",
        "surface-variant": "#323535",
        "surface-bright": "#373a3a",
        "surface-dim": "#111414",
        surface: "#111414",
        "surface-tint": "#adcdc1",
        background: "#111414",
        "on-background": "#e1e3e2",
        "on-surface": "#e1e3e2",
        "on-surface-variant": "#c1c8c4",
        "inverse-surface": "#e1e3e2",
        "inverse-on-surface": "#2e3131",
        outline: "#8b928f",
        "outline-variant": "#414845",
        primary: "#adcdc1",
        "primary-fixed": "#c9eadd",
        "primary-fixed-dim": "#adcdc1",
        "primary-container": "#0d2b23",
        "on-primary": "#18362d",
        "on-primary-container": "#759489",
        "on-primary-fixed": "#022019",
        "on-primary-fixed-variant": "#2f4c43",
        "inverse-primary": "#47645a",
        secondary: "#ffffff",
        "secondary-fixed": "#b8f600",
        "secondary-fixed-dim": "#a1d800",
        "secondary-container": "#b8f600",
        "on-secondary": "#263500",
        "on-secondary-container": "#506e00",
        "on-secondary-fixed": "#141f00",
        "on-secondary-fixed-variant": "#384e00",
        tertiary: "#a9cec2",
        "tertiary-fixed": "#c4ebdd",
        "tertiary-fixed-dim": "#a9cec2",
        "tertiary-container": "#062c24",
        "on-tertiary": "#13362e",
        "on-tertiary-container": "#719589",
        "on-tertiary-fixed": "#002019",
        "on-tertiary-fixed-variant": "#2b4d44",
        error: "#ffb4ab",
        "error-container": "#93000a",
        "on-error": "#690005",
        "on-error-container": "#ffdad6",
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
        full: "0.75rem",
      },
      spacing: {
        xs: "4px",
        base: "8px",
        sm: "12px",
        md: "24px",
        gutter: "24px",
        lg: "48px",
        xl: "80px",
        "container-max": "1440px",
      },
      maxWidth: {
        "container-max": "1440px",
      },
      fontFamily: {
        "display-lg": ["Sora", "sans-serif"],
        "headline-lg": ["Sora", "sans-serif"],
        "headline-lg-mobile": ["Sora", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "label-md": ["JetBrains Mono", "monospace"],
        "label-sm": ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        "display-lg": ["48px", { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-lg-mobile": ["36px", { lineHeight: "44px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "headline-lg-mobile": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "label-md": ["14px", { lineHeight: "20px", letterSpacing: "0.05em", fontWeight: "500" }],
        "label-sm": ["12px", { lineHeight: "16px", letterSpacing: "0.08em", fontWeight: "500" }],
      },
      keyframes: {
        "route-dash": {
          to: { "stroke-dashoffset": "-1000" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "route-dash": "route-dash 30s linear infinite",
        marquee: "marquee 40s linear infinite",
      },
    },
  },
  plugins: [forms, containerQueries],
};

export default config;
