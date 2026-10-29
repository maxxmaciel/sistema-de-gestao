import {
  Icon as PhosphorIcon,
  Package,
  Receipt,
  SquaresFour,
  Storefront,
  Tag,
  Users
} from "@phosphor-icons/react"

/** O backend manda o nome do ícone (MENU.java); aqui vira o componente. */
const ICONS: Record<string, PhosphorIcon> = { Tag, Package, Users, Receipt, Storefront }

export const menuIcon = (name?: string): PhosphorIcon => (name && ICONS[name]) || SquaresFour
