import { create } from 'zustand'
import type { JobApplication, ApplicationCountByStatus } from '../types/types'
import { API_BASE_URL } from '../config/api'

const applicationCount: ApplicationCountByStatus = {
  applied: 0,
  interview: 0,
  offers: 0,
  rejected: 0
}

interface ApplicationStore {
  applications: JobApplication[]
  activeFilter: string
  fetchApplications: () => Promise<void>
  addApplication: (data: Omit<JobApplication, 'id' | 'userId'>) => Promise<void>
  updateApplication: (id: string, data: Partial<JobApplication>) => Promise<void>
  deleteApplication: (id: string) => Promise<void>
  setActiveFilter: (filter: string) => void
  filteredApplications: () => JobApplication[]
  applicationCount: () => ApplicationCountByStatus
}

export const useApplicationStore = create<ApplicationStore>((set, get) => ({
  applications: [],
  activeFilter: 'All',

  fetchApplications: async () => {
    const userId = localStorage.getItem('userId')
    if (!userId) return
    const res = await fetch(`${API_BASE_URL}/applications?userId=${userId}`)
    const data = await res.json()
    set({ applications: data })
  },

  addApplication: async (data) => {
    const userId = localStorage.getItem('userId')
    const res = await fetch(`${API_BASE_URL}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, userId, id: crypto.randomUUID() })
    })
    if (res.ok) {
      get().fetchApplications()  // ← refresh after adding
    }
  },

  updateApplication: async (id, data) => {
    const res = await fetch(`${API_BASE_URL}/applications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (res.ok) {
      get().fetchApplications()  // ← refresh after updating
    }
  },

  deleteApplication: async (id) => {
    const res = await fetch(`${API_BASE_URL}/applications/${id}`, {
      method: 'DELETE'
    })
    if (res.ok) {
      get().fetchApplications()  // ← refresh after deleting
    }
  },

  setActiveFilter: (filter) => {
    set({ activeFilter: filter })
  },

  // derived — not state, just a calculation
  filteredApplications: () => {
    const { applications, activeFilter } = get()
    if (activeFilter === 'All') return applications
    return applications.filter(app => 
      app.status === activeFilter.toLowerCase()
    )
  },

  // derived — count per status
  applicationCount: () => {
    const { applications } = get()
    return applications.reduce((acc, app) => {
      return {
        ...acc,
        [app.status]: acc[app.status as keyof ApplicationCountByStatus] + 1
      }
    }, { ...applicationCount })
  }
}))