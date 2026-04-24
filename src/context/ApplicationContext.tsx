import { createContext, useContext, useMemo, useState } from 'react'
import type {
  ApplicationContextType,
  FormInputType,
  JobApplication,

} from '../types/types'

import { fetchApplication, createApplication, removeApplication } from '../api/applications'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const ApplicationContext = createContext<ApplicationContextType | null>(null)

export const ApplicationContextProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  const queryClient = useQueryClient()
  const userId = localStorage.getItem('userId') || ''

  // ─────────────────────────────
  // UI STATE (YOU CONTROL THIS)
  // ─────────────────────────────
  const [activeFilter, setActiveFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('Date')

  // ─────────────────────────────
  // SERVER STATE (React Query)
  // ─────────────────────────────
  const {
    data: applications = [],
    isLoading,
    isError
  } = useQuery({
    queryKey: ['posts', userId],
    queryFn: () => fetchApplication(userId),
    enabled: !!userId
  })

  

  // ─────────────────────────────
  // MUTATIONS
  // ─────────────────────────────
  const { mutate: createApp } = useMutation({
    mutationFn: (data: FormInputType) => createApplication(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', userId] })
    }
  })

  const { mutate: deleteApp } = useMutation({
    mutationFn: (id: string) => removeApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', userId] })
    }
  })

  // ─────────────────────────────
  // CONTEXT VALUE
  // ─────────────────────────────
  return (
    <ApplicationContext.Provider
      value={{
        applications,

        createApp,
        deleteApp,

        search,
        setSearch,

        activeFilter,
        setActiveFilter,

        sortBy,
        setSortBy,

        isLoading,
        isError
      }}
    >
      {children}
    </ApplicationContext.Provider>
  )
}

// ─────────────────────────────
// CUSTOM HOOK
// ─────────────────────────────
export const useApplicationContext = () => {
  const context = useContext(ApplicationContext)

  if (!context) {
    throw new Error('Context must be within the provider')
  }

  return context
}