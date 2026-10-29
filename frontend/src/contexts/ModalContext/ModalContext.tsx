import type { ModalType } from "@/components/Modais"
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { setModalContext } from "./ModalManager"

interface ModalEntry {
  id: string
  type: ModalType
  props: any
}

export interface ModalContextType {
  modals: ModalEntry[]
  openModal: (id: string, type: ModalType, props?: any) => string
  closeModal: (id: string) => void
  closeAllModals: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)
let modalInstanceCounter = 0

/**
 * Pilha global de modais. Qualquer código (até fora de componente React) abre uma modal com
 * Modais.ModalUpdate.open({...}) e o ModalRenderer desenha a pilha na ordem: a última aberta
 * fica por cima. É o que permite abrir "Editar produto" de dentro de "Itens do pedido".
 */
export function ModalProvider({ children }: { children: ReactNode }) {
  const [modals, setModals] = useState<ModalEntry[]>([])

  const openModal = useCallback((id: string, type: ModalType, props: any = {}) => {
    const instanceId = `${type}-${id || "modal"}-${modalInstanceCounter++}`
    setModals((prev) => [...prev, { id: instanceId, type, props }])
    return instanceId
  }, [])

  const closeModal = useCallback((id: string) => {
    setModals((prev) => prev.filter((m) => m.id !== id))
  }, [])

  const closeAllModals = useCallback(() => setModals([]), [])

  const value = useMemo(
    () => ({ modals, openModal, closeModal, closeAllModals }),
    [modals, openModal, closeModal, closeAllModals]
  )

  // Disponibiliza a pilha para o ModalManager (Modais.X.open fora do React).
  useEffect(() => {
    setModalContext(value)
  }, [value])

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
}

export const useModal = (): ModalContextType => {
  const ctx = useContext(ModalContext)
  if (!ctx) throw new Error("useModal precisa estar dentro do ModalProvider")
  return ctx
}
