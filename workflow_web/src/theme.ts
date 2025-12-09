import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#f9f5ff", // soft lavender-white background
      paper: "#ffffff",
    },
    primary: {
      main: "#7C3AED", // soft purple
    },
    secondary: {
      main: "#4F46E5", // indigo
    },
    info: {
      main: "#38BDF8", // pastel light blue
    },
    success: {
      main: "#22C55E", // mint green
    },
    warning: {
      main: "#FBBF24", // warm pastel yellow
    },
    error: {
      main: "#EF4444",
    },
    text: {
      primary: "#433E5C",
      secondary: "#6B6A84",
    },
    divider: "rgba(100, 100, 120, 0.2)",
  },
  typography: {
    fontFamily: [
      "Inter",
      "system-ui",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Roboto",
      "sans-serif",
    ].join(","),
    h6: {
      fontWeight: 600,
      letterSpacing: 0.3,
      color: "#433E5C",
    },
    subtitle2: {
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: 1.2,
      fontSize: 12,
    },
    body2: {
      fontSize: 14,
    },
    caption: {
      fontSize: 12,
    },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: "1.5px solid rgba(150,150,170,0.15)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 999,
          paddingLeft: 18,
          paddingRight: 18,
        },
      },
    },
  },
});

export default theme;
