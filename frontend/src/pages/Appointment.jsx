import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets_frontend/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import { toast } from 'react-toastify'
import axios from 'axios'

const Appointment = () => {
  const { docId } = useParams()
  const { doctors, currencySymbol, backendUrl, token } = useContext(AppContext)
  const navigate = useNavigate()
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  const [docInfo, setDocInfo] = useState(null)
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')
  const [booking, setBooking] = useState(false)

  const fetchDocInfo = () => {
    const doc = doctors.find(d => d._id === docId)
    setDocInfo(doc)
  }

  const getAvailableSlots = () => {
    setDocSlots([])

    let today = new Date()

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)

      let endTime = new Date()
      endTime.setDate(today.getDate() + i)
      endTime.setHours(21, 0, 0, 0)

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
      } else {
        currentDate.setHours(10)
        currentDate.setMinutes(0)
      }

      let timeSlots = []

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime
        })

        currentDate.setMinutes(currentDate.getMinutes() + 30)
      }

      setDocSlots(prev => ([...prev, timeSlots]))
    }
  }

  const bookAppointment = async () => {
    if (!token) {
      toast.warn('Please login to book an appointment.')
      navigate('/login')
      return
    }
    if (!slotTime) {
      toast.warn('Please select a time slot.')
      return
    }

    setBooking(true)

    try {
      const slotDate = docSlots[slotIndex][0]?.datetime.toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric'
      })

      const { data } = await axios.post(
        `${backendUrl}/api/appointments/book`,
        { docId, slotDate, slotTime },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        toast.success(data.message)
        setSlotTime('')
        navigate('/my-appointment')
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to book appointment.')
    } finally {
      setBooking(false)
    }
  }

  useEffect(() => {
    fetchDocInfo()
  }, [doctors, docId])

  useEffect(() => {
    if (docInfo) getAvailableSlots()
  }, [docInfo])

  return docInfo && (
    <div>

      {/* ---------- Doctor Details ---------- */}
      <div className='flex flex-col sm:flex-row gap-4'>

        <div>
          <img className='gradient-primary w-full sm:max-w-72 rounded-2xl' src={docInfo.image} alt={docInfo.name} />
        </div>

        <div className='glass-card-static flex-1 p-8 py-7 mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>

          <p className='flex items-center gap-2 text-2xl font-bold text-[var(--text-primary)]'>
            {docInfo.name}
            <img className='w-5' src={assets.verified_icon} alt='Verified' />
          </p>

          <div className='flex items-center gap-2 text-sm mt-1 text-[var(--text-muted)]'>
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className='py-0.5 px-3 border border-[var(--primary-light)] text-xs rounded-full text-[var(--primary)] font-medium bg-[var(--primary-lighter)]'>{docInfo.experience}</button>
          </div>

          <div>
            <p className='flex items-center gap-1 text-sm font-semibold text-[var(--text-primary)] mt-3'>
              About
              <img className='w-3' src={assets.info_icon} alt='Info' />
            </p>
            <p className='text-sm text-[var(--text-muted)] max-w-[700px] mt-1'>{docInfo.about}</p>
          </div>

          <p className='text-[var(--text-secondary)] font-semibold mt-4'>
            Appointment fee: <span className='text-[var(--primary)] font-bold'>{currencySymbol}{docInfo.fees}</span>
          </p>

        </div>

      </div>

      {/* ---------- Booking Slots ---------- */}
      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-[var(--text-primary)]'>
        <p className='font-bold text-lg'>Booking slots</p>

        <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
          {docSlots.length > 0 && docSlots.map((item, index) => (
            <div
              onClick={() => setSlotIndex(index)}
              className={`text-center py-6 min-w-16 rounded-full cursor-pointer transition-all duration-300 ${slotIndex === index ? 'gradient-primary text-white shadow-lg scale-105' : 'glass-card-static hover:border-[var(--primary-light)]'}`}
              key={index}
            >
              <p className='font-semibold text-sm'>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
              <p className='text-lg'>{item[0] && item[0].datetime.getDate()}</p>
            </div>
          ))}
        </div>

        <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
          {docSlots.length > 0 && docSlots[slotIndex].map((item, index) => (
            <p
              onClick={() => setSlotTime(item.time)}
              className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer transition-all duration-300 ${item.time === slotTime ? 'gradient-primary text-white shadow-md' : 'text-[var(--text-muted)] border border-[var(--border-subtle)] hover:border-[var(--primary-light)] hover:text-[var(--primary)]'}`}
              key={index}
            >
              {item.time.toLowerCase()}
            </p>
          ))}
        </div>



        <button
          onClick={bookAppointment}
          disabled={booking}
          className='btn-primary px-14 py-3 my-6 disabled:opacity-60 disabled:cursor-not-allowed'
        >
          {booking ? 'Booking...' : 'Book an appointment'}
        </button>
      </div>

      {/* ---------- Related Doctors ---------- */}
      <RelatedDoctors docId={docId} speciality={docInfo.speciality} />

    </div>
  )
}

export default Appointment
