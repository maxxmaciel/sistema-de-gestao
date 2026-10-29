/**
 * Camada HTTP do app. Três formas de chamar o backend, cada uma para um caso:
 *
 *  useFetchData  -> dados que a TELA mostra. Busca ao montar, refaz quando url/params mudam,
 *                   cancela a request anterior (AbortController), ignora resposta atrasada e
 *                   espera o usuário carregar. Ex.: o grid de uma tela, um combo, um modal.
 *
 *  axiosGet      -> leitura pontual dentro de um evento (clique, efeito manual), quando o
 *                   resultado não precisa virar estado do componente. Ex.: carregar o usuário.
 *
 *  axiosPost     -> gravação (a=c_up) e upload. Corpo em JSON; se algum parâmetro for File/Blob
 *                   vira multipart sozinho. Ex.: excluir um registro, login.
 *
 * As três passam pelos mesmos interceptors: injetam o cod_projeto, registram no Inspetor de API e
 * mandam para o login quando a sessão cai.
 */
import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig, Method } from "axios"
import { useEffect, useMemo, useRef, useState } from "react"
import { recordApiTrace } from "@/lib/apiTrace"
import { apiBase, basePrefix } from "@/lib/env"
import { useAppContext } from "./useAppContext"

const JSON_CONTENT_TYPE = "application/json; charset=UTF-8"

export const api = axios.create({
  baseURL: apiBase,
  withCredentials: true
})

export interface RequestParams {
  [key: string]: any
}

export interface ProjectAxiosRequestConfig extends AxiosRequestConfig {
  /** Chamada que pode sair antes de existir projeto (login, leitura do usuário). */
  skipProjectCode?: boolean
}

// ------------------------------------------------------------------ cod_projeto

let currentProjectCode: number | undefined

export const setApiCodProjeto = (codProjeto?: number) => {
  currentProjectCode = codProjeto
}

const withCodProjeto = (payload?: RequestParams, codProjeto?: number): RequestParams | undefined => {
  if (codProjeto == null) return payload
  if (!payload) return { cod_projeto: codProjeto }
  if (payload.cod_projeto != null) return payload
  return { ...payload, cod_projeto: codProjeto }
}

const shouldUseParams = (method?: string) => {
  const m = method?.toLowerCase()
  return m === "get" || m === "delete" || m === "head" || m === "options"
}

const resolveProjectCode = (payload?: RequestParams, codProjeto?: number) =>
  payload?.cod_projeto ?? codProjeto ?? currentProjectCode

/**
 * Sem projeto a request nem sai (devolve undefined). Evita a enxurrada de chamadas "vazias"
 * no primeiro render, antes do usuário carregar.
 */
const shouldSkipRequestWithoutProjectCode = (
  payload?: RequestParams,
  config?: ProjectAxiosRequestConfig,
  codProjeto?: number
) => {
  if (config?.skipProjectCode) return false
  return resolveProjectCode(payload, codProjeto) == null
}

const resolveJsonHeaders = (headers?: ProjectAxiosRequestConfig["headers"]) => {
  const next = { ...(headers ?? {}) } as Record<string, any>
  const contentTypeKey = Object.keys(next).find((key) => key.toLowerCase() === "content-type")
  if (!contentTypeKey) next["Content-Type"] = JSON_CONTENT_TYPE
  return next
}

// ------------------------------------------------------------------ interceptors

type TracedConfig = InternalAxiosRequestConfig & { __traceStart?: number; skipProjectCode?: boolean }

const describePayload = (config?: TracedConfig): unknown => {
  const data = config?.data
  if (data == null) return config?.params ?? null
  if (data instanceof FormData) {
    const fields: Record<string, unknown> = {}
    data.forEach((value, key) => {
      fields[key] = value instanceof File ? `[arquivo] ${value.name}` : value
    })
    return fields
  }
  if (typeof data === "string") {
    try {
      return JSON.parse(data)
    } catch {
      return data
    }
  }
  return data
}

