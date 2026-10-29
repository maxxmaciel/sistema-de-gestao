import { ResponseEXT } from "@/components/Components"
import { axiosGet } from "@/hooks/useFetchData"
import { ReactNode, useCallback, useEffect, useState } from "react"
import { AppContext } from "./context"
import { MenuDataSchema, UserData } from "./interfaces"

/** Sessão do front: quem está logado, em qual projeto e o menu que ele pode ver. */
export function AppProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData>({})
  const [loadingUser, setLoadingUser] = useState(true)
  const [menu, setMenu] = useState<MenuDataSchema[]>([])

  const refreshUser = useCallback(async () => {
    setLoadingUser(true)
    try {
      // Ainda não há cod_projeto: skipProjectCode libera a chamada (ver useFetchData).
      const r = await axiosGet<ResponseEXT<UserData[]>>("user", { a: "r_u" }, { skipProjectCode: true })
      const user = r?.data?.data?.[0]
      setUserData(user ?? {})

      if (user) {
        const m = await axiosGet<ResponseEXT<MenuDataSchema[]>>("c", { a: "menu" }, undefined, user.cod_projeto)
        setMenu(m?.data?.data ?? [])
      }
      return Boolean(user)
    } catch {
      setUserData({})
      return false
    } finally {
      setLoadingUser(false)
    }
  }, [])

  useEffect(() => {
    if (window.location.pathname.startsWith("/login")) {
      setLoadingUser(false)
      return
    }
    void refreshUser()
  }, [refreshUser])

  return (
    <AppContext.Provider value={{ userData, setUserData, loadingUser, refreshUser, menu }}>
      {children}
    </AppContext.Provider>
  )
}
