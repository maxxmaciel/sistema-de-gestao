import { PedidoActionsBar } from "@/components/CustomActions/PedidoActionsBar"
import type { Row } from "@/components/Grid/columns"
import type { MenuDataSchema } from "@/contexts/AppContext/interfaces"
import type { FC } from "react"

export interface PropsGridsAction {
  Resource: MenuDataSchema
  /** Linha selecionada no grid (já atualizada depois de um refetch). */
  rowSelected?: Row
  refetch: () => void
}

/**
 * Quando o genérico não basta: botões próprios na barra do grid de UMA tela (chave = nm_resource).
 * A tela continua sendo a página genérica; só ganha esse pedaço a mais.
 */
export const GenericGridActionsBar: Partial<Record<string, FC<PropsGridsAction>>> = {
  MD_PEDIDO: PedidoActionsBar
}
