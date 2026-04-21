import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../context/userStore'

export const ProtectedRoute = ({children}: {children: React.ReactNode}) => {

  const isAuthenticated = useAuthStore((s)=> s.isAuthenticated)
  const loading = useAuthStore((s)=> s.loading)

  if(loading) {
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


