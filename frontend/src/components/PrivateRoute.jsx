import React, { useContext } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const PrivateRoute = ({ children }) => {
  const { token } = useContext(AppContext)
  const location = useLocation()

  if (!token) {
    return <Navigate to='/login' state={{ from: location }} replace />
  }

  return children
}

export default PrivateRoute
