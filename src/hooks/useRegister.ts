import { useMutation } from '@tanstack/react-query'
import type{ RegisterDataType } from '../types/types'
import { API_BASE_URL } from '../config/api'

export const useRegister = () => {

    return useMutation({
        mutationFn: async (RegisterData: RegisterDataType) => {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(RegisterData)
            })
            const result = await response.json()
            if(!response.ok) throw new Error(result || "Register failed")
        },
        onSuccess: (data)=> {
            console.log(data)
        }

    })

}