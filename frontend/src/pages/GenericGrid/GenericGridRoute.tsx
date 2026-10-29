import { useAppContext } from "@/hooks/useAppContext"
import { useParams } from "react-router-dom"
import { GenericGridMenu } from "."

/** /r/:nmResource -> GenericGridMenu do item de menu correspondente. */
export function GenericGridRoute() {
  const { nmResource = "" } = useParams()
  const { menu } = useAppContext()

  const resource = menu.find((m) => m.nm_resource === nmResource) ?? {
    nm_resource: nmResource,
    nm_friendly: nmResource,
    type: "MasterDetails",
    icon: "",
    tx_descricao: "",
    destaques: []
  }

  // key: trocar de tela recria o estado (seleção, modais de ação) do zero.
  return <GenericGridMenu key={nmResource} Resource={resource} />
}
