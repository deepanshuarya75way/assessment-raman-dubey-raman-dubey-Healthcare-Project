import React, { useContext, useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const AdminAppointments = () => {
  const { adminToken } = useOutletContext()
  const { backendUrl } = useContext(AppContext)

  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, pending, completed, cancelled

  const fetchAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/appointments`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      })
      if (data.success) {
        setAppointments(data.appointments)
      }
    } catch (error) {
      console.error('Fetch appointments error:', error.message)
    } finally {
      setLoading(false)
    }
  }

  const cancelAppointment = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/admin/appointments/cancel/${id}`,
        {},
        { headers: { Authorization: `Bearer ${adminToken}` } }
      )
      if (data.success) {
        toast.success(data.message)
        fetchAppointments()
      }
    } catch (error) {
      toast.error('Failed to cancel')
    }
  }

  const completeAppointment = async (id) => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/admin/appointments/complete/${id}`,
        {},
        { headers: { Authorization: `Bearer ${adminToken}` } }
      )
      if (data.success) {
        toast.success(data.message)
        fetchAppointments()
      }
    } catch (error) {
      toast.error('Failed to mark as completed')
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [])

  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'pending') return !apt.cancelled && !apt.isCompleted
    if (filter === 'completed') return apt.isCompleted
    if (filter === 'cancelled') return apt.cancelled
    return true
  })

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <p className='text-[var(--text-muted)]'>Loading appointments...</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className='text-2xl font-bold text-[var(--text-primary)] mb-6'>All Appointments</h1>

      {/* Filter Tabs */}
      <div className='flex gap-2 mb-6'>
        {['all', 'pending', 'completed', 'cancelled'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all capitalize ${
              filter === f
                ? 'gradient-primary text-white shadow-md'
                : 'glass-card-static text-[var(--text-secondary)] hover:text-[var(--primary)]'
            }`}
          >
            {f} ({
              f === 'all' ? appointments.length
              : f === 'pending' ? appointments.filter(a => !a.cancelled && !a.isCompleted).length
              : f === 'completed' ? appointments.filter(a => a.isCompleted).length
              : appointments.filter(a => a.cancelled).length
            })
          </button>
        ))}
      </div>

      {/* Appointments Table */}
      {filteredAppointments.length === 0 ? (
        <div className='text-center py-16'>
          <p className='text-[var(--text-muted)] text-lg'>No {filter !== 'all' ? filter : ''} appointments found.</p>
        </div>
      ) : (
        <div className='glass-card-static overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='bg-[var(--primary-lighter)]'>
                  <th className='text-left py-3 px-4 text-[var(--text-secondary)] font-semibold'>#</th>
                  <th className='text-left py-3 px-4 text-[var(--text-secondary)] font-semibold'>Patient</th>
                  <th className='text-left py-3 px-4 text-[var(--text-secondary)] font-semibold'>Doctor</th>
                  <th className='text-left py-3 px-4 text-[var(--text-secondary)] font-semibold'>Date & Time</th>
                  <th className='text-left py-3 px-4 text-[var(--text-secondary)] font-semibold'>Amount</th>
                  <th className='text-left py-3 px-4 text-[var(--text-secondary)] font-semibold'>Payment</th>
                  <th className='text-left py-3 px-4 text-[var(--text-secondary)] font-semibold'>Status</th>
                  <th className='text-left py-3 px-4 text-[var(--text-secondary)] font-semibold'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((apt, i) => (
                  <tr key={apt._id} className='border-b border-[var(--border-subtle)] hover:bg-[var(--primary-lighter)] transition-colors'>
                    <td className='py-3 px-4 text-[var(--text-muted)]'>{i + 1}</td>
                    <td className='py-3 px-4'>
                      <p className='font-medium text-[var(--text-primary)]'>{apt.userData?.name}</p>
                      <p className='text-xs text-[var(--text-muted)]'>{apt.userData?.email}</p>
                    </td>
                    <td className='py-3 px-4'>
                      <p className='font-medium text-[var(--text-primary)]'>{apt.docData?.name}</p>
                      <p className='text-xs text-[var(--text-muted)]'>{apt.docData?.speciality}</p>
                    </td>
                    <td className='py-3 px-4 text-[var(--text-muted)]'>
                      {apt.slotDate}<br/>{apt.slotTime}
                    </td>
                    <td className='py-3 px-4 font-semibold text-[var(--primary)]'>${apt.amount}</td>
                    <td className='py-3 px-4'>
                      {apt.payment ? (
                        <span className='px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600'>Paid</span>
                      ) : (
                        <span className='px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500'>Unpaid</span>
                      )}
                    </td>
                    <td className='py-3 px-4'>
                      {apt.cancelled ? (
                        <span className='px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600'>Cancelled</span>
                      ) : apt.isCompleted ? (
                        <span className='px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600'>Completed</span>
                      ) : (
                        <span className='px-3 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-600'>Pending</span>
                      )}
                    </td>
                    <td className='py-3 px-4'>
                      {!apt.cancelled && !apt.isCompleted && (
                        <div className='flex gap-2'>
                          <button
                            onClick={() => completeAppointment(apt._id)}
                            className='px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600 hover:bg-green-100 transition-colors'
                            title='Mark as completed'
                          >
                            ✓ Complete
                          </button>
                          <button
                            onClick={() => cancelAppointment(apt._id)}
                            className='px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-500 hover:bg-red-100 transition-colors'
                            title='Cancel appointment'
                          >
                            ✗ Cancel
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminAppointments
