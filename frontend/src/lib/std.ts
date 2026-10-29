/**
 * Std: formatação e utilidades "de linguagem", sem nada de framework. Tudo estático, para
 * chamar de qualquer lugar (célula de grid, combo, exportação): Std.formatToBRL(10) -> "R$ 10,00".
 * Nada aqui pode lançar exceção: roda dentro de célula de grid, e um throw derrubaria a tabela.
 */
export class Std {
  static isDevelopment = import.meta.env.DEV

  private static readonly brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })
  private static readonly decimal = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 })

  // ---------------------------------------------------------------- números

  static toNumber(value: unknown): number | null {
    if (value === null || value === undefined || value === "") return null
    const n = typeof value === "number" ? value : Number(String(value).replace(",", "."))
    return Number.isFinite(n) ? n : null
  }

  /** 1234.5 -> "R$ 1.234,50" */
  static formatToBRL(value: unknown): string {
    const n = Std.toNumber(value)
    return n === null ? "" : Std.brl.format(n)
  }

  /** 1234.5 -> "1.234,5" */
  static formatNumberToBRL(value: unknown): string {
    const n = Std.toNumber(value)
    return n === null ? "" : Std.decimal.format(n)
  }

  // ---------------------------------------------------------------- datas

  /** "2026-10-29" -> "29/10/2026" (sem passar por Date: não sofre com fuso). */
  static formatDateBRL(value: unknown): string {
    if (!value) return ""
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value))
    return match ? `${match[3]}/${match[2]}/${match[1]}` : String(value)
  }

  /** "2026-10-29 14:30:00" -> "29/10/2026 14:30" */
  static formatDateTimeBRL(value: unknown): string {
    if (!value) return ""
    const match = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/.exec(String(value))
    return match ? `${match[3]}/${match[2]}/${match[1]} ${match[4]}:${match[5]}` : String(value)
  }

  // ---------------------------------------------------------------- texto

  /** "São Paulo" -> "sao paulo" (busca sem acento e sem caixa). */
  static normalizeText(value: unknown): string {
    return String(value ?? "")
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .trim()
  }

  static toBoolean(value: unknown): boolean {
    return value === true || value === 1 || value === "1" || value === "true"
  }

  // ---------------------------------------------------------------- coleções

  static groupBy<T>(items: T[], keyOf: (item: T) => string): Record<string, T[]> {
    return items.reduce(
      (acc, item) => {
        const key = keyOf(item)
        ;(acc[key] ??= []).push(item)
        return acc
      },
      {} as Record<string, T[]>
    )
  }

  // ---------------------------------------------------------------- por tipo de coluna

  /** Texto de um valor conforme o tipo que o backend mandou (usado em célula, combo e busca). */
  static formatByType(value: unknown, type?: string): string {
    if (value === null || value === undefined) return ""
    switch (type) {
      case "monetario":
        return Std.formatToBRL(value)
      case "double":
        return Std.formatNumberToBRL(value)
      case "date":
        return Std.formatDateBRL(value)
      case "datetime":
        return Std.formatDateTimeBRL(value)
      case "boolean":
        return Std.toBoolean(value) ? "Sim" : "Não"
      default:
        return String(value)
    }
  }
}
