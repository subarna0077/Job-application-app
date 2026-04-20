import { create } from 'zustand'
import type { LoginFormType } from '../pages/Login';
import type { RegisterDataType } from '../types/types';

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthStore {
    user: User | null;
    login: (data: LoginFormType) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    register: (data: RegisterDataType) => Promise<void>;
    loading: boolean;
    initialize: () => void;

}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    isAuthenticated: false,
    loading: true,

    initialize: () => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const email = localStorage.getItem('email')
        const name = localStorage.getItem('name');

        if (token && userId) {
            set({
                isAuthenticated: true,
                user: { id: userId, email: email || '', name: name || ''  }
            })
        }
        set({ loading: false })
    },

    login: async (FormData: LoginFormType) => {
        const response = await fetch('http://localhost:3001/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(FormData)
        })

        const data = await response.json()

        if (response.ok) {
            localStorage.setItem('token', data.accessToken)
            localStorage.setItem('userId', data.user.id)
            localStorage.setItem('name', data.user.name)
            localStorage.setItem('email', data.user.email)

            set({
                user: data.user,
                isAuthenticated: true
            })

        }
        else {
            alert("failed to login")
        }
    },

    register: async (formData) => {
        const response = await fetch('http://localhost:3001/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })

        if (response.ok) {
            alert('User registered')
        } else {
            alert('Failed to register')
        }
    },

    logout: () => {
        localStorage.removeItem('token')
        localStorage.removeItem('userId')

        set({
            user: null,
            isAuthenticated: false
        })
    }

}))