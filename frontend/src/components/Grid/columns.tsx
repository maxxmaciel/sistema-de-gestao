import type { IColumn } from "@/contexts/AppContext/interfaces"
import { Std } from "@/lib/std"
import { Checkbox, Chip, IconButton, Link, Tooltip } from "@mui/material"
import { DotsThreeVertical } from "@phosphor-icons/react"
import type { ColumnDef, Row as TableRow } from "@tanstack/react-table"
import { ReactNode } from "react"

export type Row = Record<string, any>

export interface ColumnMeta {
  type?: string
  align?: "left" | "right" | "center"
}

const NUMERIC_TYPES = ["int", "double", "monetario"]

const STATUS_COLORS: Record<string, "default" | "info" | "success" | "primary" | "error" | "warning"> = {
  aberto: "info",
  pago: "success",
  enviado: "primary",
  cancelado: "error"
}

/** Como um valor aparece na tela, pelo tipo que o backend mandou. Usado no grid e no FieldSet. */
export function renderValue(column: Pick<IColumn, "type" | "enum">, value: unknown): ReactNode {
  if (value === null || value === undefined || value === "") {
    return <span style={{ color: "#9ca3af" }}>—</span>
  }

  switch (column.type) {
    case "boolean":
      return Std.toBoolean(value) ? (
        <Chip label="Sim" size="small" color="success" variant="outlined" />
      ) : (
        <Chip label="Não" size="small" variant="outlined" />
      )
    case "enum":
      return (
        <Chip
          label={String(value)}
          size="small"
          color={STATUS_COLORS[Std.normalizeText(value)] ?? "default"}
          variant="filled"
        />
      )
    case "email":
      return (
        <Link href={`mailto:${value}`} underline="hover" onClick={(e) => e.stopPropagation()}>
          {String(value)}
        </Link>
      )
    case "int":
      return String(value)
    default:
      return Std.formatByType(value, column.type)
  }
}

/** Coluna do backend -> coluna do TanStack. Uma função para todo grid do sistema. */
export function buildGridColumnDef(column: IColumn): ColumnDef<Row, unknown> {
  const isNumeric = NUMERIC_TYPES.includes(column.type ?? "")
  return {
    id: column.field,
    accessorKey: column.field,
    header: column.headerName,
    meta: { type: column.type, align: isNumeric ? "right" : "left" } satisfies ColumnMeta,
    sortingFn: isNumeric ? "basic" : "alphanumeric",
    cell: ({ getValue }) => renderValue(column, getValue())
  }
}

/** Botão "⋮" da linha: abre a lista de ações derivadas daquela linha. */
export function buildRowActionsColumn(onClick: (row: Row) => void): ColumnDef<Row, unknown> {
  return {
    id: "__actions",
    header: "",
    enableSorting: false,
    enableGlobalFilter: false,
    meta: { align: "center" } satisfies ColumnMeta,
    cell: ({ row }) => (
      <Tooltip title="Ações desta linha">
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation()
            onClick(row.original)
          }}
        >
          <DotsThreeVertical size={18} weight="bold" />
        </IconButton>
      </Tooltip>
    )
  }
}

export interface RowSelectionColumnOptions {
  isSelected: (row: Row) => boolean
  onToggle: (row: Row) => void
  onToggleAll: (rows: Row[], checked: boolean) => void
}

/** Checkbox de seleção (usado no DoubleGrid). */
export function buildRowSelectionColumn({
  isSelected,
  onToggle,
  onToggleAll
}: RowSelectionColumnOptions): ColumnDef<Row, unknown> {
  return {
    id: "__select",
    enableSorting: false,
    enableGlobalFilter: false,
    meta: { align: "center" } satisfies ColumnMeta,
    header: ({ table }) => {
      const rows = table.getFilteredRowModel().rows.map((r: TableRow<Row>) => r.original)
      const selectedCount = rows.filter(isSelected).length
      return (
        <Checkbox
          size="small"
          checked={rows.length > 0 && selectedCount === rows.length}
          indeterminate={selectedCount > 0 && selectedCount < rows.length}
          onChange={(_, checked) => onToggleAll(rows, checked)}
        />
      )
    },
    cell: ({ row }) => (
      <Checkbox
        size="small"
        checked={isSelected(row.original)}
        onClick={(e) => e.stopPropagation()}
        onChange={() => onToggle(row.original)}
      />
    )
  }
}
