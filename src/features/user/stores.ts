// store/authStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
    isAuthenticated: boolean
    token: string | null
    setAuth: (token: string) => void   // called after login succeeds
    logout: () => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            token: null,

            // this is what replaces localStorage.setItem + setIsAuthenticated(true)
            setAuth: (token) => set({
                isAuthenticated: true,
                token: token
            }),

            // same as your old logout()
            logout: () => set({
                isAuthenticated: false,
                token: null
            }),
        }),
        { name: 'auth-storage' }  // persist writes to localStorage automatically
    )
)