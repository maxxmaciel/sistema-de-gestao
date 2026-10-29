import { ApiInspector } from "@/components/ApiInspector"
import { axiosGet } from "@/hooks/useFetchData"
import { useAppContext } from "@/hooks/useAppContext"
import { getApiTrace, subscribeApiTrace } from "@/lib/apiTrace"
import { menuIcon } from "@/lib/menuIcons"
import { Std } from "@/lib/std"
import { resourcePath } from "@/lib/utils"
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Tooltip,
  Typography
} from "@mui/material"
import { BracketsCurly, List as ListIcon, SignOut, SquaresFour } from "@phosphor-icons/react"
import { useState, useSyncExternalStore } from "react"
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom"

const DRAWER_WIDTH = 260

export function MainLayout() {
  const { userData, loadingUser, menu } = useAppContext()
  const [inspectorOpen, setInspectorOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const traceCount = useSyncExternalStore(subscribeApiTrace, () => getApiTrace().length)
  const navigate = useNavigate()
  const location = useLocation()

  if (loadingUser) {
    return (
      <Box sx={{ height: "100%", display: "grid", placeItems: "center" }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!userData.login) {
    return <Navigate to="/login" replace />
  }

  const logout = async () => {
    await axiosGet("login", { a: "logout" }, { skipProjectCode: true })
    window.location.href = "/login"
  }

  const pageTitle = menu.find((m) => resourcePath(m.nm_resource) === location.pathname)?.nm_friendly ?? "Painel"

  const go = (path: string) => {
    navigate(path)
    setMobileOpen(false)
  }

  const drawer = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ px: 2.5, py: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box sx={{ width: 34, height: 34, borderRadius: 2, bgcolor: "primary.main", color: "#fff", display: "grid", placeItems: "center" }}>
          <SquaresFour size={20} weight="fill" />
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 800, lineHeight: 1.1 }}>Sistema de Gestão</Typography>
          <Typography variant="caption" color="text.secondary">
            Lojas, produtos e pedidos
          </Typography>
        </Box>
      </Box>
      <Divider />
      <List sx={{ px: 1, py: 1.5 }}>
        <ListItemButton selected={location.pathname === "/"} onClick={() => go("/")} sx={{ borderRadius: 2 }}>
          <ListItemIcon sx={{ minWidth: 36 }}>
            <SquaresFour size={20} />
          </ListItemIcon>
          <ListItemText primary="Painel" />
        </ListItemButton>
        <Typography variant="overline" color="text.secondary" sx={{ px: 2, pt: 2, display: "block" }}>
          Cadastros
        </Typography>
        {menu.map((item) => {
          const Icon = menuIcon(item.icon)
          const path = resourcePath(item.nm_resource)
          return (
            <ListItemButton key={item.nm_resource} selected={location.pathname === path} onClick={() => go(path)} sx={{ borderRadius: 2 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Icon size={20} />
              </ListItemIcon>
              <ListItemText primary={item.nm_friendly} />
            </ListItemButton>
          )
        })}
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: "flex", minHeight: "100%" }}>
      <AppBar position="fixed" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: "divider", zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar sx={{ gap: 1 }}>
          <IconButton sx={{ display: { md: "none" } }} onClick={() => setMobileOpen(true)} aria-label="Menu">
            <ListIcon size={22} />
          </IconButton>
          <Typography sx={{ fontWeight: 700, flex: 1 }} noWrap>
            {pageTitle}
          </Typography>
          {/* Ferramenta de desenvolvedor: só no "npm run dev", nunca no site publicado. */}
          {Std.isDevelopment && (
            <>
              <Tooltip title="Ver as chamadas ao backend e o JSON de cada uma">
                <Button color="inherit" onClick={() => setInspectorOpen(true)} sx={{ gap: 1.5 }} startIcon={
                  <Badge badgeContent={traceCount} color="primary" max={99} sx={{ "& .MuiBadge-badge": { right: -6 } }}>
                    <BracketsCurly size={20} />
                  </Badge>
                }>
                  <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                    Inspetor de API
                  </Box>
                </Button>
              </Tooltip>
              <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
            </>
          )}
          <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main", fontSize: 14 }}>
            {userData.nm_usuario?.split(" ").map((p) => p[0]).slice(0, 2).join("")}
          </Avatar>
          <Typography variant="body2" sx={{ display: { xs: "none", sm: "block" } }}>
            {userData.nm_usuario}
          </Typography>
          <Tooltip title="Sair">
            <IconButton onClick={logout} aria-label="Sair">
              <SignOut size={20} />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{ display: { md: "none" }, "& .MuiDrawer-paper": { width: DRAWER_WIDTH } }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{ display: { xs: "none", md: "block" }, width: DRAWER_WIDTH, flexShrink: 0, "& .MuiDrawer-paper": { width: DRAWER_WIDTH, boxSizing: "border-box" } }}
      >
        <Toolbar />
        {drawer}
      </Drawer>

      <Box component="main" sx={{ flex: 1, minWidth: 0, p: { xs: 2, md: 3 } }}>
        <Toolbar />
        <Outlet />
      </Box>

      {Std.isDevelopment && <ApiInspector open={inspectorOpen} onClose={() => setInspectorOpen(false)} />}
    </Box>
  )
}
