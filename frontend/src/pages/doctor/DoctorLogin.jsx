import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AppContext } from '../../context/AppContext'
import Logo from '../../components/Logo'

const DoctorLogin = () => {
  const { backendUrl } = useContext(AppContext)
  const navigate = useNavigate()

  const [mode, setMode] = useState('login') // 'login' or 'setup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const doctorToken = localStorage.getItem('doctorToken')
    if (doctorToken) {
      navigate('/doctor-panel/dashboard')
    }
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = mode === 'login'
        ? `${backendUrl}/api/doctor-panel/login`
        : `${backendUrl}/api/doctor-panel/setup-password`

      const { data } = await axios.post(url, { email, password })

      if (data.success) {
        localStorage.setItem('doctorToken', data.token)
        toast.success(data.message)
        navigate('/doctor-panel/dashboard')
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

        <p className='text-2xl font-bold text-[var(--text-primary)]'>Doctor Panel</p>
        <p className='text-[var(--text-muted)] text-sm'>
          {mode === 'login' ? 'Login to manage your appointments' : 'Set up your password for first-time access'}
        </p>

        <div className='w-full'>
          <p className='font-medium mb-1 text-sm text-[var(--text-secondary)]'>Email</p>
          <input
            className='input-field'
            type='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder='doctor@email.com'
          />
        </div>

        <div className='w-full'>
          <p className='font-medium mb-1 text-sm text-[var(--text-secondary)]'>
            {mode === 'login' ? 'Password' : 'Create Password'}
          </p>
          <input
            className='input-field'
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
            placeholder={mode === 'login' ? 'Enter password' : 'Min 6 characters'}
          />
        </div>

        <button
          type='submit'
          disabled={loading}
          className='btn-primary w-full mt-2 disabled:opacity-60 disabled:cursor-not-allowed'
        >
          {loading ? 'Please wait...' : (mode === 'login' ? 'Login' : 'Set Password & Login')}
        </button>

        <p className='text-[var(--text-muted)] text-sm text-center w-full'>
          {mode === 'login' ? (
            <>First time? <span onClick={() => setMode('setup')} className='text-[var(--primary)] font-medium underline cursor-pointer hover:text-[var(--primary-dark)] transition-colors'>Setup password</span></>
          ) : (
            <>Already have a password? <span onClick={() => setMode('login')} className='text-[var(--primary)] font-medium underline cursor-pointer hover:text-[var(--primary-dark)] transition-colors'>Login</span></>
          )}
        </p>

      </form>
    </div>
  )
}

export default DoctorLogin
