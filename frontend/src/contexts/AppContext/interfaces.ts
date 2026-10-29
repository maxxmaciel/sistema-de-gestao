// Contrato JSON com o backend (chaves em resources/PARM.java).

export interface IValidator {
  type: string
  value: any
  message?: string
}

/** Coluna como o backend descreve (Col do FIELD + metadata do SELECT). */
export interface IColumn {
  field: string
  headerName: string
  pk?: boolean
  hidden?: boolean
  type?: string
  helper?: string
  showFilter?: boolean
  validator?: Record<string, IValidator>
  enum?: string[]
  buildCell?: string
}

export type ComponentType =
  | "Grid"
  | "ModalCreate"
  | "ModalUpdate"
  | "ModalDelete"
  | "MasterDetails"
  | "DoubleGrid"

/** Ação derivada: um componente que "cabe" numa linha porque ela tem todas as suas chaves. */
export interface GridDefinition {
  keys: string[]
  nm_friendly: string
  parms?: string[]
  name: string
  type: ComponentType
  combos?: ICombos[]
  component_update_action?: string
}

export interface ICombos {
  /** Nome do GRID que fornece as opções. */
  name: string
  column_key: string
  columns_nm: string[]
  nm_friendly: string
  type: string
  helper?: string
  validator?: Record<string, IValidator>
  depends_on?: string
}

export interface ICreateInfo {
  nm_create: string
  nm_friendly_create: string
}

export interface ICaption {
  nm_friendly: string
  parms?: string[]
  combos?: ICombos[]
  component_update_action?: string
  allow_unlink?: boolean
}

/** Resposta de um WidgetGet (Grid, ModalCreate, ModalUpdate, cabeçalho de MD/DG...). */
export interface IComponents {
  name?: string
  type: string
  columns: IColumn[]
  data: Record<string, any>[]
  caption?: ICaption
  derived?: GridDefinition[]
  update_fields?: string[]
  success?: boolean | string
  msg?: string
}

/** Resposta de MasterDetails / DoubleGrid: vários componentes dentro. */
export interface IMasterDetails {
  name?: string
  nm_friendly?: string
  type: string
  components: IComponents[]
  create_inf?: ICreateInfo
  success?: boolean | string
  msg?: string
}

/** Resposta do a=c_up (contrato das SPs: linhas_afetadas + msg). */
export interface IRespUpdate {
  data?: { linhas_afetadas?: number; msg?: string; mensagem?: string }[]
  msg?: string
  error_message?: string
  error?: string | boolean
  success?: boolean | string
  result?: { success?: boolean | string }[]
  result_delete?: { success?: boolean | string }
}

export interface MenuDataSchema {
  nm_resource: string
  nm_friendly: string
  type: string
  icon: string
  tx_descricao: string
  destaques: string[]
}

export interface UserData {
  login?: string
  nm_usuario?: string
  cod_projeto?: number
  nm_projeto?: string
  qtd_recursos?: number
}
