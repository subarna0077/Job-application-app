import {useMutation, useQueryClient} from '@tanstack/react-query'
import { API_BASE_URL } from '../config/api'
import type { FormInputType, JobApplication } from '../types/types'
import { useAuthStore } from '../features/user/stores'

export const useCreatePosts = ()=>{
    const queryClient = useQueryClient()

    const user = useAuthStore(state=> state.user)

    return useMutation({
        mutationFn: async (FormData: FormInputType)=> {
            const response = await fetch(`${API_BASE_URL}/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    ...FormData,
                    appliedDate: new Date(),
                    userID: user?.id
                })
            })

            const result = await response.json()
            if(!response.ok) throw new Error(result || 'Failed to create')
            return result;

        },
        onSuccess: ()=> queryClient.invalidateQueries({queryKey: ['posts']})
    })
}