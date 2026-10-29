/** Prefixo das rotas do app (o projeto original publica em subcontextos como /h1, /h5). */
export const basePrefix = ""

/** Onde estão os servlets. Em dev o Vite faz proxy de /api para o backend (vite.config.ts). */
export const apiBase = `${basePrefix}/api`
