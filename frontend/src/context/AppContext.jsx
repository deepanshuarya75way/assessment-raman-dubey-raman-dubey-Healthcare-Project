import { createContext, useState, useEffect } from 'react'
import axios from 'axios'
import { specialityData, assets } from '../assets/assets_frontend/assets'

export const AppContext = createContext()

const AppContextProvider = (props) => {

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
  const currencySymbol = '$'

  const [doctors, setDoctors] = useState([])
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [userData, setUserData] = useState(null)

  // Fetch doctors from API
  const getDoctors = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctors`)
      if (data.success) {
        // Map image paths to full backend URL
        const doctorsWithImages = data.doctors.map(doc => ({
          ...doc,
          image: doc.image.startsWith('http') ? doc.image : `${backendUrl}${doc.image}`
        }))
        setDoctors(doctorsWithImages)
      }
    } catch (error) {
      console.error('Failed to fetch doctors:', error.message)
    }
  }

  // Fetch user profile
  const getUserProfile = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data.success) {
        setUserData(data.userData)
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error.message)
      // If token is invalid, clear it
      if (error.response?.status === 401) {
        setToken('')
        localStorage.removeItem('token')
      }
    }
  }

  // Save token to localStorage when it changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
      getUserProfile()
    } else {
      localStorage.removeItem('token')
      setUserData(null)
    }
  }, [token])

  // Fetch doctors on mount
  useEffect(() => {
    getDoctors()
  }, [])

  const value = {
    backendUrl,
    doctors,
    getDoctors,
    specialityData,
    assets,
    currencySymbol,
    token,
    setToken,
    userData,
    setUserData,
    getUserProfile
  }

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}

export default AppContextProvider
