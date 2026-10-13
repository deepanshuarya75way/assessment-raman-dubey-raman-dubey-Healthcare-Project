import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets_frontend/assets'
import { toast } from 'react-toastify'
import axios from 'axios'

const MyProfile = () => {

  const { backendUrl, token, userData, setUserData, getUserProfile } = useContext(AppContext)
  const navigate = useNavigate()

  const [isEdit, setIsEdit] = useState(false)
  const [loading, setLoading] = useState(false)
  const [localData, setLocalData] = useState(null)

  useEffect(() => {
    if (userData) {
      setLocalData({ ...userData })
    }
  }, [userData])

  const saveProfile = async () => {
    setLoading(true)
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/user/profile`,
        {
          name: localData.name,
          phone: localData.phone,
          address: localData.address,
          gender: localData.gender,
          dob: localData.dob
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        setUserData(data.userData)
        setIsEdit(false)
        toast.success(data.message)
      }
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const uploadImage = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('image', file)

    try {
      const { data } = await axios.put(
        `${backendUrl}/api/user/profile/image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      if (data.success) {
        setUserData(data.userData)
        toast.success(data.message)
      }
    } catch (error) {
      toast.error('Failed to upload image')
    }
  }

  if (!localData) {
    return (
      <div className='min-h-[60vh] flex items-center justify-center'>
        <p className='text-[var(--text-muted)]'>Loading profile...</p>
      </div>
    )
  }

  const profileImageSrc = localData.image
    ? (localData.image.startsWith('http') ? localData.image : `${backendUrl}${localData.image}`)
    : assets.profile_pic

  return (
    <div className='max-w-lg flex flex-col gap-2 text-sm pt-6'>

      <div className='glass-card-static p-6'>
        {/* Profile Image with Upload */}
        <div className='relative inline-block'>
          <img className='w-36 rounded-xl shadow-md' src={profileImageSrc} alt='Profile' />
          <label className='absolute bottom-2 right-2 w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center cursor-pointer shadow-lg hover:bg-[var(--primary-dark)] transition-colors'>
            <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z' />
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 13a3 3 0 11-6 0 3 3 0 016 0z' />
            </svg>
            <input type='file' accept='image/*' className='hidden' onChange={uploadImage} />
          </label>
        </div>

        {
          isEdit
            ? <input className='input-field text-3xl font-semibold max-w-60 mt-4' type='text' value={localData.name} onChange={e => setLocalData(prev => ({ ...prev, name: e.target.value }))} />
            : <p className='font-bold text-3xl text-[var(--text-primary)] mt-4'>{localData.name}</p>
        }

        <hr className='bg-[var(--border-subtle)] h-[1px] border-none my-4' />

        {/* Contact Information */}
        <div>
          <p className='text-[var(--primary)] font-semibold underline mt-3'>CONTACT INFORMATION</p>
          <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-[var(--text-secondary)]'>

            <p className='font-medium'>Email id:</p>
            <p className='text-[var(--primary)]'>{localData.email}</p>

            <p className='font-medium'>Phone:</p>
            {
              isEdit
                ? <input className='input-field max-w-52' type='text' value={localData.phone || ''} onChange={e => setLocalData(prev => ({ ...prev, phone: e.target.value }))} />
                : <p className='text-[var(--teal)]'>{localData.phone || 'Not set'}</p>
            }

            <p className='font-medium'>Address:</p>
            {
              isEdit
                ? <p>
                  <input className='input-field mb-1' type='text' value={localData.address?.line1 || ''} onChange={(e) => setLocalData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} />
                  <input className='input-field' type='text' value={localData.address?.line2 || ''} onChange={(e) => setLocalData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} />
                </p>
                : <p className='text-[var(--text-muted)]'>
                  {localData.address?.line1 || 'Not set'}
                  <br />
                  {localData.address?.line2 || ''}
                </p>
            }

          </div>
        </div>

        {/* Basic Information */}
        <div>
          <p className='text-[var(--primary)] font-semibold underline mt-5'>BASIC INFORMATION</p>
          <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-[var(--text-secondary)]'>

            <p className='font-medium'>Gender:</p>
            {
              isEdit
                ? <select className='input-field max-w-28' onChange={(e) => setLocalData(prev => ({ ...prev, gender: e.target.value }))} value={localData.gender || 'Not Selected'}>
                  <option value='Male'>Male</option>
                  <option value='Female'>Female</option>
                  <option value='Not Selected'>Not Selected</option>
                </select>
                : <p className='text-[var(--text-muted)]'>{localData.gender || 'Not Selected'}</p>
            }

            <p className='font-medium'>Birthday:</p>
            {
              isEdit
                ? <input className='input-field max-w-36' type='date' onChange={(e) => setLocalData(prev => ({ ...prev, dob: e.target.value }))} value={localData.dob || ''} />
                : <p className='text-[var(--text-muted)]'>{localData.dob || 'Not set'}</p>
            }

          </div>
        </div>

        <div className='mt-8'>
          {
            isEdit
              ? <button
                  className='btn-primary disabled:opacity-60'
                  onClick={saveProfile}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save information'}
                </button>
              : <button className='btn-outline' onClick={() => setIsEdit(true)}>Edit</button>
          }
        </div>
      </div>

    </div>
  )
}

export default MyProfile