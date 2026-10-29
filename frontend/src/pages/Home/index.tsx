import { CustomButton } from "@/components/CustomButton"
import { useAppContext } from "@/hooks/useAppContext"
import { menuIcon } from "@/lib/menuIcons"
import { resourcePath } from "@/lib/utils"
import { Box, Paper, Typography } from "@mui/material"
import { ArrowRight } from "@phosphor-icons/react"
import { useNavigate } from "react-router-dom"

export function Home() {
  const { userData, menu } = useAppContext()
  const navigate = useNavigate()

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Olá, {userData.nm_usuario?.split(" ")[0]}
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 760 }}>
          Escolha um cadastro para começar.
        </Typography>
      </Box>

      <Section titulo="Cadastros" subtitulo="categorias, produtos, clientes, pedidos e lojas em um só lugar">
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "repeat(3, 1fr)" }, gap: 2 }}>
          {menu.map((item) => {
            const Icon = menuIcon(item.icon)
            return (
              <Paper key={item.nm_resource} variant="outlined" sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: "#eef2ff", color: "primary.main", display: "grid", placeItems: "center" }}>
                    <Icon size={22} weight="duotone" />
                  </Box>
                  <Typography sx={{ fontWeight: 700 }}>{item.nm_friendly}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                  {item.tx_descricao}
                </Typography>
                <Box>
                  <CustomButton text="Abrir" size="small" Icon={ArrowRight} onClick={() => navigate(resourcePath(item.nm_resource))} />
                </Box>
              </Paper>
            )
          })}
        </Box>
      </Section>
    </Box>
  )
}

function Section({ titulo, subtitulo, children }: { titulo: string; subtitulo: string; children: React.ReactNode }) {
  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 800 }}>
        {titulo}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {subtitulo}
      </Typography>
      {children}
    </Box>
  )
}
