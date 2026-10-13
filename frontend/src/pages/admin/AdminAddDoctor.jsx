import React, { useContext, useState } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const AdminAddDoctor = () => {
  const { adminToken } = useOutletContext()
  const { backendUrl } = useContext(AppContext)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    speciality: 'General physician',
    degree: '',
    experience: '',
    about: '',
    fees: '',
    address: { line1: '', line2: '' }
  })
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'line1' || name === 'line2') {
      setFormData(prev => ({
        ...prev,
        address: { ...prev.address, [name]: value }
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const fd = new FormData()
      fd.append('name', formData.name)
      fd.append('email', formData.email)
      fd.append('speciality', formData.speciality)
      fd.append('degree', formData.degree)
      fd.append('experience', formData.experience)
      fd.append('about', formData.about)
      fd.append('fees', formData.fees)
      fd.append('address', JSON.stringify(formData.address))
      if (image) fd.append('image', image)

      const { data } = await axios.post(
        `${backendUrl}/api/admin/doctors`,
        fd,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      if (data.success) {
        toast.success(data.message)
        navigate('/admin/doctors')
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add doctor')
    } finally {
      setLoading(false)
    }
  }

  const specialities = [
    'General physician',
    'Gynecologist',
    'Dermatologist',
    'Pediatricians',
    'Neurologist',
    'Gastroenterologist'
  ]

  return (
    <div>
      <h1 className='text-2xl font-bold text-[var(--text-primary)] mb-6'>Add New Doctor</h1>

      <form onSubmit={onSubmit} className='glass-card-static p-8 max-w-3xl'>

        {/* Image Upload */}
        <div className='mb-6'>
          <label className='block text-sm font-medium text-[var(--text-secondary)] mb-2'>Doctor Photo</label>
          <div className='flex items-center gap-4'>
            <label className='cursor-pointer'>
              {imagePreview ? (
                <img
                  className='w-24 h-24 rounded-xl object-cover border-2 border-dashed border-[var(--primary-light)]'
                  src={imagePreview}
                  alt='Preview'
                />
              ) : (
                <div className='w-24 h-24 rounded-xl border-2 border-dashed border-[var(--primary-light)] flex items-center justify-center bg-[var(--primary-lighter)]'>
                  <svg className='w-8 h-8 text-[var(--primary)]' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
                  </svg>
                </div>
              )}
              <input type='file' accept='image/*' className='hidden' onChange={handleImageChange} />
            </label>
            <p className='text-xs text-[var(--text-muted)]'>Click to upload photo (max 5MB)</p>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-[var(--text-secondary)] mb-1'>Name *</label>
            <input className='input-field' name='name' value={formData.name} onChange={handleChange} required placeholder='Dr. John Doe' />
          </div>

          <div>
            <label className='block text-sm font-medium text-[var(--text-secondary)] mb-1'>Email *</label>
            <input className='input-field' name='email' type='email' value={formData.email} onChange={handleChange} required placeholder='doctor@example.com' />
          </div>

          <div>
            <label className='block text-sm font-medium text-[var(--text-secondary)] mb-1'>Speciality *</label>
            <select className='input-field' name='speciality' value={formData.speciality} onChange={handleChange}>
              {specialities.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-[var(--text-secondary)] mb-1'>Degree</label>
            <input className='input-field' name='degree' value={formData.degree} onChange={handleChange} placeholder='MBBS, MD' />
          </div>

          <div>
            <label className='block text-sm font-medium text-[var(--text-secondary)] mb-1'>Experience</label>
            <input className='input-field' name='experience' value={formData.experience} onChange={handleChange} placeholder='4 Years' />
          </div>

          <div>
            <label className='block text-sm font-medium text-[var(--text-secondary)] mb-1'>Fees ($) *</label>
            <input className='input-field' name='fees' type='number' value={formData.fees} onChange={handleChange} required placeholder='50' />
          </div>

          <div>
            <label className='block text-sm font-medium text-[var(--text-secondary)] mb-1'>Address Line 1</label>
            <input className='input-field' name='line1' value={formData.address.line1} onChange={handleChange} placeholder='Street address' />
          </div>

          <div>
            <label className='block text-sm font-medium text-[var(--text-secondary)] mb-1'>Address Line 2</label>
            <input className='input-field' name='line2' value={formData.address.line2} onChange={handleChange} placeholder='City, Country' />
          </div>
        </div>

        <div className='mt-4'>
          <label className='block text-sm font-medium text-[var(--text-secondary)] mb-1'>About</label>
          <textarea
            className='input-field min-h-[100px] resize-y'
            name='about'
            value={formData.about}
            onChange={handleChange}
            placeholder='Brief description about the doctor...'
          />
        </div>

        <div className='flex gap-3 mt-6'>
          <button
            type='submit'
            disabled={loading}
            className='btn-primary disabled:opacity-60 disabled:cursor-not-allowed'
          >
            {loading ? 'Adding...' : 'Add Doctor'}
          </button>
          <button
            type='button'
            onClick={() => navigate('/admin/doctors')}
            className='btn-outline'
          >
            Cancel
          </button>
        </div>

      </form>
    </div>
  )
}

export default AdminAddDoctor
