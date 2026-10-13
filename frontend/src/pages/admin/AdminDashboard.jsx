import React, { useContext, useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'

const AdminDashboard = () => {
  const { adminToken } = useOutletContext()
  const { backendUrl } = useContext(AppContext)
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchDashboard = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/dashboard`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      })
      if (data.success) {
        setDashboard(data.dashboard)
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <p className='text-[var(--text-muted)]'>Loading dashboard...</p>
      </div>
    )
  }

  if (!dashboard) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <p className='text-red-500'>Failed to load dashboard data.</p>
      </div>
    )
  }

  const stats = [
    {
      label: 'Total Doctors',
      value: dashboard.totalDoctors,
      icon: (
        <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' />
        </svg>
      ),
      color: 'from-blue-500 to-blue-600'
    },
    {
      label: 'Total Users',
      value: dashboard.totalUsers,
      icon: (
        <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' />
        </svg>
      ),
      color: 'from-teal-500 to-teal-600'
    },
    {
      label: 'Appointments',
      value: dashboard.totalAppointments,
      icon: (
        <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
        </svg>
      ),
      color: 'from-purple-500 to-purple-600'
    },
    {
      label: 'Revenue',
      value: `$${dashboard.totalRevenue}`,
      icon: (
        <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
        </svg>
      ),
      color: 'from-green-500 to-green-600'
    },
  ]

  const miniStats = [
    { label: 'Pending', value: dashboard.pendingAppointments, color: 'text-yellow-600 bg-yellow-50' },
    { label: 'Completed', value: dashboard.completedAppointments, color: 'text-green-600 bg-green-50' },
    { label: 'Cancelled', value: dashboard.cancelledAppointments, color: 'text-red-600 bg-red-50' },
  ]

  return (
    <div>
      <h1 className='text-2xl font-bold text-[var(--text-primary)] mb-6'>Dashboard</h1>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8'>
        {stats.map((stat, i) => (
          <div key={i} className='glass-card-static p-6 flex items-center gap-4'>
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-md`}>
              {stat.icon}
            </div>
            <div>
              <p className='text-2xl font-bold text-[var(--text-primary)]'>{stat.value}</p>
              <p className='text-sm text-[var(--text-muted)]'>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Mini Stats */}
      <div className='flex gap-4 mb-8'>
        {miniStats.map((s, i) => (
          <div key={i} className={`px-5 py-3 rounded-xl font-semibold text-sm ${s.color}`}>
            {s.label}: {s.value}
          </div>
        ))}
      </div>

      {/* Recent Appointments */}
      <div className='glass-card-static p-6'>
        <h2 className='text-lg font-bold text-[var(--text-primary)] mb-4'>Recent Appointments</h2>

        {dashboard.recentAppointments.length === 0 ? (
          <p className='text-[var(--text-muted)]'>No appointments yet.</p>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b border-[var(--border-subtle)]'>
                  <th className='text-left py-3 px-2 text-[var(--text-muted)] font-medium'>Patient</th>
                  <th className='text-left py-3 px-2 text-[var(--text-muted)] font-medium'>Doctor</th>
                  <th className='text-left py-3 px-2 text-[var(--text-muted)] font-medium'>Date & Time</th>
                  <th className='text-left py-3 px-2 text-[var(--text-muted)] font-medium'>Amount</th>
                  <th className='text-left py-3 px-2 text-[var(--text-muted)] font-medium'>Status</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.recentAppointments.map((apt) => (
                  <tr key={apt._id} className='border-b border-[var(--border-subtle)] hover:bg-[var(--primary-lighter)] transition-colors'>
                    <td className='py-3 px-2 font-medium text-[var(--text-primary)]'>{apt.userData?.name}</td>
                    <td className='py-3 px-2 text-[var(--text-secondary)]'>{apt.docData?.name}</td>
                    <td className='py-3 px-2 text-[var(--text-muted)]'>{apt.slotDate} | {apt.slotTime}</td>
                    <td className='py-3 px-2 font-semibold text-[var(--primary)]'>${apt.amount}</td>
                    <td className='py-3 px-2'>
                      {apt.cancelled ? (
                        <span className='px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600'>Cancelled</span>
                      ) : apt.isCompleted ? (
                        <span className='px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600'>Completed</span>
                      ) : (
                        <span className='px-3 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-600'>Pending</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
