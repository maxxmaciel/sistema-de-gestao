// Registro das últimas requests (alimenta o "Inspetor de API" do layout). No projeto original
// isso é a aba Rede das DevTools internas, ligada pela flag apiRequestLogging.

export interface ApiTraceEntry {
  id: number
  at: Date
  method: string
  url: string
  nmComponent?: string
  action?: string
  status: number | string
  durationMs: number | null
  payload: unknown
  response: unknown
  ok: boolean
}

const MAX_ENTRIES = 60
let entries: ApiTraceEntry[] = []
let nextId = 1
const listeners = new Set<() => void>()

export const recordApiTrace = (entry: Omit<ApiTraceEntry, "id" | "at">) => {
  entries = [{ ...entry, id: nextId++, at: new Date() }, ...entries].slice(0, MAX_ENTRIES)
  listeners.forEach((listener) => listener())
}

export const clearApiTrace = () => {
  entries = []
  listeners.forEach((listener) => listener())
}

/** Para useSyncExternalStore. */
export const subscribeApiTrace = (listener: () => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export const getApiTrace = () => entries
