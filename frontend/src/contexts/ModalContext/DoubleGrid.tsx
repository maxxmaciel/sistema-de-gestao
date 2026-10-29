import { Components } from "@/components/Components"
import { CustomButton } from "@/components/CustomButton"
import { buildGridColumnDef, buildRowSelectionColumn, Row } from "@/components/Grid/columns"
import { Grid } from "@/components/Grid/data-table"
import type { GridDefinition, IComponents, IMasterDetails, IRespUpdate } from "@/contexts/AppContext/interfaces"
import { useFetchData } from "@/hooks/useFetchData"
import { ensureAllPk, parseUpdateResponse, pick, rowKeyFromPk } from "@/lib/utils"
import { Alert, Box, Chip, IconButton, LinearProgress, Tooltip, Typography } from "@mui/material"
import { ArrowCounterClockwise, ArrowLeft, ArrowRight, FloppyDisk } from "@phosphor-icons/react"
import { useEffect, useMemo, useState } from "react"

export interface DoubleGridProps {
  derivation: GridDefinition
  params: Record<string, any>
  handleClose?: () => void
  onClose?: () => void
}

/**
 * Vínculo N:N genérico: esquerda = disponíveis (SourceGrid), direita = vinculados (LinkedGrid).
 * Mover é só no navegador; "Salvar" manda a lista COMPLETA da direita em "keys" e o backend
 * substitui os vínculos (setDelete + setInsert para cada item).
 * Duplo clique numa linha também move.
 */
export function DoubleGrid({ derivation: d, params, handleClose, onClose }: DoubleGridProps) {
  const { data, loading, error, refetch } = useFetchData<IMasterDetails>({
    url: "c",
    params: { a: "component", nm_component: d.name, ...params }
  })

  const header = data?.components.find((c) => c.type === "DoubleGrid")
  const sourceGrid = data?.components.find((c) => c.type === "SourceGrid")
  const linkedGrid = data?.components.find((c) => c.type === "LinkedGrid")
  const allowUnlink = header?.caption?.allow_unlink ?? true

  const pkFields = useMemo(() => ensureAllPk(linkedGrid), [linkedGrid])
  const idOf = (row: Row) => rowKeyFromPk(row, pkFields)

  const [sourceRows, setSourceRows] = useState<Row[]>([])
  const [linkedRows, setLinkedRows] = useState<Row[]>([])
  const [selectedSource, setSelectedSource] = useState<Set<string>>(new Set())
  const [selectedLinked, setSelectedLinked] = useState<Set<string>>(new Set())
  const [saving, setSaving] = useState(false)

  const reset = () => {
    setSourceRows(sourceGrid?.data ?? [])
    setLinkedRows(linkedGrid?.data ?? [])
    setSelectedSource(new Set())
    setSelectedLinked(new Set())
  }

  useEffect(reset, [data]) // eslint-disable-line react-hooks/exhaustive-deps

  const originalIds = useMemo(() => (linkedGrid?.data ?? []).map(idOf).sort().join("|"), [linkedGrid, pkFields]) // eslint-disable-line react-hooks/exhaustive-deps
  const dirty = linkedRows.map(idOf).sort().join("|") !== originalIds

  const move = (from: "source" | "linked", only?: Row) => {
    const selected = from === "source" ? selectedSource : selectedLinked
    const origin = from === "source" ? sourceRows : linkedRows
    const moving = only ? [only] : origin.filter((r) => selected.has(idOf(r)))
    if (!moving.length) return
    const movingIds = new Set(moving.map(idOf))
    const remaining = origin.filter((r) => !movingIds.has(idOf(r)))

    if (from === "source") {
      setSourceRows(remaining)
      setLinkedRows((prev) => [...prev, ...moving])
      setSelectedSource(new Set())
    } else {
      setLinkedRows(remaining)
      setSourceRows((prev) => [...prev, ...moving])
      setSelectedLinked(new Set())
    }
  }

  const close = () => {
    handleClose?.()
    onClose?.()
  }

  return (
    <>
      {saving && (
        <Components.FetchModal<IRespUpdate>
          open
          title={`Salvar ${d.nm_friendly}`}
          url="c"
          method="post"
          params={{
            a: "c_up",
            nm_component: d.name,
            ...params,
            keys: JSON.stringify(linkedRows.map((r) => pick(r, pkFields)))
          }}
          onClose={() => {
            setSaving(false)
            refetch()
          }}
          onFetchSuccess={(fetch, setSuccess, _close, setError) => {
            const result = parseUpdateResponse(fetch.data)
            if (result.ok) setSuccess(result.msg)
            else setError(result.msg)
          }}
        />
      )}

      <Components.Modal
        open
        onClose={close}
        title={d.nm_friendly}
        maxWidth="xl"
        extraActions={
          <>
            <CustomButton text="Desfazer" color="gray" Icon={ArrowCounterClockwise} onClick={reset} disabled={!dirty} />
            <CustomButton text="Salvar vínculos" color="green" Icon={FloppyDisk} onClick={() => setSaving(true)} disabled={!dirty} />
          </>
        }
      >
        {loading && !data && <LinearProgress sx={{ mb: 2 }} />}
        {error && <Alert severity="error">{error}</Alert>}

        {header && <Components.FieldSet title="Registro" columns={header.columns} row={header.data?.[0]} />}

        <Box
          sx={{
            mt: 2,
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr auto 1fr" },
            gap: 2,
            alignItems: "start"
          }}
        >
          <SelectableGrid
            grid={sourceGrid}
            rows={sourceRows}
            selected={selectedSource}
            setSelected={setSelectedSource}
            idOf={idOf}
            onDoubleClick={(row) => move("source", row)}
            hint="Duplo clique ou selecione e use a seta para vincular"
          />

          <Box sx={{ display: "flex", flexDirection: { xs: "row", md: "column" }, justifyContent: "center", gap: 1, pt: { md: 12 } }}>
            <Tooltip title="Vincular selecionados">
              <span>
                <IconButton color="primary" onClick={() => move("source")} disabled={!selectedSource.size} sx={{ border: 1, borderColor: "divider" }}>
                  <ArrowRight size={20} weight="bold" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title={allowUnlink ? "Desvincular selecionados" : "Este vínculo não permite desvincular"}>
              <span>
                <IconButton color="primary" onClick={() => move("linked")} disabled={!allowUnlink || !selectedLinked.size} sx={{ border: 1, borderColor: "divider" }}>
                  <ArrowLeft size={20} weight="bold" />
                </IconButton>
              </span>
            </Tooltip>
          </Box>

          <SelectableGrid
            grid={linkedGrid}
            rows={linkedRows}
            selected={selectedLinked}
            setSelected={setSelectedLinked}
            idOf={idOf}
            onDoubleClick={allowUnlink ? (row) => move("linked", row) : undefined}
            hint={dirty ? "Alterações não salvas" : "Vinculados hoje"}
            highlight={dirty}
          />
        </Box>

        {dirty && (
          <Typography variant="caption" color="warning.main" sx={{ display: "block", mt: 1.5 }}>
            Há alterações pendentes. "Salvar vínculos" envia a lista da direita inteira.
          </Typography>
        )}
      </Components.Modal>
    </>
  )
}

