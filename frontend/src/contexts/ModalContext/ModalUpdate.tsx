import { Components } from "@/components/Components"
import { validateComponentForm } from "@/components/Zod"
import type { GridDefinition, IComponents, IRespUpdate } from "@/contexts/AppContext/interfaces"
import { parseUpdateResponse } from "@/lib/utils"
import { useRef, useState } from "react"

export interface ModalUpdateProps {
  /** A ação derivada escolhida na linha (nome, tipo, chaves). */
  derivation: GridDefinition
  /** Valores das chaves tirados da linha: { cod_produto: 3 }. */
  params: Record<string, any>
  /** Callback do dono (refetch) quando a alteração deu certo. */
  closeModal?: () => void
  onClose?: () => void
}

/**
 * Alteração genérica. Igual ao ModalCreate, mas o select recebe as chaves da linha e os campos
 * que não estão em caption.parms aparecem desabilitados.
 */
export function ModalUpdate({ derivation, params, closeModal, onClose }: ModalUpdateProps) {
  const [data, setData] = useState<IComponents>()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState<Record<string, any>>()
  const closeMode = useRef<"normal" | "refetch">("normal")

  return (
    <>
      {formData && (
        <Components.FetchModal<IRespUpdate>
          open
          title={derivation.nm_friendly}
          url="c"
          method="post"
          params={{
            a: data?.caption?.component_update_action || "c_up",
            nm_component: derivation.name,
            ...params,
            ...formData
          }}
          onClose={() => {
            if (closeMode.current === "refetch") {
              closeModal?.()
              onClose?.()
            } else {
              setFormData(undefined)
            }
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
        params={{ a: "component", nm_component: derivation.name, ...params }}
        title={derivation.nm_friendly}
        errors={errors}
        confirmText="Salvar alterações"
        onClose={onClose}
        onDataLoaded={setData}
        buildFields={(d, ensure) => ensure(d, d.caption?.parms ?? [])}
        buildInitialFormData={(d) => d.data?.[0] ?? {}}
        onSubmit={(form, d) => {
          const validation = validateComponentForm(form, d)
          if (validation) {
            setErrors(validation)
            return
          }
          setErrors({})
          setFormData(form)
        }}
      />
    </>
  )
}
