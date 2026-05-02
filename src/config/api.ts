// add this temporarily to debug
console.log('API URL:', import.meta.env.VITE_API_URL)

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export const JOBS_LIST_URL = import.meta.env.VITE_RAPID_URL

export const JOB_DETAIL_URL = import.meta.env.VITE_DETAIL_URL