/**
 * Kit de componentes genéricos. Nenhum deles conhece entidade (produto, cliente...): recebem
 * campos/colunas/URL e se montam. As telas usam como Components.X:
 *
 *   Components.Modal              moldura padrão de modal
 *   Components.FormData           formulário a partir de uma lista de FormField
 *   Components.ModalFormData      Modal + FormData (campos já conhecidos)
 *   Components.ModalFormDataFetch Modal + FormData com campos vindos de um componente do backend
 *   Components.FetchModal         executa uma request e mostra carregando/sucesso/erro
 *   Components.FieldSet           um registro em modo leitura
 *   Components.ButtonListModal    lista de ações numa modal
 *   Components.PromiseErrorModal  erro com "tentar novamente"
 */
import type { Breakpoint } from "@mui/material"
import type { ReactNode } from "react"
import { ButtonListModal } from "./ButtonListModal"
import { FetchModal } from "./FetchModal"
import { FieldSet } from "./FieldSet"
import { FormData } from "./FormData"
import { Modal } from "./Modal"
import { ModalFormData } from "./ModalFormData"
import { ModalFormDataFetch } from "./ModalFormDataFetch"
import { PromiseErrorModal } from "./PromiseModal"

/** Um campo de formulário: é o IColumn do backend com o que o form precisa a mais. */
export type FormField<T = Record<string, any>> = {
  key: keyof T & string
  label: string
  type: string
  hidden: boolean
  disabled: boolean
  helper: string
  /** Combo: colunas mostradas como texto da opção. */
  columns_nm: string[]
  /** Combo: nome do grid que fornece as opções. */
  derivation?: string
  /** Combo em cascata: só libera quando este campo estiver preenchido. */
  depends_on?: string
  enum?: string[]
  buildCell?: string
  value?: any
  validator?: Record<string, { type: string; value: any; message?: string }>
}

export type nullOrUndefined = null | undefined

export interface ResponseSuccess {
  success: boolean
}

/** Resposta padrão de leitura: { success, data: [...] }. */
export interface ResponseEXT<T> extends ResponseSuccess {
  data: T
  error?: string
  msg?: string | null
}

export interface IModalFormData<T extends Record<string, any> = Record<string, any>> {
  open: boolean
  onClose?: () => void
  title?: string
  subtitle?: string
  fields: FormField<T>[]
  initialStateProp?: Partial<T>
  errors?: Record<string, string>
  onSubmit: (data: T) => void
  confirmText?: string
  maxWidth?: Breakpoint | false
  children?: ReactNode
}

export type { UseFetchDataResult } from "@/hooks/useFetchData"

/** Estado inicial de um formulário: só as chaves dos campos, com os valores do registro. */
export const getInitialFormData = <T extends Record<string, any>>(fields: FormField<T>[], values: T): T =>
  fields.reduce((acc, field) => {
    acc[field.key] = values[field.key]
    return acc
  }, {} as T)

export const Components = {
  Modal,
  FormData,
  ModalFormData,
  ModalFormDataFetch,
  FetchModal,
  FieldSet,
  ButtonListModal,
  PromiseErrorModal
}
