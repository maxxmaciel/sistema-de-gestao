import { createTheme } from "@mui/material"

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#4f46e5" },
    secondary: { main: "#0ea5e9" },
    success: { main: "#16a34a" },
    background: { default: "#f4f5f9", paper: "#ffffff" },
    text: { primary: "#111827", secondary: "#6b7280" }
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: '"Inter", "Segoe UI", system-ui, -apple-system, Roboto, Arial, sans-serif',
    button: { textTransform: "none", fontWeight: 600 }
  },
  components: {
    MuiDialog: {
      styleOverrides: { paper: { borderRadius: 14 } }
    },
    MuiTableCell: {
      styleOverrides: {
        head: { fontWeight: 700, fontSize: 12, color: "#4b5563", backgroundColor: "#f9fafb" }
      }
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 600 } }
    }
  }
})
