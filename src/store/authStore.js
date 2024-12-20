import { create } from "zustand"
import { persist } from "zustand/middleware"

const authStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      email: null,

      // Функция входа в аккаунт
      login: (email) => set({ isAuthenticated: true, email: email }),

      // Функция выхода из аккаунта
      logout: () => set({ isAuthenticated: false, email: null }),
    }),
    {
      name: "auth-storage", // для хранения токена в localStorage
    }
  )
)

export default authStore
