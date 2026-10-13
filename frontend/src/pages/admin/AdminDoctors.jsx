import React, { useContext, useEffect, useState } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const AdminDoctors = () => {
  const { adminToken } = useOutletContext()
  const { backendUrl } = useContext(AppContext)
  const navigate = useNavigate()

  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchDoctors = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctors`)
      if (data.success) {
        setDoctors(data.doctors)
      }
    } catch (error) {
      console.error('Fetch doctors error:', error.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleAvailability = async (docId) => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/admin/doctors/${docId}/availability`,
        {},
        { headers: { Authorization: `Bearer ${adminToken}` } }
      )
      if (data.success) {
        toast.success(data.message)
        fetchDoctors()
      }
    } catch (error) {
      toast.error('Failed to update availability')
    }
  }

  const deleteDoctor = async (docId, docName) => {
    if (!window.confirm(`Are you sure you want to delete ${docName}?`)) return

    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/admin/doctors/${docId}`,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      )
      if (data.success) {
        toast.success(data.message)
        fetchDoctors()
      }
    } catch (error) {
      toast.error('Failed to delete doctor')
    }
  }

  useEffect(() => {
    fetchDoctors()
  }, [])

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <p className='text-[var(--text-muted)]'>Loading doctors...</p>
      </div>
    )
  }

  return (
    <div>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-bold text-[var(--text-primary)]'>All Doctors ({doctors.length})</h1>
        <button
          onClick={() => navigate('/admin/add-doctor')}
          className='btn-primary flex items-center gap-2'
        >
          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
          </svg>
          Add Doctor
        </button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
        {doctors.map((doc) => (
          <div key={doc._id} className='glass-card-static p-4 flex gap-4'>
            <img
              className='w-20 h-20 rounded-xl object-cover bg-gradient-to-b from-[var(--primary-lighter)] to-[var(--teal-lighter)]'
              src={doc.image?.startsWith('http') ? doc.image : `${backendUrl}${doc.image}`}
              alt={doc.name}
            />
            <div className='flex-1 min-w-0'>
              <p className='font-semibold text-[var(--text-primary)] truncate'>{doc.name}</p>
              <p className='text-xs text-[var(--text-muted)]'>{doc.speciality}</p>
              <p className='text-xs text-[var(--text-muted)] mt-1'>{doc.degree} · {doc.experience}</p>
              <p className='text-sm font-semibold text-[var(--primary)] mt-1'>${doc.fees}</p>

              <div className='flex items-center gap-2 mt-2'>
                {/* Availability Toggle */}
                <button
                  onClick={() => toggleAvailability(doc._id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    doc.available
                      ? 'bg-green-50 text-green-600 hover:bg-green-100'
                      : 'bg-red-50 text-red-600 hover:bg-red-100'
                  }`}
                >
                  {doc.available ? '✓ Available' : '✗ Unavailable'}
                </button>

                {/* Delete */}
                <button
                  onClick={() => deleteDoctor(doc._id, doc.name)}
                  className='px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-500 hover:bg-red-100 transition-all'
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {doctors.length === 0 && (
        <div className='text-center py-20'>
          <p className='text-[var(--text-muted)] text-lg'>No doctors found.</p>
          <button onClick={() => navigate('/admin/add-doctor')} className='btn-primary mt-4'>
            Add First Doctor
          </button>
        </div>
      )}
    </div>
  )
}

export default AdminDoctors
