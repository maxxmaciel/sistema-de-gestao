import { createContext, Dispatch, SetStateAction } from "react"
import { MenuDataSchema, UserData } from "./interfaces"

export interface AppContextType {
  userData: UserData
  setUserData: Dispatch<SetStateAction<UserData>>
  loadingUser: boolean
  /** Relê o usuário e o menu da sessão. Devolve true se há sessão. */
  refreshUser: () => Promise<boolean>
  menu: MenuDataSchema[]
}

export const AppContext = createContext<AppContextType | undefined>(undefined)
