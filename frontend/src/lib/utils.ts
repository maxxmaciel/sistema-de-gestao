/**
 * Utils do FRAMEWORK: funções que entendem o JSON dos componentes (diferente do Std, que é
 * genérico). São elas que transformam a resposta do backend em grid e formulário.
 */
import type { FormField } from "@/components/Components"
import type {
  ICombos,
  IComponents,
  IRespUpdate
} from "@/contexts/AppContext/interfaces"

/** Acha o componente de um tipo dentro de um MasterDetails/DoubleGrid. */
export const ensureComponent = (components: IComponents[], type: string): IComponents | undefined =>
  components.find((c) => c.type === type)

/** Campos chave (pk) do grid: identificam a linha e viram parâmetro das ações derivadas. */
export const ensureAllPk = (grid: IComponents | undefined): string[] =>
  grid?.columns.filter((c) => c.pk).map((c) => c.field) ?? []

/**
 * Colunas do componente -> campos de formulário.
 *  - campo fora de `parms` (o que a SP recebe) fica desabilitado: aparece, mas não edita;
 *  - combo ocupa o lugar da coluna de mesmo nome (cod_categoria vira "Categoria" com opções).
 */
export function ensureFields<T extends Record<string, any>>(
  data?: IComponents,
  parms?: string[],
  combos?: ICombos[]
): FormField<T>[] {
  const columns = data?.columns ?? []
  const comboList = combos ?? data?.caption?.combos ?? []
  const editable = (field: string) => !parms || parms.includes(field)

  const comboField = (e: ICombos): FormField<T> => ({
    key: e.column_key as keyof T & string,
    columns_nm: e.columns_nm,
    type: "combo",
    label: e.nm_friendly,
    derivation: e.name,
    depends_on: e.depends_on,
    hidden: false,
    disabled: !editable(e.column_key),
    helper: e.helper ?? "",
    validator: e.validator ?? columns.find((col) => col.field === e.column_key)?.validator
  })

  const fields: FormField<T>[] = columns.map((column) => {
    const combo = comboList.find((c) => c.column_key === column.field)
    if (combo) return comboField(combo)

    return {
      key: column.field as keyof T & string,
      columns_nm: [],
      label: column.headerName,
      type: column.type ?? "",
      hidden: Boolean(column.hidden),
      disabled: !editable(column.field),
      helper: column.helper ?? "",
      validator: column.validator,
      enum: column.enum,
      buildCell: column.buildCell
    }
  })

  comboList
    .filter((c) => !columns.some((col) => col.field === c.column_key))
    .forEach((c) => fields.push(comboField(c)))

  return fields
}

/** Linhas com o nome amigável das colunas visíveis (para exportar). */
export const mapDataWithFriendlyHeaders = (
  data: Record<string, any>[],
  columns: { field: string; headerName: string; hidden?: boolean }[]
): Record<string, any>[] => {
  const visible = columns.filter((col) => !col.hidden)
  return data.map((row) =>
    Object.fromEntries(visible.map((col) => [col.headerName, row[col.field]]))
  )
}

/** Id estável da linha a partir das chaves (ou do índice, se não houver chave). */
export const rowKeyFromPk = (row: Record<string, any>, pkFields: string[], index = 0): string =>
  pkFields.length ? pkFields.map((k) => String(row?.[k] ?? "")).join("::") : String(index)

/** Só os campos pedidos de um objeto. */
export const pick = (row: Record<string, any> | undefined, keys: string[]) =>
  Object.fromEntries(keys.map((k) => [k, row?.[k]]))

/** Rota de uma tela de cadastro. A URL fica em minúsculo (/r/md_produto); o backend usa MD_PRODUTO. */
export const resourcePath = (nmResource: string) => `/r/${nmResource.toLowerCase()}`

/**
 * Lê a resposta de uma gravação (a=c_up) e diz se deu certo.
 * Contrato: SP devolve linhas_afetadas + msg; IntegrityValidator devolve error_message.
 */
export function parseUpdateResponse(resp?: IRespUpdate | null): { ok: boolean; msg: string } {
  if (!resp) return { ok: false, msg: "Sem resposta do servidor" }
  if (resp.error_message) return { ok: false, msg: resp.error_message }

  const success = resp.success === true || resp.success === "true"
  const row = resp.data?.[0]

  if (!success) return { ok: false, msg: resp.msg || row?.msg || "Não foi possível gravar" }
  if (row && row.linhas_afetadas === 0) return { ok: false, msg: row.msg || "Nenhum registro alterado" }

  const anyFailed =
    resp.result?.some((r) => r.success === false || r.success === "false") ||
    resp.result_delete?.success === false ||
    resp.result_delete?.success === "false"
  if (anyFailed) return { ok: false, msg: resp.msg || "Parte da gravação falhou" }

  return { ok: true, msg: row?.msg || row?.mensagem || resp.msg || "Operação concluída" }
}
