import type { GridDefinition } from "@/contexts/AppContext/interfaces"
import { Modais } from "@/contexts/ModalContext/ModalManager"
import { pick } from "@/lib/utils"

/**
 * Abre a ação derivada escolhida numa linha. O backend diz o TIPO (nome da classe Java) e as
 * CHAVES; aqui o tipo escolhe a modal genérica e as chaves saem da linha:
 *
 *   { name: "U_PRODUTO", type: "ModalUpdate", keys: ["cod_produto"] } + linha { cod_produto: 3, ... }
 *     -> Modais.ModalUpdate.open({ derivation, params: { cod_produto: 3 } })
 *
 * onChanged roda quando algo pode ter mudado (gravou, ou fechou um mestre-detalhe) -> refetch.
 */
export function openDerivation(derivation: GridDefinition, row: Record<string, any>, onChanged?: () => void) {
  const params = pick(row, derivation.keys)
  const id = derivation.name

  switch (derivation.type) {
    case "ModalUpdate":
      Modais.ModalUpdate.open({ id, derivation, params, closeModal: onChanged })
      break
    case "ModalDelete":
      Modais.ModalDelete.open({ id, derivation, params, closeModal: onChanged })
      break
    case "MasterDetails":
      Modais.MasterDetails.open({ id, derivation, params, handleClose: onChanged })
      break
    case "DoubleGrid":
      Modais.DoubleGrid.open({ id, derivation, params, handleClose: onChanged })
      break
    case "ModalCreate":
      Modais.ModalCreate.open({
        id,
        modalCreate: { component: derivation.name, nm_friendly: derivation.nm_friendly },
        parms: params,
        handleCloseModal: onChanged
      })
      break
  }
}
