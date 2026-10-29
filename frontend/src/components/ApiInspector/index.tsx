import { CustomButton } from "@/components/CustomButton"
import { ApiTraceEntry, clearApiTrace, getApiTrace, subscribeApiTrace } from "@/lib/apiTrace"
import { Box, Chip, Collapse, Drawer, IconButton, Typography } from "@mui/material"
import { Trash, X } from "@phosphor-icons/react"
import { useState, useSyncExternalStore } from "react"

interface ApiInspectorProps {
  open: boolean
  onClose: () => void
}

const MAX_JSON = 20000

const pretty = (value: unknown) => {
  const text = JSON.stringify(value, null, 2) ?? String(value)
  return text.length > MAX_JSON ? `${text.slice(0, MAX_JSON)}\n... (cortado)` : text
}

/**
 * Inspetor de API: cada chamada feita pelas telas, com o que foi enviado e o JSON que voltou.
 * Serve para mostrar que a tela é só um intérprete da resposta do backend.
 */
export function ApiInspector({ open, onClose }: ApiInspectorProps) {
  const entries = useSyncExternalStore(subscribeApiTrace, getApiTrace)
  const [expanded, setExpanded] = useState<number | null>(null)

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{ zIndex: (t) => t.zIndex.drawer + 2 }}
      PaperProps={{ sx: { width: { xs: "100%", sm: 640 } } }}
    >
      <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider", display: "flex", alignItems: "center", gap: 1 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Inspetor de API
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Clique numa chamada para ver o que foi enviado e o JSON que voltou.
          </Typography>
        </Box>
        <CustomButton text="Limpar" color="gray" size="small" Icon={Trash} onClick={clearApiTrace} />
        <IconButton onClick={onClose} size="small" aria-label="Fechar">
          <X size={18} />
        </IconButton>
      </Box>

      <Box sx={{ overflow: "auto", flex: 1 }}>
        {entries.length === 0 && (
          <Typography color="text.secondary" sx={{ p: 3 }}>
            Nenhuma chamada ainda. Navegue pelas telas e volte aqui.
          </Typography>
        )}
        {entries.map((entry) => (
          <TraceRow
            key={entry.id}
            entry={entry}
            expanded={expanded === entry.id}
            onToggle={() => setExpanded(expanded === entry.id ? null : entry.id)}
          />
        ))}
      </Box>
    </Drawer>
  )
}

function TraceRow({ entry, expanded, onToggle }: { entry: ApiTraceEntry; expanded: boolean; onToggle: () => void }) {
  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Box
        onClick={onToggle}
        sx={{ px: 2, py: 1.25, cursor: "pointer", display: "flex", alignItems: "center", gap: 1, "&:hover": { bgcolor: "grey.50" } }}
      >
        <Chip size="small" label={entry.method} color={entry.method === "GET" ? "primary" : "success"} sx={{ minWidth: 56 }} />
        {entry.action && <Chip size="small" variant="outlined" label={`a=${entry.action}`} className="mono" />}
        <Typography variant="body2" sx={{ fontWeight: 700, flex: 1, minWidth: 0 }} noWrap className="mono">
          {entry.nmComponent ?? entry.url}
        </Typography>
        <Typography variant="caption" color={entry.ok || entry.status === "cancelada" ? "text.secondary" : "error.main"}>
          {entry.status} · {entry.durationMs ?? "?"} ms · {entry.at.toLocaleTimeString("pt-BR")}
        </Typography>
      </Box>
      <Collapse in={expanded} unmountOnExit>
        <Box sx={{ px: 2, pb: 2, display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography variant="caption" className="mono" sx={{ wordBreak: "break-all" }}>
            {entry.method} {entry.url}
          </Typography>
          <Typography variant="overline">Enviado</Typography>
          <pre className="code-block">{pretty(entry.payload)}</pre>
          <Typography variant="overline">Resposta</Typography>
          <pre className="code-block" style={{ maxHeight: 420 }}>
            {pretty(entry.response)}
          </pre>
        </Box>
      </Collapse>
    </Box>
  )
}
