import { ModalRegistry } from "@/components/Modais"
import type { ComponentType } from "react"
import { Modais } from "./ModalManager"
import { useModal } from "./ModalContext"

/** Desenha a pilha de modais. Cada modal recebe onClose = "me tire da pilha". */
export function ModalRenderer() {
  const { modals } = useModal()

  return (
    <>
      {modals.map(({ id, type, props }) => {
        const Component = ModalRegistry[type] as ComponentType<any>
        return <Component key={id} {...props} onClose={() => Modais.closeModal(id)} />
      })}
    </>
  )
}
