import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Doctor = () => {
  const { speciality } = useParams()
  const { doctors } = useContext(AppContext)
  const navigate = useNavigate()

  const [filterDoc, setFilterDoc] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const [search, setSearch] = useState('')

  const applyFilter = () => {
    let filtered = doctors

    if (speciality) {
      filtered = filtered.filter(doc => doc.speciality === speciality)
    }

    if (search.trim()) {
      filtered = filtered.filter(doc =>
        doc.name.toLowerCase().includes(search.toLowerCase())
      )
    }

    setFilterDoc(filtered)
  }

  useEffect(() => {
    applyFilter()
  }, [doctors, speciality, search])

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

      <p className='text-[var(--text-secondary)]'>Browse through the doctors specialist.</p>

      {/* Search Bar */}
      <div className='mt-4 mb-2'>
        <div className='relative max-w-md'>
          <svg className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
          </svg>
          <input
            className='input-field pl-10'
            type='text'
            placeholder='Search doctors by name...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>

        {/* Filter Toggle (Mobile) */}
        <button
          className={`py-2 px-4 rounded-lg text-sm font-medium transition-all sm:hidden ${showFilter ? 'gradient-primary text-white' : 'glass-card-static text-[var(--text-secondary)]'}`}
          onClick={() => setShowFilter(prev => !prev)}
        >
          Filters
        </button>

        {/* Speciality Sidebar */}
        <div className={`flex-col gap-2 text-sm text-[var(--text-secondary)] ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          {specialities.map((spec) => (
            <p
              key={spec}
              onClick={() => speciality === spec ? navigate('/doctor') : navigate(`/doctor/${spec}`)}
              className={`w-[94vw] sm:w-auto pl-3 py-2 pr-16 rounded-lg transition-all cursor-pointer font-medium ${
                speciality === spec
                  ? 'gradient-primary text-white shadow-md'
                  : 'glass-card-static hover:border-[var(--primary-light)] hover:text-[var(--primary)]'
              }`}
            >
              {spec}
            </p>
          ))}
        </div>

        {/* Doctor Cards Grid */}
        <div className='w-full grid grid-cols-auto gap-4 gap-y-6'>
          {filterDoc.length > 0 ? (
            filterDoc.map((item, index) => (
              <div
                onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }}
                className='doctor-card'
                key={item._id}
              >
                <div className='overflow-hidden bg-gradient-to-b from-[var(--primary-lighter)] to-[var(--teal-lighter)]'>
                  <img className='w-full' src={item.image} alt={item.name} />
                </div>
                <div className='p-4'>
                  <div className={item.available !== false ? 'badge-available' : 'flex items-center gap-1.5 text-xs text-red-500 font-medium'}>
                    {item.available !== false ? (
                      <p>Available</p>
                    ) : (
                      <p>Unavailable</p>
                    )}
                  </div>
                  <p className='text-[var(--text-primary)] text-lg font-semibold mt-1'>{item.name}</p>
                  <p className='text-[var(--text-muted)] text-sm'>{item.speciality}</p>
                </div>
              </div>
            ))
          ) : (
            <div className='col-span-full text-center py-16'>
              <p className='text-[var(--text-muted)] text-lg'>No doctors found{search ? ` for "${search}"` : ''}.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  )
}

export default Doctor