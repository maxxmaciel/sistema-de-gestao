import { CustomButton } from "@/components/CustomButton"
import { Alert } from "@mui/material"
import { ArrowCounterClockwise } from "@phosphor-icons/react"
import { Modal } from "../Modal"

interface PromiseErrorModalProps {
  open: boolean
  message?: string
  title?: string
  onClose: () => void
  onRetry?: () => void
}

/** Erro de uma operação assíncrona, com "Tentar novamente" opcional. */
export function PromiseErrorModal({ open, message, title = "Algo deu errado", onClose, onRetry }: PromiseErrorModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      maxWidth="xs"
      extraActions={onRetry && <CustomButton text="Tentar novamente" Icon={ArrowCounterClockwise} onClick={onRetry} />}
    >
      <Alert severity="error">{message || "Erro desconhecido"}</Alert>
    </Modal>
  )
}
