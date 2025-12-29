import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const ProtectedRoute = ({ children, requireCreator = false }) => {
  const { isAuthenticated, isCreator, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated()) {
    return <Navigate to="/" replace />
  }

  if (requireCreator && !isCreator()) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute

