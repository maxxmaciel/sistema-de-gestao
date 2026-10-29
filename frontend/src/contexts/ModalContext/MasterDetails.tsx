import { Components } from "@/components/Components"
import { CustomButton } from "@/components/CustomButton"
import { DerivableGridSection } from "@/components/DerivableGridSection"
import { openDerivation } from "@/components/ModalDerivation"
import type { GridDefinition, IMasterDetails } from "@/contexts/AppContext/interfaces"
import { useFetchData } from "@/hooks/useFetchData"
import { ensureComponent } from "@/lib/utils"
import { Alert, Box, LinearProgress } from "@mui/material"
import { PencilSimple } from "@phosphor-icons/react"

export interface MasterDetailsProps {
  derivation: GridDefinition
  params: Record<string, any>
  /** Callback do dono quando a modal fecha (os detalhes podem ter mudado -> refetch). */
  handleClose?: () => void
  onClose?: () => void
}

/**
 * Mestre + detalhe genérico. A resposta do MasterDetails traz:
 *   components[0] = cabeçalho (o registro mestre, type "MasterDetails")
 *   components[1] = grid de detalhe (type "Grid", com as ações derivadas de cada linha)
 *   create_inf    = o ModalCreate do "Adicionar"
 * O "Adicionar" já leva as chaves do mestre (ex.: cod_pedido), então o item nasce no pedido certo.
 */
export function MasterDetails({ derivation: d, params, handleClose, onClose }: MasterDetailsProps) {
  const { data, loading, error, refetch } = useFetchData<IMasterDetails>({
    url: "c",
    params: { a: "component", nm_component: d.name, ...params }
  })

  const header = data?.components.find((c) => c.type !== "Grid")
  const grid = ensureComponent(data?.components ?? [], "Grid")
  const headerRow = header?.data?.[0]

  // Ações do próprio registro mestre (ex.: "Editar pedido" no cabeçalho de "Itens do pedido").
  const headerActions = (header?.derived ?? []).filter((x) => x.type === "ModalUpdate")

  const close = () => {
    handleClose?.()
    onClose?.()
  }

  return (
    <Components.Modal
      open
      onClose={close}
      title={d.nm_friendly}
      maxWidth="lg"
    >
      {loading && !data && <LinearProgress sx={{ mb: 2 }} />}
      {error && <Alert severity="error">{error}</Alert>}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {header && (
          <Components.FieldSet
            title="Resumo"
            columns={header.columns}
            row={headerRow}
            actions={headerActions.map((action) => (
              <CustomButton
                key={action.name}
                text={action.nm_friendly}
                color="gray"
                size="small"
                Icon={PencilSimple}
                onClick={() => headerRow && openDerivation(action, headerRow, refetch)}
              />
            ))}
          />
        )}

        {grid && (
          <DerivableGridSection
            grid={grid}
            createInf={data?.create_inf}
            createParms={params}
            refetch={refetch}
            loading={loading}
            excludeDerivations={[d.name]}
            maxHeight={420}
          />
        )}
      </Box>
    </Components.Modal>
  )
}
