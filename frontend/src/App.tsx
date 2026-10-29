import { ModalRenderer } from "./contexts/ModalContext/ModalRenderer"
import { Router } from "./routes/Router"

export function App() {
  return (
    <>
      <Router />
      <ModalRenderer />
    </>
  )
}
