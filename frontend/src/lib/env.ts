/** Prefixo das rotas do app (para publicar num subcontexto, como /app). */
export const basePrefix = ""

/** Onde estão os servlets. Em dev o Vite faz proxy de /api para o backend (vite.config.ts). */
export const apiBase = `${basePrefix}/api`
