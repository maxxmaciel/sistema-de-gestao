import { List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material"
import type { Icon as PhosphorIcon } from "@phosphor-icons/react"
import { ReactNode } from "react"
import { Modal } from "../Modal"

export interface ButtonListItem {
  key: string
  text: string
  description?: ReactNode
  Icon?: PhosphorIcon
  danger?: boolean
  onClick: () => void
}

interface ButtonListModalProps {
  open: boolean
  title: string
  subtitle?: string
  header?: ReactNode
  items: ButtonListItem[]
  emptyText?: string
  onClose: () => void
}

/** Lista de botões numa modal (usada para escolher a ação derivada de uma linha). */
export function ButtonListModal({ open, title, subtitle, header, items, emptyText = "Nenhuma ação disponível", onClose }: ButtonListModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} subtitle={subtitle} maxWidth="sm">
      {header}
      {items.length === 0 && (
        <Typography color="text.secondary" sx={{ py: 2 }}>
          {emptyText}
        </Typography>
      )}
      <List disablePadding>
        {items.map(({ key, text, description, Icon, danger, onClick }) => (
          <ListItemButton
            key={key}
            onClick={onClick}
            sx={{ borderRadius: 2, mb: 0.5, color: danger ? "error.main" : undefined }}
          >
            {Icon && (
              <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
                <Icon size={22} weight="duotone" />
              </ListItemIcon>
            )}
            <ListItemText
              primary={text}
              secondary={description}
              slotProps={{ primary: { fontWeight: 600 }, secondary: { component: "div" } }}
            />
          </ListItemButton>
        ))}
      </List>
    </Modal>
  )
}
