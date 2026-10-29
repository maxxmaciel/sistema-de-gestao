import { CustomButton } from "@/components/CustomButton"
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material"
import type { Breakpoint } from "@mui/material"
import { X } from "@phosphor-icons/react"
import { ReactNode } from "react"

export interface ModalProps {
  open: boolean
  onClose?: () => void
  title: string
  /** Linha pequena abaixo do título. */
  subtitle?: string
  children?: ReactNode
  closeText?: string
  extraActions?: ReactNode
  maxWidth?: Breakpoint | false
  /** false = sem rodapé (a própria modal desenha os botões). */
  showFooter?: boolean
}

/** Moldura de TODAS as modais: título, X, conteúdo e rodapé com "Fechar" + ações extras. */
export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  closeText = "Fechar",
  extraActions,
  maxWidth = "md",
  showFooter = true
}: ModalProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth={maxWidth} scroll="paper">
      <DialogTitle sx={{ display: "flex", alignItems: "flex-start", gap: 2, pr: 1.5 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h6" component="span" sx={{ fontWeight: 700, display: "block" }} noWrap>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {onClose && (
          <IconButton aria-label="Fechar" onClick={onClose} size="small">
            <X size={18} />
          </IconButton>
        )}
      </DialogTitle>

      <DialogContent dividers>{children}</DialogContent>

      {showFooter && (
        <DialogActions sx={{ px: 3, py: 1.5, gap: 1 }}>
          {onClose && <CustomButton text={closeText} color="gray" onClick={onClose} />}
          {extraActions}
        </DialogActions>
      )}
    </Dialog>
  )
}
