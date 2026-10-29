import { CustomButton } from "@/components/CustomButton"
import type { IComponents } from "@/contexts/AppContext/interfaces"
import { RequestParams, useFetchData } from "@/hooks/useFetchData"
import { ensureFields } from "@/lib/utils"
import { Alert, Box, CircularProgress } from "@mui/material"
import type { Breakpoint } from "@mui/material"
import { Check } from "@phosphor-icons/react"
import type { Method } from "axios"
import { ReactNode, useEffect, useMemo, useRef, useState } from "react"
import type { FormField } from ".."
import { FormData } from "../FormData"
import { Modal } from "../Modal"

export interface ModalFormDataFetchProps<TFetchData, T extends Record<string, any> = Record<string, any>> {
  open: boolean
  onClose?: () => void
  title?: string
  subtitle?: string
  url: string
  params?: RequestParams
  method?: Method
  confirmText?: string
  maxWidth?: Breakpoint | false
  errors?: Record<string, string>
  children?: ReactNode
  /** Resposta do backend -> campos do formulário (normalmente via ensureFields). */
  buildFields: (data: TFetchData, ensure: typeof ensureFields) => FormField<T>[]
  /** Resposta do backend -> valores iniciais (normalmente data[0]). */
  buildInitialFormData: (data: TFetchData) => Record<string, any>
  onSubmit: (formData: T, data: TFetchData) => void
  onDataLoaded?: (data: TFetchData) => void
}

/**
 * Busca um componente e monta o formulário a partir da resposta. É o miolo do ModalCreate e do
 * ModalUpdate genéricos: eles só dizem QUAL componente e o que fazer no submit.
 */
export function ModalFormDataFetch<TFetchData extends IComponents, T extends Record<string, any> = Record<string, any>>({
  open,
  onClose,
  title = "",
  subtitle,
  url,
  params,
  method = "get",
  confirmText = "Salvar",
  maxWidth = "md",
  errors = {},
  children,
  buildFields,
  buildInitialFormData,
  onSubmit,
  onDataLoaded
}: ModalFormDataFetchProps<TFetchData, T>) {
  const { data, loading, error, refetch } = useFetchData<TFetchData>({ url, params, method })
  const [form, setForm] = useState<T>({} as T)

  useEffect(() => {
    if (data) onDataLoaded?.(data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  // Os builders costumam vir inline (identidade nova a cada render do pai). Se entrassem nas
  // dependências, um re-render do pai (ex.: mostrar erro de validação) voltaria o formulário ao
  // valor inicial. Campos e estado inicial só mudam quando chega resposta nova.
  const buildFieldsRef = useRef(buildFields)
  const buildInitialRef = useRef(buildInitialFormData)
  buildFieldsRef.current = buildFields
  buildInitialRef.current = buildInitialFormData

  const fields = useMemo(() => (data ? buildFieldsRef.current(data, ensureFields) : []), [data])
  const initialState = useMemo(() => (data ? (buildInitialRef.current(data) as T) : ({} as T)), [data])

  useEffect(() => {
    setForm(initialState)
  }, [initialState])

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      maxWidth={maxWidth}
      extraActions={
        <CustomButton
          text={confirmText}
          color="green"
          Icon={Check}
          id="submit_button"
          disabled={!data}
          onClick={() => data && onSubmit(form, data)}
        />
      }
    >
      {children}
      {loading && !data && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress size={32} />
        </Box>
      )}
      {error && (
        <Alert severity="error" action={<CustomButton text="Tentar novamente" color="gray" size="small" onClick={refetch} />}>
          {error}
        </Alert>
      )}
      {data && <FormData<T> fields={fields} initialStateProp={initialState} errors={errors} onChange={setForm} />}
    </Modal>
  )
}
