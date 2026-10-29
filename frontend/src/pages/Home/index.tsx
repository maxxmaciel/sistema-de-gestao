import { CustomButton } from "@/components/CustomButton"
import { useAppContext } from "@/hooks/useAppContext"
import { menuIcon } from "@/lib/menuIcons"
import { Box, Chip, Paper, Typography } from "@mui/material"
import { ArrowRight } from "@phosphor-icons/react"
import { useNavigate } from "react-router-dom"

const COMPONENTES = [
  {
    nome: "Grid",
    classe: "Grid extends WidgetGet",
    oque: "Lista com busca, ordenação e paginação. Colunas, nomes, tipos e formatação vêm do SELECT + FIELD.",
    onde: "Qualquer cadastro do menu"
  },
  {
    nome: "ModalCreate",
    classe: "ModalCreate extends ModalBase",
    oque: "Inclusão montada do registro padrão (S_X_DEF). Os campos editáveis são os parâmetros da SP.",
    onde: "Botão Adicionar de qualquer tela"
  },
  {
    nome: "ModalUpdate",
    classe: "ModalUpdate extends ModalBase",
    oque: "Edição. Aparece sozinha em todo grid que tem a chave que ela pede (?cod_x).",
    onde: "⋮ de qualquer linha → Editar"
  },
  {
    nome: "ModalDelete",
    classe: "ModalDelete extends ModalBase",
    oque: "Exclusão com confirmação. Só onde for pendurada explicitamente; a SP pode recusar com motivo.",
    onde: "Categorias ou Produtos → ⋮ → Excluir"
  },
  {
    nome: "MasterDetails",
    classe: "MasterDetails extends ModalBase",
    oque: "Registro mestre + grid de detalhe + Adicionar já ligado ao mestre. As telas do menu também são MasterDetails.",
    onde: "Pedidos → ⋮ → Itens do pedido"
  },
  {
    nome: "DoubleGrid",
    classe: "DoubleGrid extends ModalBase",
    oque: "Vínculo N:N entre duas listas, salvo de uma vez (substitui os vínculos).",
    onde: "Lojas → ⋮ → Produtos da loja"
  },
  {
    nome: "FetchModal (ação própria)",
    classe: "WidgetGet A_PAGAR_PEDIDO + CustomizedComponents",
    oque: "Quando o genérico não basta: botão só daquela tela, com condição, que dispara a gravação e trata a resposta.",
    onde: "Pedidos → clique num pedido Aberto"
  }
]

const PASSOS = [
  {
    titulo: "1. FIELD: o campo, uma vez",
    codigo: `new Col("nm_categoria", "Categoria",
    Validator.required().maxLength(60));`
  },
  {
    titulo: "2. SQL: consulta e procedure",
    codigo: `new Select("SELECT ... FROM tb_categoria
            WHERE cod_categoria = ?cod_categoria");
new CallUpdate("CALL sp_alterar_categoria(
            ?cod_categoria, ?nm_categoria, ...)");`
  },
  {
    titulo: "3. COMPONENTS: a tela",
    codigo: `public static final ModalUpdate U_CATEGORIA =
  new ModalUpdate("Editar categoria",
      SQL.S_CATEGORIA, SQL.U_CATEGORIA);`
  },
  {
    titulo: "4. Front: nada",
    codigo: `// todo grid com cod_categoria ganha
// "Editar categoria" no ⋮ da linha.
// O ModalUpdate genérico monta o form
// a partir do JSON do componente.`
  }
]

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
          Cinco cadastros, nenhum com tela própria: todos são a mesma página genérica lendo componentes declarados no
          backend. Abra o <b>Inspetor de API</b> (canto superior direito) para ver o JSON que monta cada tela.
        </Typography>
      </Box>

      <Section titulo="Entidades do painel" subtitulo="cada uma é um MasterDetails do COMPONENTS">
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "repeat(3, 1fr)" }, gap: 2 }}>
          {menu.map((item) => {
            const Icon = menuIcon(item.icon)
            return (
              <Paper key={item.nm_resource} variant="outlined" sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: "#eef2ff", color: "primary.main", display: "grid", placeItems: "center" }}>
                    <Icon size={22} weight="duotone" />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 700 }}>{item.nm_friendly}</Typography>
                    <Typography variant="caption" color="text.secondary" className="mono">
                      {item.nm_resource}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                  {item.tx_descricao}
                </Typography>
                <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                  {item.destaques.map((d) => (
                    <Chip key={d} label={d} size="small" variant="outlined" />
                  ))}
                </Box>
                <Box>
                  <CustomButton text="Abrir" size="small" Icon={ArrowRight} onClick={() => navigate(`/r/${item.nm_resource}`)} />
                </Box>
              </Paper>
            )
          })}
        </Box>
      </Section>

      <Section titulo="Componentes genéricos" subtitulo="classes do backend + componente React de mesmo nome">
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "repeat(3, 1fr)" }, gap: 2 }}>
          {COMPONENTES.map((c) => (
            <Paper key={c.nome} variant="outlined" sx={{ p: 2.5 }}>
              <Typography sx={{ fontWeight: 800 }}>{c.nome}</Typography>
              <Typography variant="caption" className="mono" color="primary">
                {c.classe}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {c.oque}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                Onde ver: {c.onde}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Section>

      <Section titulo="Como uma tela nasce" subtitulo="exemplo real: o “Editar categoria”">
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr", xl: "repeat(4, 1fr)" }, gap: 2 }}>
          {PASSOS.map((p) => (
            <Paper key={p.titulo} variant="outlined" sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {p.titulo}
              </Typography>
              <pre className="code-block" style={{ flex: 1 }}>
                {p.codigo}
              </pre>
            </Paper>
          ))}
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