const logApiTrace = (config: TracedConfig | undefined, status: number | string, response: unknown) => {
  if (!config) return
  const payload = describePayload(config)
  const params = (config.params ?? {}) as RequestParams
  const body = (payload && typeof payload === "object" ? payload : {}) as RequestParams
  const query = new URLSearchParams(
    Object.entries(params).map(([k, v]) => [k, String(v ?? "")])
  ).toString()

  recordApiTrace({
    method: (config.method ?? "get").toUpperCase(),
    url: `${apiBase}/${config.url ?? ""}${query ? `?${query}` : ""}`,
    nmComponent: params.nm_component ?? body.nm_component,
    action: params.a ?? body.a,
    status,
    durationMs: config.__traceStart ? Math.round(performance.now() - config.__traceStart) : null,
    payload,
    response,
    ok: typeof status === "number" && status < 400 && (response as any)?.success !== false && (response as any)?.success !== "false"
  })
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const requestConfig = config as TracedConfig
  requestConfig.__traceStart = performance.now()

  if (requestConfig.skipProjectCode || currentProjectCode == null) {
    return requestConfig
  }

  // GET: cod_projeto na query. POST: no corpo (ou no FormData).
  if (shouldUseParams(requestConfig.method)) {
    requestConfig.params = withCodProjeto(requestConfig.params, currentProjectCode)
  } else if (requestConfig.data instanceof FormData) {
    if (!requestConfig.data.has("cod_projeto")) requestConfig.data.append("cod_projeto", String(currentProjectCode))
  } else if (requestConfig.data && typeof requestConfig.data === "object" && !Array.isArray(requestConfig.data)) {
    requestConfig.data = withCodProjeto(requestConfig.data, currentProjectCode)
  } else if (!requestConfig.data) {
    requestConfig.data = { cod_projeto: currentProjectCode }
  }

  return requestConfig
})

api.interceptors.response.use(
  (response) => {
    logApiTrace(response.config as TracedConfig, response.status, response.data)

    // Sessão caiu (SessionedServlet): volta para o login.
    if (response.data?.auth === "Sem Sessao" && !window.location.pathname.startsWith(`${basePrefix}/login`)) {
      window.location.href = `${basePrefix}/login`
    }
    return response
  },
  (error) => {
    // Cancelada = o componente que pediu saiu da tela (ou pediu de novo). Não é erro.
    const status = axios.isCancel(error) ? "cancelada" : error?.response?.status ?? "ERR"
    logApiTrace(error?.config as TracedConfig, status, error?.response?.data ?? error?.message)
    if (error.response?.status === 401) {
      window.location.href = `${basePrefix}/login`
    }
    return Promise.reject(error)
  }
)

// ------------------------------------------------------------------ axiosGet / axiosPost

const resolveProjectParams = (params?: RequestParams, codProjeto?: number) => {
  if (params?.cod_projeto != null || codProjeto == null) return params
  return { ...params, cod_projeto: codProjeto }
}

export const axiosGet = async <T = any>(
  url: string,
  params?: RequestParams,
  config?: ProjectAxiosRequestConfig,
  cod_projeto?: number
): Promise<AxiosResponse<T> | undefined> => {
  if (shouldSkipRequestWithoutProjectCode(params, config, cod_projeto)) {
    return undefined
  }

  const resolvedCodProjeto = resolveProjectCode(params, cod_projeto)
  const finalParams = config?.skipProjectCode ? params : resolveProjectParams(params, resolvedCodProjeto)

  // Aceita "c?a=component" na url e junta com os params.
  const [baseUrl, rawQuery = ""] = url.split("?")
  const urlParams = Object.fromEntries(new URLSearchParams(rawQuery).entries())

  return api.get<T>(baseUrl, {
    ...config,
    params: { ...urlParams, ...finalParams }
  })
}

export const axiosPost = async <T = any>(
  url: string,
  params?: RequestParams,
  config?: ProjectAxiosRequestConfig,
  cod_projeto?: number
): Promise<AxiosResponse<T> | undefined> => {
  if (shouldSkipRequestWithoutProjectCode(params, config, cod_projeto)) {
    return undefined
  }

  const resolvedCodProjeto = resolveProjectCode(params, cod_projeto)
  const finalParams = config?.skipProjectCode ? params : resolveProjectParams(params, resolvedCodProjeto)

  const hasFile = finalParams && Object.values(finalParams).some((v) => v instanceof File || v instanceof Blob)

  if (hasFile) {
    const formData = new FormData()
    Object.entries(finalParams).forEach(([key, value]) => {
      if (value != null) formData.append(key, value as any)
    })
    return api.post<T>(url, formData, config)
  }

  return api.post<T>(url, finalParams, {
    ...config,
    headers: resolveJsonHeaders(config?.headers)
  })
}

