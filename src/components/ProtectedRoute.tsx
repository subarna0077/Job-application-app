import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../context/userStore'
import { useUserContext } from '../context/UserContext'

export const ProtectedRoute = ({children}: {children: React.ReactNode}) => {

  const {isAuthenticated, isLoading} = useUserContext()
  const loading = useAuthStore((s)=> s.loading)

  if(isLoading) {
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


