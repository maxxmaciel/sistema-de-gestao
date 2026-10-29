import { CustomButton } from "@/components/CustomButton"
import { useFetchData, UseFetchDataResult } from "@/hooks/useFetchData"
import {
  Alert,
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from "@mui/material"
import { ArrowCounterClockwise, CheckCircle, X } from "@phosphor-icons/react"
import type { AxiosRequestConfig } from "axios"
import { useEffect, useRef, useState } from "react"

export interface FetchModalProps<TData> {
  open: boolean
  onClose: () => void
  url: string
  method?: "get" | "post"
  config?: AxiosRequestConfig
  params?: Record<string, any>
  title?: string
  /**
   * Chamado UMA vez quando a resposta chega. Quem usa decide o que é sucesso e o que é erro:
   *   setResponseFetch("msg")      -> mostra como sucesso
   *   setResponseErrorFetch("msg") -> mostra como erro
   */
  onFetchSuccess: (
    fetch: UseFetchDataResult<TData>,
    setResponseFetch: (msg: string) => void,
    close: () => void,
    setResponseErrorFetch: (msg: string) => void
  ) => void
}

/**
 * "Executa e mostra o resultado". Ao abrir já dispara a request (useFetchData) e mostra
 * carregando -> mensagem. É como os modais genéricos gravam: o formulário valida, e quem fala com
 * o servidor e mostra a resposta da SP é o FetchModal.
 */
export function FetchModal<TData>({
  open,
  onClose,
  url,
  method = "get",
  config,
  params,
  title = "Processando",
  onFetchSuccess
}: FetchModalProps<TData>) {
  if (!open) return null
  return (
    <FetchModalContent<TData>
      onClose={onClose}
      url={url}
      method={method}
      config={config}
      params={params}
      title={title}
      onFetchSuccess={onFetchSuccess}
    />
  )
}

function FetchModalContent<TData>({
  onClose,
  url,
  method,
  config,
  params,
  title,
  onFetchSuccess
}: Omit<FetchModalProps<TData>, "open">) {
  const fetch = useFetchData<TData>({ url, method, params, config })
  const { data, loading, error, refetch } = fetch
  const [responseFetch, setResponseFetch] = useState("")
  const [responseErrorFetch, setResponseErrorFetch] = useState("")
  const handledRef = useRef<unknown>(undefined)

  useEffect(() => {
    if (data && handledRef.current !== data) {
      handledRef.current = data
      onFetchSuccess(fetch, setResponseFetch, onClose, setResponseErrorFetch)
    }
  }, [data, fetch, onClose, onFetchSuccess])

  const handleClose = () => {
    if (!loading) onClose()
  }

  return (
    <Dialog open onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: 700 }}>{title}</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ minHeight: 96, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
          {loading && (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5 }}>
              <CircularProgress size={36} />
              <Typography variant="body2" color="text.secondary">
                Enviando...
              </Typography>
            </Box>
          )}

          {!loading && error && (
            <Alert
              severity="error"
              sx={{ width: "100%" }}
              action={<CustomButton text="Tentar novamente" color="gray" size="small" Icon={ArrowCounterClockwise} onClick={refetch} />}
            >
              {error}
            </Alert>
          )}

          {!loading && data && responseFetch && (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
              <CheckCircle size={40} weight="fill" color="#16a34a" />
              <Typography>{responseFetch}</Typography>
            </Box>
          )}

          {!loading && data && responseErrorFetch && (
            <Alert severity="error" sx={{ width: "100%" }}>
              {responseErrorFetch}
            </Alert>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 1.5 }}>
        <CustomButton text="Fechar" color={responseFetch ? "blue" : "gray"} Icon={X} onClick={handleClose} disabled={loading} />
      </DialogActions>
    </Dialog>
  )
}
