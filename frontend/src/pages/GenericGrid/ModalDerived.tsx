import { Components } from "@/components/Components"
import type { ButtonListItem } from "@/components/Components/ButtonListModal"
import type { ComponentType, GridDefinition } from "@/contexts/AppContext/interfaces"
import { Typography } from "@mui/material"
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
export function ModalDerived({ open, onClose, derivedActions, contextRow, onChoose }: ModalDerivedProps) {
  const items: ButtonListItem[] = [...derivedActions]
    .sort((a, b) => (TYPE_INFO[a.type]?.order ?? 9) - (TYPE_INFO[b.type]?.order ?? 9))
    .map((d) => ({
      key: d.name,
      text: d.nm_friendly,
      Icon: TYPE_INFO[d.type]?.Icon,
      danger: d.type === "ModalDelete",
      description: (
        <span className="mono" style={{ fontSize: 12 }}>
          {d.type} · {d.name}({d.keys.map((k) => `${k}=${contextRow?.[k] ?? "?"}`).join(", ")})
        </span>
      ),
      onClick: () => onChoose(d)
    }))

  return (
    <Components.ButtonListModal
      open={open}
      onClose={onClose}
      title="Ações da linha"
      subtitle="derivadas pelo backend a partir das colunas do grid"
      items={items}
      header={
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          Nenhuma destas ações foi configurada nesta tela. O backend ofereceu cada componente cujos
          parâmetros existem nesta linha (exclusão só onde foi pendurada explicitamente).
        </Typography>
      }
    />
  )
}
