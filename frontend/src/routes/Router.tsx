import { MainLayout } from "@/layouts/MainLayout"
import { GenericGridRoute } from "@/pages/GenericGrid/GenericGridRoute"
import { Home } from "@/pages/Home"
import { Login } from "@/pages/Login"
import { Navigate, Route, Routes } from "react-router-dom"

/**
 * Só existem 3 rotas. Toda tela de cadastro é /r/<nome do componente em minúsculo>: a mesma página genérica
 * para Categorias, Produtos, Clientes, Pedidos e Lojas.
 */
export function Router() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="r/:nmResource" element={<GenericGridRoute />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
