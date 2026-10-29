import type { IComponents } from "@/contexts/AppContext/interfaces"
import { useFetchData } from "@/hooks/useFetchData"
import { Std } from "@/lib/std"
import { Autocomplete, TextField } from "@mui/material"
import type { FormField } from ".."

interface ComboProps {
  field: FormField
  value: unknown
  error?: string
  disabled?: boolean
  onChange: (value: unknown) => void
}

/**
 * Combo genérico. O backend não manda as opções: manda o NOME de um grid (field.derivation) e
 * qual coluna é o valor (field.key). O combo busca esse grid como qualquer outra tela e mostra as
 * colunas de columns_nm. Qualquer grid registrado pode virar combo.
 */
export function Combo({ field, value, error, disabled, onChange }: ComboProps) {
  const { data, loading } = useFetchData<IComponents>({
    url: "c",
    params: { a: "component", nm_component: field.derivation }
  })

  const rows = data?.data ?? []
  const types = Object.fromEntries((data?.columns ?? []).map((c) => [c.field, c.type]))
  const labelOf = (row: Record<string, any>) =>
    field.columns_nm.map((col) => Std.formatByType(row[col], types[col])).filter(Boolean).join(" · ")

  const selected = rows.find((row) => String(row[field.key]) === String(value ?? "")) ?? null

  return (
    <Autocomplete
      options={rows}
      loading={loading}
      value={selected}
      disabled={disabled}
      getOptionLabel={labelOf}
      isOptionEqualToValue={(a, b) => String(a[field.key]) === String(b[field.key])}
      onChange={(_, row) => onChange(row ? row[field.key] : "")}
      noOptionsText="Nada encontrado"
      loadingText="Carregando..."
      renderInput={(params) => (
        <TextField
          {...params}
          name={field.key}
          label={field.label}
          size="small"
          error={Boolean(error)}
          helperText={error || `Opções do grid ${field.derivation}`}
        />
      )}
    />
  )
}