interface SelectableGridProps {
  grid?: IComponents
  rows: Row[]
  selected: Set<string>
  setSelected: (next: Set<string>) => void
  idOf: (row: Row) => string
  onDoubleClick?: (row: Row) => void
  hint: string
  highlight?: boolean
}

function SelectableGrid({ grid, rows, selected, setSelected, idOf, onDoubleClick, hint, highlight }: SelectableGridProps) {
  const columns = useMemo(
    () => [
      buildRowSelectionColumn({
        isSelected: (row) => selected.has(idOf(row)),
        onToggle: (row) => {
          const next = new Set(selected)
          const id = idOf(row)
          if (next.has(id)) next.delete(id)
          else next.add(id)
          setSelected(next)
        },
        onToggleAll: (visibleRows, checked) => {
          const next = new Set(selected)
          visibleRows.forEach((row) => (checked ? next.add(idOf(row)) : next.delete(idOf(row))))
          setSelected(next)
        }
      }),
      ...(grid?.columns ?? []).map(buildGridColumnDef)
    ],
    [grid?.columns, selected, setSelected, idOf]
  )
  const visibility = useMemo(
    () => Object.fromEntries((grid?.columns ?? []).map((c) => [c.field, !c.hidden])),
    [grid?.columns]
  )

  return (
    <Grid
      title={grid?.caption?.nm_friendly}
      subtitle={
        <span>
          {hint} {highlight && <Chip size="small" color="warning" label="pendente" sx={{ height: 18, ml: 0.5 }} />}
        </span>
      }
      columns={columns}
      data={rows}
      visibilityColls={visibility}
      getRowId={(row) => idOf(row)}
      onDoubleClick={onDoubleClick ? (row) => onDoubleClick(row.original) : undefined}
      pageSize={8}
      maxHeight={420}
    />
  )
}
