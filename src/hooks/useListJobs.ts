import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { JOBS_LIST_URL } from '../config/api'

export interface JobFilters {
    role?: string;
    location?: string;
    datePosted?: 'all' | 'today' | '3days' | 'week' | 'month';
    employmentType?: 'FULLTIME' | 'PARTTIME' | 'CONTRACT' | 'INTERN';
    remote?: boolean;
}

export const useListJobs = (filters: JobFilters = {}) => {

    return useInfiniteQuery({
        initialPageParam: 1,
        queryKey: ['jobs', filters.role, filters.location, filters.datePosted, filters.employmentType, filters.remote],
        queryFn: async ({pageParam}) => {
            const params = new URLSearchParams()
            if (filters.role) params.append("role", filters.role);
            if (filters.location) params.append("location", filters.location);
            if (filters.datePosted) params.append("datePosted", filters.datePosted);
            if (filters.employmentType) params.append("employmentType", filters.employmentType);
            if (filters.remote === true) params.append("remote", "true");

            params.append('page', String(pageParam))


            const response = await fetch(`${JOBS_LIST_URL}?${params.toString()}`)
            const result = await response.json()
            console.log('Result from frontend', result)
            if (!response.ok) throw new Error(result.message || 'Error occured')
            return result
        },
        getNextPageParam: (lastPage, allPages) => {
    if (!lastPage.jobs || lastPage.jobs.length === 0) return undefined
    return allPages.length + 1
}
      
    })
}
