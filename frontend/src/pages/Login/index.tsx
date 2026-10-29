import { useAppContext } from "@/hooks/useAppContext"
import { axiosPost } from "@/hooks/useFetchData"
import { Alert, Box, Button, CircularProgress, Paper, TextField, Typography } from "@mui/material"
import { SquaresFour } from "@phosphor-icons/react"
import { FormEvent, useState } from "react"
import { useNavigate } from "react-router-dom"

/** Login aberto: a senha NÃO é validada no backend e login em branco entra como "Visitante". */
export function Login() {
  const [login, setLogin] = useState("")
  const [senha, setSenha] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()
  const { refreshUser } = useAppContext()
  const navigate = useNavigate()

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(undefined)
    try {
      // Antes do login não existe projeto: skipProjectCode deixa a chamada sair.
      const r = await axiosPost<{ success: boolean; msg?: string }>("login", { a: "login", login, senha }, { skipProjectCode: true })
      if (!r?.data?.success) {
        setError(r?.data?.msg ?? "Não foi possível entrar")
        return
      }
      if (await refreshUser()) navigate("/", { replace: true })
    } catch {
      setError("Não foi possível conectar ao servidor. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100%",
        display: "grid",
        placeItems: "center",
        p: 2,
        background: "linear-gradient(135deg, #eef2ff 0%, #f8fafc 55%, #e0f2fe 100%)"
      }}
    >
      <Paper component="form" onSubmit={submit} elevation={0} sx={{ p: 4, width: "100%", maxWidth: 400, border: 1, borderColor: "divider" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <Box sx={{ width: 44, height: 44, borderRadius: 2.5, bgcolor: "primary.main", color: "#fff", display: "grid", placeItems: "center" }}>
            <SquaresFour size={26} weight="fill" />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
              Sistema de Gestão
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Lojas, produtos e pedidos
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField label="Login" value={login} onChange={(e) => setLogin(e.target.value)} autoFocus fullWidth />
          <TextField label="Senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} fullWidth />
          {error && <Alert severity="error">{error}</Alert>}
          <Button type="submit" variant="contained" size="large" disabled={loading} disableElevation>
            {loading ? <CircularProgress size={22} color="inherit" /> : "Entrar"}
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}
