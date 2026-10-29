import type { ModalComponentMap, ModalPropsMap } from "@/components/Modais"
import type { ModalContextType } from "./ModalContext"

let modalCtx: ModalContextType | null = null
const modalRefs: Partial<Record<keyof ModalComponentMap, string[]>> = {}

export const setModalContext = (ctx: ModalContextType) => {
  modalCtx = ctx
}

type ModalActions<K extends keyof ModalComponentMap> = {
  open: (props: ModalPropsMap[K]) => void
  close: () => void
}

type ModalManager = { [K in keyof ModalComponentMap]: ModalActions<K> } & {
  /** Fecha qualquer modal pelo id devolvido em openModal. */
  closeModal: (id: string) => void
}

const closeModal = (id: string) => {
  modalCtx?.closeModal(id)
  ;(Object.keys(modalRefs) as Array<keyof ModalComponentMap>).forEach((key) => {
    const next = modalRefs[key]?.filter((refId) => refId !== id) ?? []
    if (next.length) modalRefs[key] = next
    else delete modalRefs[key]
  })
}

const entries: Partial<Record<keyof ModalComponentMap, ModalActions<any>>> = {}

const entryFor = <K extends keyof ModalComponentMap>(key: K): ModalActions<K> =>
  (entries[key] ??= {
    open: (props: ModalPropsMap[K]) => {
      const id = modalCtx?.openModal(props?.id || "", key, props)
      if (id) (modalRefs[key] ??= [] as string[]).push(id)
    },
    close: () => {
      const refs = modalRefs[key]
      const id = refs?.[refs.length - 1]
      if (id) closeModal(id)
    }
  }) as ModalActions<K>

/**
 * Uma entrada por modal registrada em components/Modais, com open/close TIPADOS:
 *   Modais.ModalUpdate.open({ id, derivation, params, closeModal })
 * O TypeScript reclama se faltar uma prop da modal.
 *
 * É um Proxy (e não um objeto montado a partir do ModalRegistry) para este arquivo depender só
 * dos TIPOS das modais: as modais importam o Modais, e o Modais importar as modais em tempo de
 * execução criaria um import circular.
 */
export const Modais = new Proxy({} as ModalManager, {
  get(_, prop) {
    if (prop === "closeModal") return closeModal
    return entryFor(prop as keyof ModalComponentMap)
  }
})
