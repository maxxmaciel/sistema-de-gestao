import { CustomButton } from "@/components/CustomButton"
import { buildGridColumnDef, buildRowActionsColumn, Row } from "@/components/Grid/columns"
import { Grid } from "@/components/Grid/data-table"
import { openDerivation } from "@/components/ModalDerivation"
import type { GridDefinition, IComponents, ICreateInfo } from "@/contexts/AppContext/interfaces"
import { Modais } from "@/contexts/ModalContext/ModalManager"
import { ensureAllPk, rowKeyFromPk } from "@/lib/utils"
import { ModalDerived } from "@/pages/GenericGrid/ModalDerived"
import { Plus } from "@phosphor-icons/react"
import { ReactNode, useCallback, useMemo, useState } from "react"

interface DerivableGridSectionProps {
  grid?: IComponents
  /** Botão "Adicionar" (create_inf do MasterDetails). */
  createInf?: ICreateInfo
  /** Valores que o "Adicionar" já leva preenchidos (ex.: as chaves do mestre). */
  createParms?: Record<string, any>
  refetch: () => void
  loading?: boolean
  title?: string
  subtitle?: ReactNode
  /** Ações que não fazem sentido aqui (ex.: o próprio mestre-detalhe que está aberto). */
  excludeDerivations?: string[]
  maxHeight?: number | string
  /** Botões próprios da tela (ver CustomizedComponents), ao lado do "Adicionar". */
  renderExtraActions?: (ctx: { rowSelected?: Row; refetch: () => void }) => ReactNode
}

/**
 * Grid + "Adicionar" + ações derivadas de linha. É a mesma peça na tela do menu e dentro de
 * qualquer MasterDetails: só muda o componente que chega.
 */
export function DerivableGridSection({
  grid,
  createInf,
  createParms,
  refetch,
  loading,
  title,
  subtitle,
  excludeDerivations = [],
  maxHeight,
  renderExtraActions
}: DerivableGridSectionProps) {
  const [rowSelected, setRowSelected] = useState<Row>()
  const [derivedOpen, setDerivedOpen] = useState(false)

  const derived = useMemo<GridDefinition[]>(
    () => (grid?.derived ?? []).filter((d) => !excludeDerivations.includes(d.name)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [grid?.derived, excludeDerivations.join("|")]
  )
  const allPk = useMemo(() => ensureAllPk(grid), [grid])

  // A linha guardada é a do clique; depois de um refetch, troca pela versão nova (mesma chave),
  // senão um botão condicional continuaria vendo o status antigo.
  const currentRow = useMemo(() => {
    if (!rowSelected) return undefined
    const key = rowKeyFromPk(rowSelected, allPk)
    return grid?.data.find((row) => rowKeyFromPk(row, allPk) === key)
  }, [grid?.data, rowSelected, allPk])

  const openActions = useCallback((row: Row) => {
    setRowSelected(row)
    setDerivedOpen(true)
  }, [])

  const columns = useMemo(
    () => [
      ...(derived.length ? [buildRowActionsColumn(openActions)] : []),
      ...(grid?.columns ?? []).map(buildGridColumnDef)
    ],
    [grid?.columns, derived.length, openActions]
  )

  const visibility = useMemo(
    () => Object.fromEntries((grid?.columns ?? []).map((c) => [c.field, !c.hidden])),
    [grid?.columns]
  )

  const handleAdd = () => {
    if (!createInf) return
    Modais.ModalCreate.open({
      id: createInf.nm_create,
      modalCreate: { component: createInf.nm_create, nm_friendly: createInf.nm_friendly_create },
      parms: createParms,
      handleCloseModal: refetch
    })
  }

  return (
    <>
      <Grid
        title={title ?? grid?.caption?.nm_friendly}
        subtitle={subtitle}
        columns={columns}
        data={grid?.data ?? []}
        visibilityColls={visibility}
        loading={loading}
        maxHeight={maxHeight}
        GridIdName={grid?.name ? `${grid.name.toLowerCase()}_grid` : undefined}
        getRowId={(row, index) => rowKeyFromPk(row, allPk, index)}
        onRowSelect={setRowSelected}
        onDoubleClick={(row) => derived.length > 0 && openActions(row.original)}
        extraAction={
          <>
            {renderExtraActions?.({ rowSelected: currentRow, refetch })}
            {createInf && (
              <CustomButton text="Adicionar" color="green" Icon={Plus} onClick={handleAdd} id="button_add" />
            )}
          </>
        }
      />

      <ModalDerived
        open={derivedOpen}
        onClose={() => setDerivedOpen(false)}
        derivedActions={derived}
        contextRow={rowSelected}
        onChoose={(d) => {
          setDerivedOpen(false)
          if (rowSelected) openDerivation(d, rowSelected, refetch)
        }}
      />
    </>
  )
}
