import React, { useState, useContext } from 'react'
import { assets } from '../assets/assets_frontend/assets'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const Contact = () => {

  const { backendUrl } = useContext(AppContext)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data } = await axios.post(`${backendUrl}/api/contact`, formData)

      if (data.success) {
        toast.success(data.message)
        setSubmitted(true)
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>

      {/* Title */}
      <div className='text-center text-2xl pt-10'>
        <p className='section-title'>CONTACT <span className='accent'>US</span></p>
      </div>

      {/* Contact Content */}
      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-10'>

        <img className='w-full md:max-w-[360px] rounded-2xl shadow-md' src={assets.contact_image} alt='Contact Us' />

        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-lg text-[var(--text-primary)]'>OUR OFFICE</p>
          <p className='text-[var(--text-muted)]'>54709 Willms Station <br /> Suite 350, Washington, USA</p>
          <p className='text-[var(--text-muted)]'>Tel: (415) 555-0132 <br /> Email: support@docconnect.com</p>
          <p className='font-semibold text-lg text-[var(--text-primary)]'>CAREERS AT DOCCONNECT</p>
          <p className='text-[var(--text-muted)]'>Learn more about our teams and job openings.</p>
          <button className='btn-outline'>
            Explore Jobs
          </button>
        </div>

      </div>

      {/* Contact Form */}
      <div className='mb-20'>
        <div className='text-center text-xl mb-8'>
          <p className='section-title'>SEND US A <span className='accent'>MESSAGE</span></p>
          <p className='text-[var(--text-muted)] text-sm mt-2'>Have a question or feedback? Fill out the form below and we'll get back to you.</p>
        </div>

        {submitted ? (
          <div className='glass-card-static max-w-2xl mx-auto p-10 text-center'>
            <div className='w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4'>
              <svg className='w-8 h-8 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
              </svg>
            </div>
            <h3 className='text-xl font-bold text-[var(--text-primary)] mb-2'>Message Sent!</h3>
            <p className='text-[var(--text-muted)] mb-6'>Thank you for reaching out. We'll get back to you within 24 hours.</p>
            <button
              onClick={() => setSubmitted(false)}
              className='btn-outline'
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className='glass-card-static max-w-2xl mx-auto p-8'>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4'>
              <div>
                <label className='block text-sm font-medium text-[var(--text-secondary)] mb-1'>Your Name</label>
                <input
                  className='input-field'
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  placeholder='John Doe'
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-[var(--text-secondary)] mb-1'>Email Address</label>
                <input
                  className='input-field'
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  placeholder='john@example.com'
                  required
                />
              </div>
            </div>

            <div className='mb-4'>
              <label className='block text-sm font-medium text-[var(--text-secondary)] mb-1'>Subject</label>
              <input
                className='input-field'
                type='text'
                name='subject'
                value={formData.subject}
                onChange={handleChange}
                placeholder='How can we help?'
                required
              />
            </div>

            <div className='mb-6'>
              <label className='block text-sm font-medium text-[var(--text-secondary)] mb-1'>Message</label>
              <textarea
                className='input-field min-h-[140px] resize-y'
                name='message'
                value={formData.message}
                onChange={handleChange}
                placeholder='Tell us more about your inquiry...'
                required
              />
            </div>

            <button
              type='submit'
              disabled={loading}
              className='btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed'
            >
              {loading ? (
                <span className='flex items-center justify-center gap-2'>
                  <svg className='animate-spin w-4 h-4' fill='none' viewBox='0 0 24 24'>
                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z' />
                  </svg>
                  Sending...
                </span>
              ) : 'Send Message'}
            </button>

          </form>
        )}
      </div>

    </div>
  )
}

export default Contact