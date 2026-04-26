import {useQuery} from '@tanstack/react-query'
import { API_BASE_URL } from '../config/api'
import { useAuthStore } from '../features/user/stores'


export const useGetPosts = ()=>{

    const user = useAuthStore((state)=> state.user)
    return useQuery({
        queryKey: ['posts', 'userId'],
        queryFn: async ()=>{
            const response = await fetch(`${API_BASE_URL}/posts?userID=${user?.id}`)
            const url = `${API_BASE_URL}/posts?userID=${user?.id}`
            console.log(url)
            const result = await response.json()
            if(!response.ok) throw new Error(result || 'Failed to fetch')
            return result
        }
    })
}