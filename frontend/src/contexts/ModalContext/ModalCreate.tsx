import { Components } from "@/components/Components"
import { validateComponentForm } from "@/components/Zod"
import type { IComponents, IRespUpdate } from "@/contexts/AppContext/interfaces"
import { parseUpdateResponse } from "@/lib/utils"
import { useRef, useState } from "react"

export interface ModalCreateProps {
  /** Callback do dono (ex.: refetch do grid) — chamado quando a inclusão deu certo. */
  handleCloseModal?: () => void
  /** Injetado pelo ModalRenderer: tira a modal da pilha. */
  onClose?: () => void
  modalCreate: {
    component: string
    nm_friendly: string
    servlet?: string
    action?: string
  }
  /** Valores que já chegam preenchidos (ex.: o pedido de onde o "Adicionar item" foi aberto). */
  parms?: Record<string, any>
}

/**
 * Inclusão genérica, para QUALQUER ModalCreate do backend:
 *  1. ModalFormDataFetch busca o componente (a=component) -> colunas do S_X_DEF + caption.parms
 *  2. o formulário se monta sozinho (ensureFields) com os valores padrão + parms
 *  3. ao confirmar, valida com o Zod montado das regras do backend
 *  4. FetchModal grava (a=c_up) e mostra a msg da SP
 */
export function ModalCreate({ handleCloseModal, onClose, parms = {}, modalCreate }: ModalCreateProps) {
  const [data, setData] = useState<IComponents>()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [createGeneric, setCreateGeneric] = useState<{ show: boolean; form_data?: Record<string, any> }>({ show: false })
  const closeMode = useRef<"normal" | "refetch">("normal")

  const closeWithRefetch = () => {
    handleCloseModal?.()
    onClose?.()
  }

  return (
    <>
      {createGeneric.show && (
        <Components.FetchModal<IRespUpdate>
          open
          title={modalCreate.nm_friendly}
          url={modalCreate.servlet || "c"}
          method="post"
          params={{
            a: modalCreate.action || data?.caption?.component_update_action || "c_up",
            nm_component: modalCreate.component,
            ...createGeneric.form_data
          }}
          onClose={() => {
            if (closeMode.current === "refetch") closeWithRefetch()
            else setCreateGeneric({ show: false })
          }}
          onFetchSuccess={(fetch, setSuccess, _close, setError) => {
            const result = parseUpdateResponse(fetch.data)
            if (!result.ok) {
              setError(result.msg)
              return
            }
            setSuccess(result.msg)
            closeMode.current = "refetch"
          }}
        />
      )}

      <Components.ModalFormDataFetch<IComponents>
        open
        url="c"
        params={{ a: "component", nm_component: modalCreate.component, ...parms }}
        title={modalCreate.nm_friendly}
        errors={errors}
        confirmText="Salvar"
        onClose={onClose}
        onDataLoaded={setData}
        buildFields={(d, ensure) => ensure(d, d.caption?.parms ?? [])}
        buildInitialFormData={(d) => ({ ...d.data?.[0], ...parms })}
        onSubmit={(form, d) => {
          const validation = validateComponentForm(form, d)
          if (validation) {
            setErrors(validation)
            return
          }
          setErrors({})
          setCreateGeneric({ show: true, form_data: form })
        }}
      />
    </>
  )
}
