// store/authStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../../types/types'

interface AuthState {
    _hasHydrated: boolean
    isAuthenticated: boolean
    token: string | null
    setAuth: (token: string, user: User | null) => void   // called after login succeeds
    logout: () => void
    setHasHydrated: () => void   // ← missing
    user: User | null

}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            token: null,
            user:null,
            _hasHydrated: false,

            // this is what replaces localStorage.setItem + setIsAuthenticated(true)
            setAuth: (token, user) => set({
                isAuthenticated: true,
                token: token,
                user
            }),

            // same as your old logout()
            logout: () => set({
                isAuthenticated: false,
                token: null
            }),
            setHasHydrated: () => set({ _hasHydrated: true }),
        }),
        {
            name: 'auth-storage',
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated()

            },
            partialize: (state) => ({
                isAuthenticated: state.isAuthenticated,
                token: state.token,
                user: state.user
            })

        }  // persist writes to localStorage automatically
    )
)