import {useMutation} from '@tanstack/react-query'
import { useAuthStore } from '../features/user/stores'
import { API_BASE_URL } from '../config/api'
import type { LoginFormType } from '../pages/Login'


export const useLogin = ()=>{
    const setAuth = useAuthStore((state)=> state.setAuth)
    return useMutation({
        mutationFn: async (data: LoginFormType)=>{
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

            const result = await response.json()
            console.log(result)
            if(!response.ok) throw new Error(result || 'Login failed')
            return result;
        },

        onSuccess: (data)=>{
            setAuth(data.accessToken, data.user)
        }
    })
}