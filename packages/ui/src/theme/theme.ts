export const theme = {
  colors: {
    background: "#0b0b14",
    surface: "#151520",
    surfaceHover: "#202033",
    border: "#2a2a3a",
    text: "#f5f5f5",
    textMuted: "#b9bbc9",
    primary: "#8b5cf6",
    primaryHover: "#7c3aed",
    primaryText: "#ffffff",
    disabled: "#5f6472",
  },
  spacing: {
    none: 0,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    "2xl": 32,
  },
  typography: {
    heading: {
      fontSize: 24,
      fontWeight: "700",
      lineHeight: 32,
    },
    body: {
      fontSize: 16,
      fontWeight: "400",
      lineHeight: 24,
    },
    caption: {
      fontSize: 12,
      fontWeight: "500",
      lineHeight: 16,
    },
  },
} as const;
