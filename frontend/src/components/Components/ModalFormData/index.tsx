import { CustomButton } from "@/components/CustomButton"
import { Check } from "@phosphor-icons/react"
import { useEffect, useState } from "react"
import type { IModalFormData } from ".."
import { FormData } from "../FormData"
import { Modal } from "../Modal"

/**
 * Modal + FormData com campos JÁ conhecidos (sem buscar nada). É a base do ModalFormDataFetch,
 * que só acrescenta "buscar o componente e montar os campos a partir dele".
 */
export function ModalFormData<T extends Record<string, any> = Record<string, any>>({
  open,
  onClose,
  title = "",
  subtitle,
  fields,
  initialStateProp,
  errors,
  onSubmit,
  confirmText = "Confirmar",
  maxWidth = "md",
  children
}: IModalFormData<T>) {
  const [form, setForm] = useState<T>((initialStateProp ?? {}) as T)
  const initialKey = JSON.stringify(initialStateProp ?? {})

  useEffect(() => {
    setForm((initialStateProp ?? {}) as T)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialKey])

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      maxWidth={maxWidth}
      extraActions={<CustomButton text={confirmText} color="green" Icon={Check} onClick={() => onSubmit(form)} />}
    >
      {children}
      <FormData<T> fields={fields} initialStateProp={initialStateProp} errors={errors} onChange={setForm} />
    </Modal>
  )
}
