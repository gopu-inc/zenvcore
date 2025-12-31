import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  id: string
  username: string
  email: string
  role: string
}

interface AppState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  theme: "light" | "dark"
  
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setTheme: (theme: "light" | "dark") => void
  logout: () => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      theme: "light",
      
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => {
        set({ token })
        if (token) {
          localStorage.setItem("zenv_token", token)
        }
      },
      setTheme: (theme) => {
        set({ theme })
        if (theme === "dark") {
          document.documentElement.classList.add("dark")
        } else {
          document.documentElement.classList.remove("dark")
        }
      },
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
        localStorage.removeItem("zenv_token")
        localStorage.removeItem("zenv_user")
      },
    }),
    { name: "zenv-store" }
  )
)