// ------------------------------------------------------------------ useFetchData

export interface UseFetchDataResult<TData> {
  data: TData | undefined
  loading: boolean
  error: string | undefined
  refetch: () => void
  cancel: () => void
}

export type UseFetchDataOptions = {
  url: string
  method?: Method
  params?: RequestParams
  /** false = não busca (ex.: espera um filtro ser preenchido). Voltar a true refaz. */
  shouldFetch?: boolean
  enabled?: boolean
  config?: ProjectAxiosRequestConfig
  /** Refaz a busca quando o usuário troca de projeto. */
  refetchOnProjectChange?: boolean
}

export const useSyncApiProjectCode = () => {
  const { userData } = useAppContext()
  useEffect(() => {
    setApiCodProjeto(userData?.cod_projeto)
  }, [userData?.cod_projeto])
}

export const useFetchData = <TData = Record<string, any>>(
  {
    url,
    method = "get",
    params,
    enabled = true,
    shouldFetch = true,
    config,
    refetchOnProjectChange = true
  }: UseFetchDataOptions,
  deps: any[] = []
): UseFetchDataResult<TData> => {
  const { userData, loadingUser } = useAppContext()

  const [data, setData] = useState<TData | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | undefined>(undefined)
  const [invalidateKey, setInvalidateKey] = useState<number>(0)

  const abortControllerRef = useRef<AbortController | null>(null)
  const isMountedRef = useRef<boolean>(true)
  const requestIdRef = useRef<number>(0)

  // params costuma ser um objeto novo a cada render: compara pelo conteúdo.
  const serializedParams = useMemo(() => JSON.stringify(params), [params])
  const projectDependency = refetchOnProjectChange ? userData?.cod_projeto : undefined
  const canFetch = !loadingUser && enabled && shouldFetch

  useEffect(() => {
    setApiCodProjeto(userData?.cod_projeto)
  }, [userData?.cod_projeto])

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  useEffect(() => {
    if (!canFetch) {
      abortControllerRef.current?.abort()
      abortControllerRef.current = null
      setLoading(false)
      return
    }

    // Nova busca cancela a anterior.
    abortControllerRef.current?.abort()
    const controller = new AbortController()
    abortControllerRef.current = controller
    const currentRequestId = ++requestIdRef.current

    const fetchData = async () => {
      setLoading(true)
      setError(undefined)

      try {
        const requestConfig = { ...config, signal: controller.signal }
        const response =
          method.toLowerCase() === "get"
            ? await axiosGet<TData>(url, params, requestConfig, userData?.cod_projeto)
            : await axiosPost<TData>(url, params, requestConfig, userData?.cod_projeto)

        if (!response) return
        if (!response.data) throw new Error("Resposta vazia do servidor")

        // Resposta de uma busca que já foi substituída por outra: descarta.
        if (currentRequestId !== requestIdRef.current) return

        const body = response.data as any
        if (body?.success === false && body?.msg && !body?.auth) {
          throw new Error(body.msg)
        }

        if (isMountedRef.current) setData(response.data)
      } catch (err: any) {
        if (axios.isCancel(err) || err?.name === "CanceledError" || err?.name === "AbortError") return
        if (currentRequestId !== requestIdRef.current) return
        if (isMountedRef.current) {
          setError(err instanceof Error ? err.message : "Erro desconhecido na requisição")
        }
      } finally {
        if (isMountedRef.current && currentRequestId === requestIdRef.current) setLoading(false)
        if (abortControllerRef.current === controller) abortControllerRef.current = null
      }
    }

    void fetchData()

    return () => {
      controller.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canFetch, url, method, serializedParams, projectDependency, invalidateKey, ...deps])

  const refetch = () => {
    if (!canFetch) return
    setInvalidateKey((prev) => prev + 1)
  }

  const cancel = () => {
    abortControllerRef.current?.abort()
    abortControllerRef.current = null
    setLoading(false)
  }

  return { data, loading, error, refetch, cancel }
}
