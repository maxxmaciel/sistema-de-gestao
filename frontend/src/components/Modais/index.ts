import { DoubleGrid } from "@/contexts/ModalContext/DoubleGrid"
import { MasterDetails } from "@/contexts/ModalContext/MasterDetails"
import { ModalCreate } from "@/contexts/ModalContext/ModalCreate"
import { ModalDelete } from "@/contexts/ModalContext/ModalDelete"
import { ModalUpdate } from "@/contexts/ModalContext/ModalUpdate"
import type { ComponentProps } from "react"
import { FetchModal } from "../Components/FetchModal"

/**
 * Registro das modais que podem ser abertas por Modais.X.open. O nome aqui é o MESMO "type" que o
 * backend manda nas ações derivadas (getClass().getSimpleName()): ModalUpdate, MasterDetails...
 * É esse casamento de nomes que liga a classe Java ao componente React.
 */
export const ModalRegistry = {
  ModalCreate,
  ModalUpdate,
  ModalDelete,
  MasterDetails,
  DoubleGrid,
  FetchModal
} as const

export type ModalComponentMap = typeof ModalRegistry
export type ModalType = keyof ModalComponentMap

type BaseModalProps = {
  id: string
}

/** Props de cada modal, sem onClose (quem dá é o ModalRenderer) e com id obrigatório. */
export type ModalPropsMap = {
  [K in keyof ModalComponentMap]: Omit<ComponentProps<ModalComponentMap[K]>, "onClose" | "id"> & BaseModalProps
}
