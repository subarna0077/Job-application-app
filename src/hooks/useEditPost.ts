import {useMutation, useQueryClient} from '@tanstack/react-query'
import { API_BASE_URL } from '../config/api'
import type { FormInputType } from '../types/types'


export const useEditPost = ()=>{
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({id, data}: {id: string, data: FormInputType})=> {
            const response =   await fetch(`${API_BASE_URL}/posts/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...data,
                    updatedAt: new Date()
                })
            })
            const result = await response.json()
            if(!response.ok) throw new Error(result.message || 'Failed to update')
        },
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey: ['posts']})
        }
        
    })

}