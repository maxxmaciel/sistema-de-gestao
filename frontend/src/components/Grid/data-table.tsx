import { Std } from "@/lib/std"
import {
  Box,
  Chip,
  InputAdornment,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography
} from "@mui/material"
import { CaretDown, CaretUp, MagnifyingGlass } from "@phosphor-icons/react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row as TanstackRow,
  SortingState,
  useReactTable,
  VisibilityState
} from "@tanstack/react-table"
import { ReactNode, useEffect, useMemo, useState } from "react"
import type { ColumnMeta, Row } from "./columns"

export interface GridProps {
  columns: ColumnDef<Row, unknown>[]
  data: Row[]
  title?: string
  subtitle?: ReactNode
  /** { campo: false } esconde a coluna (vem do hidden do backend). */
  visibilityColls?: VisibilityState
  onRowSelect?: (row: Row) => void
  onDoubleClick?: (row: TanstackRow<Row>) => void
  extraAction?: ReactNode
  loading?: boolean
  GridIdName?: string
  getRowId?: (row: Row, index: number) => string
  pageSize?: number
  maxHeight?: number | string
  emptyText?: string
  /** Esconde busca e paginação (listas pequenas, ex.: DoubleGrid). */
  compact?: boolean
}

/**
 * O grid de todo o sistema: busca sem acento em todas as colunas (inclusive no valor formatado,
 * "29/10" acha a data), ordenação por clique no cabeçalho, paginação e seleção de linha.
 * Não sabe nada de entidade: recebe colunas e linhas.
 */
export function Grid({
  columns,
  data,
  title,
  subtitle,
  visibilityColls,
  onRowSelect,
  onDoubleClick,
  extraAction,
  loading,
  GridIdName,
  getRowId,
  pageSize = 10,
  maxHeight = 560,
  emptyText = "Nenhum registro encontrado",
  compact = false
}: GridProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(visibilityColls ?? {})
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize })
  const [selectedId, setSelectedId] = useState<string>()

  useEffect(() => {
    setColumnVisibility(visibilityColls ?? {})
  }, [visibilityColls])

  const columnTypes = useMemo(() => {
    const types: Record<string, string | undefined> = {}
    columns.forEach((c) => {
      if (c.id) types[c.id] = (c.meta as ColumnMeta | undefined)?.type
    })
    return types
  }, [columns])

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter, columnVisibility, pagination },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getRowId,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: compact ? undefined : getPaginationRowModel(),
    getColumnCanGlobalFilter: (column) => column.columnDef.enableGlobalFilter !== false,
    globalFilterFn: (row, columnId, filterValue) => {
      const raw = row.getValue(columnId)
      const query = Std.normalizeText(filterValue)
      return (
        Std.normalizeText(raw).includes(query) ||
        Std.normalizeText(Std.formatByType(raw, columnTypes[columnId])).includes(query)
      )
    }
  })

  const rows = table.getRowModel().rows
  const totalFiltered = table.getFilteredRowModel().rows.length

  return (
    <Paper variant="outlined" id={GridIdName} sx={{ overflow: "hidden" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1.5,
          px: 2,
          py: 1.5,
          borderBottom: "1px solid",
          borderColor: "divider"
        }}
      >
        <Box sx={{ flex: 1, minWidth: 160 }}>
          {title && (
            <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography variant="caption" color="text.secondary" component="div">
              {subtitle}
            </Typography>
          )}
        </Box>
        {!compact && (
          <TextField
            size="small"
            placeholder="Buscar..."
            value={globalFilter}
            onChange={(e) => {
              setGlobalFilter(e.target.value)
              setPagination((p) => ({ ...p, pageIndex: 0 }))
            }}
            sx={{ width: { xs: "100%", sm: 240 } }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <MagnifyingGlass size={16} />
                  </InputAdornment>
                )
              }
            }}
          />
        )}
        <Chip size="small" label={`${totalFiltered} ${totalFiltered === 1 ? "registro" : "registros"}`} />
        {extraAction && <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>{extraAction}</Box>}
      </Box>

      {loading ? <LinearProgress sx={{ height: 2 }} /> : <Box sx={{ height: 2 }} />}

      <TableContainer sx={{ maxHeight }}>
        <Table size="small" stickyHeader>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const meta = header.column.columnDef.meta as ColumnMeta | undefined
                  const sorted = header.column.getIsSorted()
                  const canSort = header.column.getCanSort()
                  return (
                    <TableCell
                      key={header.id}
                      align={meta?.align ?? "left"}
                      onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                      sx={{
                        cursor: canSort ? "pointer" : "default",
                        userSelect: "none",
                        whiteSpace: "nowrap",
                        width: header.column.id.startsWith("__") ? 48 : undefined
                      }}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {sorted === "asc" && <CaretUp size={12} weight="bold" style={{ marginLeft: 4 }} />}
                      {sorted === "desc" && <CaretDown size={12} weight="bold" style={{ marginLeft: 4 }} />}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                hover
                selected={selectedId === row.id}
                onClick={() => {
                  setSelectedId(row.id)
                  onRowSelect?.(row.original)
                }}
                onDoubleClick={() => onDoubleClick?.(row)}
                sx={{ cursor: onDoubleClick ? "pointer" : "default" }}
              >
                {row.getVisibleCells().map((cell) => {
                  const meta = cell.column.columnDef.meta as ColumnMeta | undefined
                  return (
                    <TableCell key={cell.id} align={meta?.align ?? "left"} sx={{ whiteSpace: "nowrap" }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={table.getVisibleLeafColumns().length} align="center" sx={{ py: 5, color: "text.secondary" }}>
                  {loading ? "Carregando..." : emptyText}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {!compact && (
        <TablePagination
          component="div"
          count={totalFiltered}
          page={pagination.pageIndex}
          rowsPerPage={pagination.pageSize}
          rowsPerPageOptions={Array.from(new Set([pageSize, 10, 25, 50, 100])).sort((a, b) => a - b)}
          onPageChange={(_, page) => setPagination((p) => ({ ...p, pageIndex: page }))}
          onRowsPerPageChange={(e) => setPagination({ pageIndex: 0, pageSize: Number(e.target.value) })}
          labelRowsPerPage="Linhas por página"
          labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
        />
      )}
    </Paper>
  )
}
