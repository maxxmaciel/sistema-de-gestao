import { Components } from "@/components/Components"
import type { ButtonListItem } from "@/components/Components/ButtonListModal"
import type { ComponentType, GridDefinition } from "@/contexts/AppContext/interfaces"
import {
  ArrowsLeftRight,
  Icon as PhosphorIcon,
  ListMagnifyingGlass,
  PencilSimple,
  PlusCircle,
  Trash
} from "@phosphor-icons/react"

const TYPE_INFO: Record<ComponentType, { Icon: PhosphorIcon; order: number }> = {
  ModalUpdate: { Icon: PencilSimple, order: 1 },
  MasterDetails: { Icon: ListMagnifyingGlass, order: 2 },
  DoubleGrid: { Icon: ArrowsLeftRight, order: 3 },
  ModalCreate: { Icon: PlusCircle, order: 4 },
  ModalDelete: { Icon: Trash, order: 5 },
  Grid: { Icon: ListMagnifyingGlass, order: 6 }
}

interface ModalDerivedProps {
  open: boolean
  onClose: () => void
  derivedActions: GridDefinition[]
  contextRow?: Record<string, any>
  onChoose: (derivation: GridDefinition) => void
}

/** "O que dá para fazer com esta linha": as ações derivadas que o backend mandou no grid. */
export function ModalDerived({ open, onClose, derivedActions, onChoose }: ModalDerivedProps) {
  const items: ButtonListItem[] = [...derivedActions]
    .sort((a, b) => (TYPE_INFO[a.type]?.order ?? 9) - (TYPE_INFO[b.type]?.order ?? 9))
    .map((d) => ({
      key: d.name,
      text: d.nm_friendly,
      Icon: TYPE_INFO[d.type]?.Icon,
      danger: d.type === "ModalDelete",
      onClick: () => onChoose(d)
    }))

  return <Components.ButtonListModal open={open} onClose={onClose} title="O que você quer fazer?" items={items} />
}
