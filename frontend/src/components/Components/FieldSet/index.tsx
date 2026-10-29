import { renderValue } from "@/components/Grid/columns"
import type { IColumn } from "@/contexts/AppContext/interfaces"
import { Box, Paper, Typography } from "@mui/material"
import { ReactNode } from "react"

interface FieldSetProps {
  columns: IColumn[]
  row?: Record<string, any>
  title?: string
  /** Botões à direita do título (ex.: ações derivadas do registro mestre). */
  actions?: ReactNode
}

/** Um registro em modo leitura (rótulo: valor). Cabeçalho do MasterDetails/DoubleGrid e resumo da exclusão. */
export function FieldSet({ columns, row, title, actions }: FieldSetProps) {
  const visible = columns.filter((c) => !c.hidden)
  return (
    <Paper variant="outlined" sx={{ p: 2, bgcolor: "grey.50" }}>
      {(title || actions) && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5, flexWrap: "wrap" }}>
          {title && (
            <Typography variant="overline" color="text.secondary" sx={{ flex: 1, lineHeight: 1.4 }}>
              {title}
            </Typography>
          )}
          {actions}
        </Box>
      )}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, minmax(0, 1fr))" },
          gap: 2
        }}
      >
        {visible.map((col) => (
          <Box key={col.field} sx={{ minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary" component="div">
              {col.headerName}
            </Typography>
            <Typography variant="body2" component="div" sx={{ fontWeight: 600, overflowWrap: "anywhere" }}>
              {renderValue(col, row?.[col.field])}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  )
}
