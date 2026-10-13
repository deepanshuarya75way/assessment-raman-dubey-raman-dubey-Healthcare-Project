import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const TopDoctors = () => {
  const navigate = useNavigate()
  const { doctors } = useContext(AppContext)

  return (
    <section className='flex flex-col items-center gap-4 my-16 md:mx-10'>

      <h2 className='section-title'>
        Top Doctors to <span className='accent'>Book</span>
      </h2>

      <p className='sm:w-1/3 text-center text-sm text-[var(--text-muted)]'>
        Simply browse through our extensive list of trusted doctors.
      </p>

      <div className='w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
        {doctors.slice(0, 10).map((item, index) => (
          <div
            onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }}
            className='doctor-card'
            key={item._id}
            style={{ animationDelay: `${index * 0.05}s` }}
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

      <button
        onClick={() => { navigate('/doctor'); scrollTo(0, 0) }}
        className='btn-outline mt-10'
      >
        View More
      </button>

    </section>
  )
}

export default TopDoctors
