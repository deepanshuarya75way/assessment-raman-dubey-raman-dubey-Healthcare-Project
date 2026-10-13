import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AppContext } from '../../context/AppContext'
import Logo from '../../components/Logo'

const AdminLogin = () => {
  const { backendUrl } = useContext(AppContext)
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken')
    if (adminToken) {
      navigate('/admin/dashboard')
    }
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data } = await axios.post(`${backendUrl}/api/admin/login`, { email, password })
      if (data.success) {
        localStorage.setItem('adminToken', data.token)
        toast.success(data.message)
        navigate('/admin/dashboard')
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center' style={{ background: 'linear-gradient(135deg, #f8fdff 0%, #f0f9ff 50%, #f5fffe 100%)' }}>
      <form onSubmit={onSubmit} className='glass-card-static flex flex-col gap-4 items-start p-8 min-w-[340px] sm:min-w-96'>

        <div className='mb-2'>
          <Logo />
        </div>

        <p className='text-2xl font-bold text-[var(--text-primary)]'>Admin Panel</p>
        <p className='text-[var(--text-muted)] text-sm'>Login to manage DocConnect</p>

        <div className='w-full'>
          <p className='font-medium mb-1 text-sm text-[var(--text-secondary)]'>Email</p>
          <input
            className='input-field'
            type='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder='admin@docconnect.com'
          />
        </div>

        <div className='w-full'>
          <p className='font-medium mb-1 text-sm text-[var(--text-secondary)]'>Password</p>
          <input
            className='input-field'
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            placeholder='Enter password'
          />
        </div>

        <button
          type='submit'
          disabled={loading}
          className='btn-primary w-full mt-2 disabled:opacity-60 disabled:cursor-not-allowed'
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className='text-[var(--text-muted)] text-xs text-center w-full mt-2'>
          This area is restricted to authorized administrators only.
        </p>

      </form>
    </div>
  )
}

export default AdminLogin
