import React, { useContext, useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'

const Login = () => {

  const { backendUrl, token, setToken } = useContext(AppContext)
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [state, setState] = useState('Sign Up')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    setLoading(true)

    try {
      const url = state === 'Sign Up'
        ? `${backendUrl}/api/user/register`
        : `${backendUrl}/api/user/login`

      const body = state === 'Sign Up'
        ? { name, email, password }
        : { email, password }

      const { data } = await axios.post(url, body)

      if (data.success) {
        setToken(data.token)
        toast.success(data.message)
        navigate(from, { replace: true })
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token])

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='glass-card-static flex flex-col gap-4 m-auto items-start p-8 min-w-[340px] sm:min-w-96 text-[var(--text-secondary)] text-sm'>

        <p className='text-2xl font-bold text-[var(--text-primary)]'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</p>
        <p className='text-[var(--text-muted)]'>Please {state === 'Sign Up' ? 'sign up' : 'log in'} to book appointment</p>

        {
          state === 'Sign Up' &&
          <div className='w-full'>
            <p className='font-medium mb-1'>Full Name</p>
            <input
              className='input-field'
              type='text'
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>
        }

        <div className='w-full'>
          <p className='font-medium mb-1'>Email</p>
          <input
            className='input-field'
            type='email'
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>

        <div className='w-full'>
          <p className='font-medium mb-1'>Password</p>
          <input
            className='input-field'
            type='password'
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
            minLength={6}
          />
        </div>

        <button
          type='submit'
          disabled={loading}
          className='btn-primary w-full mt-2 disabled:opacity-60 disabled:cursor-not-allowed'
        >
          {loading ? 'Please wait...' : (state === 'Sign Up' ? 'Create Account' : 'Login')}
        </button>

        {
          state === 'Sign Up'
            ? <p className='text-[var(--text-muted)]'>Already have an account? <span onClick={() => setState('Login')} className='text-[var(--primary)] font-medium underline cursor-pointer hover:text-[var(--primary-dark)] transition-colors'>Login here</span></p>
            : <p className='text-[var(--text-muted)]'>Create a new account? <span onClick={() => setState('Sign Up')} className='text-[var(--primary)] font-medium underline cursor-pointer hover:text-[var(--primary-dark)] transition-colors'>Click here</span></p>
        }

      </div>
    </form>
  )
}

export default Login