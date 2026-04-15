import React from 'react'
import { Navigate } from 'react-router-dom'
import { useUserContext } from '../context/UserContext'

export const ProtectedRoute = ({children}: {children: React.ReactNode}) => {

  const {isAuthenticated, loading} = useUserContext();

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


