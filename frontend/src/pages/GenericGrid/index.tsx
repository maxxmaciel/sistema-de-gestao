import { GenericGridActionsBar } from "@/components/Components/CustomizedComponents"
import { DerivableGridSection } from "@/components/DerivableGridSection"
import type { IMasterDetails, MenuDataSchema } from "@/contexts/AppContext/interfaces"
import { useFetchData } from "@/hooks/useFetchData"
import { ensureComponent } from "@/lib/utils"
import { menuIcon } from "@/lib/menuIcons"
import { Alert, Box, Chip, Paper, Typography } from "@mui/material"
import { useLocation } from "react-router-dom"

interface GenericGridMenuProps {
  Resource: MenuDataSchema
}

/**
 * A ÚNICA página de cadastro do sistema. Recebe o nome de um MasterDetails (MD_PRODUTO...) e:
 *   - busca o componente: GET /api/c?a=component&nm_component=MD_PRODUTO
 *   - pega o Grid de dentro, o create_inf (botão Adicionar) e as ações derivadas
 * Trocar de Produtos para Clientes é só trocar o nome: nenhuma linha de código por entidade.
 */
export function GenericGridMenu({ Resource }: GenericGridMenuProps) {
  const location = useLocation()
  const { data, loading, error, refetch } = useFetchData<IMasterDetails>(
    { url: "c", params: { a: "component", nm_component: Resource.nm_resource } },
    [location.key]
  )

  const grid = ensureComponent(data?.components ?? [], "Grid")
  const Icon = menuIcon(Resource.icon)

  // Barra de ações própria desta tela, se existir (o resto continua genérico).
  const CustomActionsBar = GenericGridActionsBar[Resource.nm_resource]

  const typesOnScreen = Array.from(
    new Set(
      [
        data?.type,
        grid?.type,
        data?.create_inf ? "ModalCreate" : undefined,
        ...(grid?.derived ?? []).map((d) => d.type),
        CustomActionsBar ? "FetchModal" : undefined
      ].filter(
        (t): t is string => Boolean(t)
      )
    )
  )

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      <Paper variant="outlined" sx={{ p: 2.5, display: "flex", gap: 2, alignItems: "flex-start", flexWrap: "wrap" }}>
        <Box sx={{ width: 48, height: 48, borderRadius: 2.5, bgcolor: "#eef2ff", color: "primary.main", display: "grid", placeItems: "center" }}>
          <Icon size={26} weight="duotone" />
        </Box>
        <Box sx={{ flex: 1, minWidth: 240 }}>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            {Resource.nm_friendly}
          </Typography>
          <Typography color="text.secondary" variant="body2" sx={{ mb: 1 }}>
            {Resource.tx_descricao}
          </Typography>
          <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap", alignItems: "center" }}>
            <Typography variant="caption" color="text.secondary">
              Componentes nesta tela:
            </Typography>
            {typesOnScreen.map((t) => (
              <Chip key={t} label={t} size="small" variant="outlined" color="primary" />
            ))}
          </Box>
        </Box>
        <Box sx={{ alignSelf: "center" }}>
          <Typography variant="caption" color="text.secondary" component="div">
            Tudo veio de:
          </Typography>
          <code style={{ fontSize: 12 }}>GET /api/c?a=component&amp;nm_component={Resource.nm_resource}</code>
        </Box>
      </Paper>

      {error && <Alert severity="error">{error}</Alert>}

      <DerivableGridSection
        grid={grid}
        createInf={data?.create_inf}
        refetch={refetch}
        loading={loading}
        renderExtraActions={
          CustomActionsBar
            ? ({ rowSelected, refetch: refetchGrid }) => (
                <CustomActionsBar Resource={Resource} rowSelected={rowSelected} refetch={refetchGrid} />
              )
            : undefined
        }
        subtitle={
          <span>
            <span className="mono">{grid?.name}</span> · clique em ⋮ ou dê duplo clique numa linha para ver as ações
          </span>
        }
      />
    </Box>
  )
}
