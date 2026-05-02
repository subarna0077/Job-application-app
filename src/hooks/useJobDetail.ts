import {useQuery} from '@tanstack/react-query'
import { JOB_DETAIL_URL } from '../config/api'

export const useJobDetail = (jobId: string, country="us") => {

    return useQuery({
        queryFn: async ()=>{
            const params = new URLSearchParams({job_id: jobId, country: country})
            const response = await fetch(`${JOB_DETAIL_URL}?${params}`)  
            const data = await response.json()    
            if(!response.ok) throw new Error(data.message || 'Failed to fetch job detail')
            return data
        },
        queryKey: ['job-detail', jobId],
        enabled: !!jobId
    })

 
}

