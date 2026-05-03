export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// build all URLs from the same base
export const JOBS_LIST_URL = `${API_BASE_URL}/api/jobs`
export const JOB_DETAIL_URL = `${API_BASE_URL}/api/job-detail`