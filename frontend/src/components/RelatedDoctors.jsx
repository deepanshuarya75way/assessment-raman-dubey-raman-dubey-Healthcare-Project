import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const RelatedDoctors = ({ speciality, docId }) => {
  const { doctors } = useContext(AppContext)
  const navigate = useNavigate()

  const [relDoc, setRelDoc] = useState([])

  useEffect(() => {
    if (doctors.length > 0 && speciality) {
      const doctorsData = doctors.filter(
        (doc) => doc.speciality === speciality && doc._id !== docId
      )
      setRelDoc(doctorsData)
    }
  }, [doctors, speciality, docId])

  return (
    <div className='flex flex-col items-center gap-4 my-16 md:mx-10'>

      <h2 className='section-title'>
        Related <span className='accent'>Doctors</span>
      </h2>
      <p className='sm:w-1/3 text-center text-sm text-[var(--text-muted)]'>
        Simply browse through our extensive list of trusted doctors.
      </p>

      <div className='w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
        {relDoc.slice(0, 5).map((item, index) => (
          <div
            onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }}
            className='doctor-card'
            key={item._id}
          >
            <div className='overflow-hidden bg-gradient-to-b from-[var(--primary-lighter)] to-[var(--teal-lighter)]'>
              <img className='w-full' src={item.image} alt={item.name} />
            </div>
            <div className='p-4'>
              <div className='badge-available'>
                <p>Available</p>
              </div>
              <p className='text-[var(--text-primary)] text-lg font-semibold mt-1'>{item.name}</p>
              <p className='text-[var(--text-muted)] text-sm'>{item.speciality}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

export default RelatedDoctors
