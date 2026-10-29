import { Box, FormControlLabel, MenuItem, Switch, TextField, Tooltip } from "@mui/material"
import { ReactNode, useEffect, useState } from "react"
import type { FormField } from ".."
import { Combo } from "./Combo"

export interface FormDataProps<T extends Record<string, any> = Record<string, any>> {
  fields: FormField<T>[]
  initialStateProp?: Partial<T>
  onChange?: (formData: T) => void
  errors?: Record<string, string>
  /** Desenho próprio para um campo; devolver undefined usa o padrão. */
  renderFieldCustom?: (field: FormField<T>, handleChange: (name: keyof T, value: unknown) => void) => ReactNode | undefined
}

const WIDE_TYPES = ["obs"]

/**
 * Formulário a partir de uma lista de campos. Cada tipo do backend vira um input:
 * combo -> Autocomplete, enum -> select, boolean -> switch, obs -> texto longo, monetario/int ->
 * número, date -> calendário. Campo hidden fica no estado (vai no envio) mas não aparece.
 */
export function FormData<T extends Record<string, any> = Record<string, any>>({
  fields,
  initialStateProp,
  onChange,
  errors = {},
  renderFieldCustom
}: FormDataProps<T>) {
  const [form, setForm] = useState<T>((initialStateProp ?? {}) as T)
  const initialKey = JSON.stringify(initialStateProp ?? {})

  useEffect(() => {
    setForm((initialStateProp ?? {}) as T)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialKey])

  const handleChange = (name: keyof T, value: unknown) => {
    const next = { ...form, [name]: value } as T
    setForm(next)
    onChange?.(next)
  }

  const visible = fields.filter((f) => !f.hidden)

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2, pt: 1 }}>
      {visible.map((field) => {
        const custom = renderFieldCustom?.(field, handleChange)
        return (
          <Box key={field.key} sx={{ gridColumn: WIDE_TYPES.includes(field.type) ? "1 / -1" : undefined }}>
            {custom ?? (
              <FieldInput
                field={field}
                value={form[field.key]}
                error={errors[field.key]}
                onChange={(v) => handleChange(field.key, v)}
              />
            )}
          </Box>
        )
      })}
    </Box>
  )
}

interface FieldInputProps<T> {
  field: FormField<T>
  value: unknown
  error?: string
  onChange: (value: unknown) => void
}

function FieldInput<T>({ field, value, error, onChange }: FieldInputProps<T>) {
  const common = {
    fullWidth: true,
    size: "small" as const,
    name: field.key,
    label: field.label,
    disabled: field.disabled,
    error: Boolean(error),
    helperText: error || field.helper || (field.disabled ? "Somente leitura" : undefined)
  }
  const text = value === null || value === undefined ? "" : String(value)

  if (field.type === "combo") {
    return <Combo field={field as never} value={value} error={error} disabled={field.disabled} onChange={onChange} />
  }

  if (field.enum?.length) {
    return (
      <TextField {...common} select value={text} onChange={(e) => onChange(e.target.value)}>
        {field.enum.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
    )
  }

  switch (field.type) {
    case "boolean":
      return (
        <Tooltip title={field.disabled ? "Somente leitura" : ""}>
          <FormControlLabel
            sx={{ height: 40, ml: 0 }}
            label={field.label}
            disabled={field.disabled}
            control={
              <Switch
                name={field.key}
                checked={value === 1 || value === "1" || value === true}
                onChange={(_, checked) => onChange(checked ? 1 : 0)}
              />
            }
          />
        </Tooltip>
      )
    case "obs":
      return <TextField {...common} multiline minRows={3} value={text} onChange={(e) => onChange(e.target.value)} />
    case "monetario":
    case "double":
      return (
        <TextField
          {...common}
          type="number"
          value={text}
          onChange={(e) => onChange(e.target.value)}
          slotProps={{ htmlInput: { step: "0.01" } }}
        />
      )
    case "int":
      return (
        <TextField
          {...common}
          type="number"
          value={text}
          onChange={(e) => onChange(e.target.value)}
          slotProps={{ htmlInput: { step: "1" } }}
        />
      )
    case "date":
      return (
        <TextField
          {...common}
          type="date"
          value={text.slice(0, 10)}
          onChange={(e) => onChange(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />
      )
    case "datetime":
      return (
        <TextField
          {...common}
          type="datetime-local"
          value={text.replace(" ", "T").slice(0, 16)}
          onChange={(e) => onChange(e.target.value.replace("T", " "))}
          slotProps={{ inputLabel: { shrink: true } }}
        />
      )
    case "email":
      return <TextField {...common} type="email" value={text} onChange={(e) => onChange(e.target.value)} />
    default:
      return <TextField {...common} value={text} onChange={(e) => onChange(e.target.value)} />
  }
}
