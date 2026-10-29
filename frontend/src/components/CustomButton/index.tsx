import { Button, ButtonProps } from "@mui/material"
import type { Icon as PhosphorIcon } from "@phosphor-icons/react"

type ButtonColor = "green" | "red" | "black" | "gray" | "blue"

const COLOR_MAP: Record<ButtonColor, { variant: ButtonProps["variant"]; color: ButtonProps["color"] }> = {
  green: { variant: "contained", color: "success" },
  red: { variant: "contained", color: "error" },
  black: { variant: "contained", color: "inherit" },
  gray: { variant: "outlined", color: "inherit" },
  blue: { variant: "contained", color: "primary" }
}

export interface CustomButtonProps {
  text: string
  color?: ButtonColor
  Icon?: PhosphorIcon
  onClick?: () => void
  type?: "button" | "submit"
  id?: string
  disabled?: boolean
  size?: "small" | "medium"
}

/** Botão padrão do app: mesma cor = mesmo significado em todas as telas. */
export function CustomButton({
  text,
  color = "blue",
  Icon,
  onClick,
  type = "button",
  id,
  disabled,
  size = "medium"
}: CustomButtonProps) {
  const { variant, color: muiColor } = COLOR_MAP[color]
  return (
    <Button
      id={id}
      type={type}
      variant={variant}
      color={muiColor}
      size={size}
      disabled={disabled}
      onClick={onClick}
      startIcon={Icon ? <Icon size={size === "small" ? 16 : 18} weight="bold" /> : undefined}
      disableElevation
      sx={color === "black" ? { bgcolor: "#1f2937", color: "#fff", "&:hover": { bgcolor: "#111827" } } : undefined}
    >
      {text}
    </Button>
  )
}
