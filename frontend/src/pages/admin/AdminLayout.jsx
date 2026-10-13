import React, { useContext, useEffect, useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import Logo from '../../components/Logo'

const AdminLayout = () => {
  const navigate = useNavigate()
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken') || '')

  useEffect(() => {
    if (!adminToken) {
      navigate('/admin/login')
    }
  }, [adminToken])

  const logout = () => {
    localStorage.removeItem('adminToken')
    setAdminToken('')
    navigate('/admin/login')
  }

  if (!adminToken) return null

  return (
    <div className='flex min-h-screen' style={{ background: 'linear-gradient(135deg, #f8fdff 0%, #f0f9ff 50%, #f5fffe 100%)' }}>

      {/* Sidebar */}
      <aside className='w-64 flex-shrink-0 glass-card-static rounded-none border-r border-[var(--border-subtle)] flex flex-col'>
        <div className='p-5 border-b border-[var(--border-subtle)]'>
          <Logo />
          <p className='text-xs text-[var(--text-muted)] mt-1 font-medium'>Admin Panel</p>
        </div>

        <nav className='flex-1 p-4 flex flex-col gap-1'>
          <NavLink
            to='/admin/dashboard'
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'gradient-primary text-white shadow-md'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--primary-lighter)] hover:text-[var(--primary)]'
              }`
            }
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z' />
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 5v2m8-2v2' />
            </svg>
            Dashboard
          </NavLink>

          <NavLink
            to='/admin/doctors'
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'gradient-primary text-white shadow-md'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--primary-lighter)] hover:text-[var(--primary)]'
              }`
            }
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' />
            </svg>
            Doctors
          </NavLink>

          <NavLink
            to='/admin/add-doctor'
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'gradient-primary text-white shadow-md'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--primary-lighter)] hover:text-[var(--primary)]'
              }`
            }
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
            </svg>
            Add Doctor
          </NavLink>

          <NavLink
            to='/admin/appointments'
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'gradient-primary text-white shadow-md'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--primary-lighter)] hover:text-[var(--primary)]'
              }`
            }
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
            </svg>
            Appointments
          </NavLink>

          <NavLink
            to='/admin/users'
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'gradient-primary text-white shadow-md'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--primary-lighter)] hover:text-[var(--primary)]'
              }`
            }
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' />
            </svg>
            Users
          </NavLink>
        </nav>

        <div className='p-4 border-t border-[var(--border-subtle)]'>
          <button
            onClick={logout}
            className='flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all duration-200'
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className='flex-1 p-8 overflow-auto'>
        <Outlet context={{ adminToken }} />
      </main>

    </div>
  )
}

export default AdminLayout
