import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'

const MyAppointment = () => {

  const { backendUrl, token } = useContext(AppContext)
  const navigate = useNavigate()

  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/appointments/my`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data.success) {
        setAppointments(data.appointments)
      }
    } catch (error) {
      toast.error('Failed to fetch appointments')
    } finally {
      setLoading(false)
    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/appointments/cancel/${appointmentId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        toast.success(data.message)
        fetchAppointments()
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel appointment')
    }
  }

  const payAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/appointments/pay/${appointmentId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        toast.success(data.message)
        fetchAppointments()
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment failed')
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [])

  if (loading) {
    return (
      <div className='min-h-[60vh] flex items-center justify-center'>
        <p className='text-[var(--text-muted)]'>Loading appointments...</p>
      </div>
    )
  }

  return (
    <div>

      <p className='pb-3 mt-12 font-bold text-xl text-[var(--text-primary)] border-b border-[var(--border-subtle)]'>My Appointments</p>

      {appointments.length === 0 ? (
        <div className='text-center py-20'>
          <p className='text-[var(--text-muted)] text-lg'>No appointments yet.</p>
          <button onClick={() => navigate('/doctor')} className='btn-primary mt-4'>
            Find a Doctor
          </button>
        </div>
      ) : (
        <div>
          {appointments.map((item) => (
            <div className='glass-card-static grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 px-4 my-3' key={item._id}>

              <div>
                <img
                  className='w-32 rounded-xl bg-gradient-to-b from-[var(--primary-lighter)] to-[var(--teal-lighter)]'
                  src={item.docData?.image?.startsWith('http') ? item.docData.image : `${backendUrl}${item.docData?.image}`}
                  alt={item.docData?.name}
                />
              </div>

              <div className='flex-1 text-sm text-[var(--text-secondary)]'>
                <p className='text-[var(--text-primary)] font-semibold text-base'>{item.docData?.name}</p>
                <p>{item.docData?.speciality}</p>
                <p className='text-[var(--text-primary)] font-medium mt-1'>Address:</p>
                <p className='text-xs text-[var(--text-muted)]'>{item.docData?.address?.line1}</p>
                <p className='text-xs text-[var(--text-muted)]'>{item.docData?.address?.line2}</p>
                <p className='text-xs mt-1'>
                  <span className='text-sm text-[var(--text-primary)] font-medium'>Date & Time:</span>{' '}
                  <span className='text-[var(--text-muted)]'>{item.slotDate} | {item.slotTime}</span>
                </p>
              </div>

              <div></div>

              <div className='flex flex-col gap-2 justify-end'>
                {!item.cancelled ? (
                  <>
                    {item.isCompleted ? (
                      <span className='text-green-600 font-medium text-sm text-center py-2 px-4 bg-green-50 rounded-full'>✓ Completed</span>
                    ) : item.payment ? (
                      <span className='text-green-600 font-medium text-sm text-center py-2 px-4 bg-green-50 rounded-full'>✓ Paid</span>
                    ) : (
                      <button
                        onClick={() => payAppointment(item._id)}
                        className='btn-primary text-sm sm:min-w-48 py-2'
                      >
                        Pay Online
                      </button>
                    )}
                    {!item.isCompleted && (
                      <button
                        onClick={() => cancelAppointment(item._id)}
                        className='btn-outline text-sm sm:min-w-48 py-2 !border-red-400 !text-red-500 hover:!bg-red-500 hover:!text-white hover:!border-red-500'
                      >
                        Cancel appointment
                      </button>
                    )}
                  </>
                ) : (
                  <span className='text-red-500 font-medium text-sm text-center py-2'>Cancelled</span>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  )
}

export default MyAppointment