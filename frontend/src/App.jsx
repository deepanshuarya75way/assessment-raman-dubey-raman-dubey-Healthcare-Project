import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import PrivateRoute from './components/PrivateRoute'

import Home from './pages/Home'
import Doctor from './pages/Doctor'
import Login from './pages/Login'
import About from './pages/About'
import Contact from './pages/Contact'
import MyProfile from './pages/MyProfile'
import MyAppointment from './pages/MyAppointment'
import Appointment from './pages/Appointment'

import AdminLogin from './pages/admin/AdminLogin'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminDoctors from './pages/admin/AdminDoctors'
import AdminAppointments from './pages/admin/AdminAppointments'
import AdminAddDoctor from './pages/admin/AdminAddDoctor'
import AdminUsers from './pages/admin/AdminUsers'

import DoctorLogin from './pages/doctor/DoctorLogin'
import DoctorLayout from './pages/doctor/DoctorLayout'
import DoctorDashboard from './pages/doctor/DoctorDashboard'
import DoctorAppointments from './pages/doctor/DoctorAppointments'
import DoctorProfile from './pages/doctor/DoctorProfile'

const App = () => {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')
  const isDoctorRoute = location.pathname.startsWith('/doctor-panel')

  return (
    <div className={isAdminRoute || isDoctorRoute ? '' : 'mx-4 sm:mx-[10%]'}>

      <ScrollToTop />
      {!isAdminRoute && !isDoctorRoute && <Navbar />}

      <Routes>
        {/* User Routes */}
        <Route path='/' element={<Home />} />
        <Route path='/doctor' element={<Doctor />} />
        <Route path='/doctor/:speciality' element={<Doctor />} />
        <Route path='/login' element={<Login />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/my-profile' element={<PrivateRoute><MyProfile /></PrivateRoute>} />
        <Route path='/my-appointment' element={<PrivateRoute><MyAppointment /></PrivateRoute>} />
        <Route path='/appointment/:docId' element={<PrivateRoute><Appointment /></PrivateRoute>} />

        {/* Admin Routes */}
        <Route path='/admin/login' element={<AdminLogin />} />
        <Route path='/admin' element={<AdminLayout />}>
          <Route path='dashboard' element={<AdminDashboard />} />
          <Route path='doctors' element={<AdminDoctors />} />
          <Route path='add-doctor' element={<AdminAddDoctor />} />
          <Route path='appointments' element={<AdminAppointments />} />
          <Route path='users' element={<AdminUsers />} />
        </Route>

        {/* Doctor Panel Routes */}
        <Route path='/doctor-panel/login' element={<DoctorLogin />} />
        <Route path='/doctor-panel' element={<DoctorLayout />}>
          <Route path='dashboard' element={<DoctorDashboard />} />
          <Route path='appointments' element={<DoctorAppointments />} />
          <Route path='profile' element={<DoctorProfile />} />
        </Route>
      </Routes>

      {!isAdminRoute && !isDoctorRoute && <Footer />}

    </div>
  )
}

export default App