import { Components } from "@/components/Components"
import { CustomButton } from "@/components/CustomButton"
import type { GridDefinition, IComponents, IRespUpdate } from "@/contexts/AppContext/interfaces"
import { axiosPost, useFetchData } from "@/hooks/useFetchData"
import { parseUpdateResponse } from "@/lib/utils"
import { Alert, Box, LinearProgress } from "@mui/material"
import { Trash } from "@phosphor-icons/react"
import { useState } from "react"
import { toast } from "sonner"

export interface ModalDeleteProps {
  derivation: GridDefinition
  params: Record<string, any>
  closeModal?: () => void
  onClose?: () => void
}

/**
 * Exclusão genérica com "tem certeza?". O select do componente traz o resumo da linha; a SP
 * de exclusão responde linhas_afetadas = 0 quando recusa, e aí a modal continua aberta com o
 * motivo.
 *
 * Aqui a gravação usa axiosPost direto (e não FetchModal): o resultado aparece na própria
 * modal e o sucesso vira só um toast.
 */
export function ModalDelete({ derivation, params, closeModal, onClose }: ModalDeleteProps) {
  const { data, loading, error } = useFetchData<IComponents>({
    url: "c",
    params: { a: "component", nm_component: derivation.name, ...params }
  })
  const [sending, setSending] = useState(false)
  const [refusal, setRefusal] = useState<string>()

  const confirm = async () => {
    setSending(true)
    setRefusal(undefined)
    try {
      const response = await axiosPost<IRespUpdate>("c", {
        a: data?.caption?.component_update_action ?? "c_up",
        nm_component: derivation.name,
        ...params
      })
      const result = parseUpdateResponse(response?.data)
      if (!result.ok) {
        setRefusal(result.msg)
        return
      }
      toast.success(result.msg)
      closeModal?.()
      onClose?.()
    } catch (e) {
      setRefusal(e instanceof Error ? e.message : "Falha ao excluir")
    } finally {
      setSending(false)
    }
  }

  return (
    <Components.Modal
      open
      onClose={onClose}
      title={derivation.nm_friendly}
      maxWidth="sm"
      closeText="Cancelar"
      extraActions={
        <CustomButton text="Excluir" color="red" Icon={Trash} onClick={confirm} disabled={!data || sending} />
      }
    >
      {(loading || sending) && <LinearProgress sx={{ mb: 2 }} />}
      <Alert severity="warning" sx={{ mb: 2 }}>
        Tem certeza? A exclusão não pode ser desfeita.
      </Alert>
      {error && <Alert severity="error">{error}</Alert>}
      {data && <Components.FieldSet title="Registro" columns={data.columns} row={data.data?.[0]} />}
      {refusal && (
        <Box sx={{ mt: 2 }}>
          <Alert severity="error">{refusal}</Alert>
        </Box>
      )}
    </Components.Modal>
  )
}
