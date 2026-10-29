import { AppContext } from "@/contexts/AppContext/context"
import { useContext } from "react"

export const useAppContext = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useAppContext precisa estar dentro do AppProvider")
  return ctx
}
