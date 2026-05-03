import {useMutation, useQueryClient} from '@tanstack/react-query'
import { API_BASE_URL } from '../config/api'


export const useDeletePost = ()=>{

    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (postId: string)=>{
            const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
                method: 'DELETE',
            })
            const result = await response.json()
            if(!response.ok) throw new Error(result || 'Failed to delete')
            return result;
        },
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey: ['posts']})
        }
    })
}