import {useQuery} from '@tanstack/react-query'
import { API_BASE_URL } from '../config/api'
import { useAuthStore } from '../features/auth/stores'
import type { JobApplication } from '../types/types'


export const useGetPosts = ()=>{

    const user = useAuthStore((state)=> state.user)
    return useQuery<JobApplication[]>({
        queryKey: ['posts', 'userId'],
        queryFn: async ()=>{
            const response = await fetch(`${API_BASE_URL}/posts?userID=${user?.id}`)
            const result = await response.json()
            console.log(result)
            if(!response.ok) throw new Error(result || 'Failed to fetch')
            return result
        }
    })
}