import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../features/auth/stores'

export const ProtectedRoute = ({children}: {children: React.ReactNode}) => {

  const isAuthenticated = useAuthStore((state)=> state.isAuthenticated)
  const hydrated = useAuthStore((state)=> state._hasHydrated)
  console.log(isAuthenticated, hydrated)

 

  if(!hydrated) {
    return <div>Loading...</div>
  }
  if(!isAuthenticated){
    return <Navigate to="/login" replace/>
  }
  return (
    <div>
        {children}    
    </div>
  )
}


