import { useAppContext } from "@/hooks/useAppContext"
import { resourcePath } from "@/lib/utils"
import { Navigate, useParams } from "react-router-dom"
import { GenericGridMenu } from "."

/** /r/:nmResource -> GenericGridMenu do item de menu correspondente. A URL é sempre em minúsculo. */
export function GenericGridRoute() {
  const { nmResource = "" } = useParams()
  const { menu } = useAppContext()

  // Link antigo em maiúsculo (/r/MD_PRODUTO) vira /r/md_produto.
  if (nmResource !== nmResource.toLowerCase()) {
    return <Navigate to={resourcePath(nmResource)} replace />
  }

  const nmComponent = nmResource.toUpperCase()
  const resource = menu.find((m) => m.nm_resource.toUpperCase() === nmComponent) ?? {
    nm_resource: nmComponent,
    nm_friendly: nmComponent,
    type: "MasterDetails",
    icon: "",
    tx_descricao: "",
    destaques: []
  }

  // key: trocar de tela recria o estado (seleção, modais de ação) do zero.
  return <GenericGridMenu key={nmComponent} Resource={resource} />
}
