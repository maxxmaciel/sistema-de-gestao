import { CssBaseline, ThemeProvider } from "@mui/material"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { Toaster } from "sonner"
import { App } from "./App"
import { AppProvider } from "./contexts/AppContext"
import { ModalProvider } from "./contexts/ModalContext/ModalContext"
import "./styles/global.css"
import { theme } from "./styles/theme"

// Sem StrictMode de propósito: em dev ele roda os efeitos duas vezes, e as modais abertas por
// efeito (Modais.X.open) apareceriam em dobro.
ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <BrowserRouter>
      <AppProvider>
        <ModalProvider>
          <App />
          <Toaster richColors position="top-right" />
        </ModalProvider>
      </AppProvider>
    </BrowserRouter>
  </ThemeProvider>
)
