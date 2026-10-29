import type { IColumn, IComponents, IValidator } from "@/contexts/AppContext/interfaces"
import { z } from "zod"

type ColumnLike = Pick<IColumn, "field"> & { validator?: Record<string, IValidator> }

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const isEmpty = (v: unknown) => v === null || v === undefined || String(v).trim() === ""

/**
 * Monta o schema do Zod a partir das regras que vieram do backend (Validator do FIELD).
 * A regra é declarada uma vez, no Java; o front só interpreta.
 */
export function buildZodSchemaFromColumns(columns: ColumnLike[]) {
  const shape: Record<string, z.ZodTypeAny> = {}

  for (const col of columns) {
    const rules = col.validator
    if (!rules) continue

    let schema: z.ZodTypeAny = z.any()

    const required = rules.required
    if (required?.value) {
      schema = schema.refine((v) => !isEmpty(v), { message: required.message ?? "Campo obrigatório" })
    }

    const maxLength = rules.maxLength
    if (maxLength) {
      schema = schema.refine((v) => isEmpty(v) || String(v).length <= Number(maxLength.value), {
        message: maxLength.message ?? `Máximo de ${maxLength.value} caracteres`
      })
    }

    const min = rules.min
    if (min) {
      schema = schema.refine((v) => isEmpty(v) || Number(v) >= Number(min.value), {
        message: min.message ?? `Valor mínimo: ${min.value}`
      })
    }

    const email = rules.email
    if (email?.value) {
      schema = schema.refine((v) => isEmpty(v) || EMAIL.test(String(v)), {
        message: email.message ?? "E-mail inválido"
      })
    }

    shape[col.field] = schema
  }

  return z.object(shape).passthrough()
}

/**
 * Valida o formulário de um ModalCreate/ModalUpdate. Só entram os campos editáveis
 * (caption.parms). Combo sem validator explícito é obrigatório (mesma regra do backend).
 * Devolve { campo: mensagem } ou null se estiver tudo certo.
 */
export function validateComponentForm(
  form: Record<string, any>,
  data?: IComponents
): Record<string, string> | null {
  const parms = data?.caption?.parms ?? []
  const combos = data?.caption?.combos ?? []

  const columns: ColumnLike[] = [
    ...(data?.columns ?? []).filter(
      (col) => !col.hidden && parms.includes(col.field) && !combos.some((c) => c.column_key === col.field)
    ),
    ...combos
      .filter((combo) => parms.includes(combo.column_key))
      .map((combo) => ({
        field: combo.column_key,
        validator: combo.validator ?? {
          required: { type: "required", value: true, message: `${combo.nm_friendly} é obrigatório` }
        }
      }))
  ]

  const result = buildZodSchemaFromColumns(columns).safeParse(form)
  if (result.success) return null

  const errors: Record<string, string> = {}
  result.error.errors.forEach((err) => {
    const key = String(err.path[0] ?? "")
    if (key && !errors[key]) errors[key] = err.message
  })
  return errors
}
