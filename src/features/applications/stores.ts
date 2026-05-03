import {create} from 'zustand'

export type SortBy = 'Date' | 'A-Z'

interface AppState {
    sortBy: SortBy,
    setSortBy : (sort: SortBy)=> void
}

export const useAppStore = create<AppState> ((set)=>({
    sortBy: 'Date',
    setSortBy: (sort)=> set({sortBy: sort})
}))