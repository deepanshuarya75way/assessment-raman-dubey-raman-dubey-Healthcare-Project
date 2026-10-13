import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const SpecialityMenu = () => {
  const { specialityData } = useContext(AppContext)

  return (
    <section id="speciality" className='flex flex-col items-center gap-4 py-16'>

      <h2 className='section-title'>
        Find by <span className='accent'>Speciality</span>
      </h2>

      <p className='sm:w-1/3 text-center text-sm text-[var(--text-muted)]'>
        Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.
      </p>

      <div className='flex sm:justify-center gap-4 pt-5 w-full overflow-x-auto pb-2 px-3'>
        {specialityData.map((item, index) => (
          <Link
            onClick={() => scrollTo(0, 0)}
            className='speciality-card min-w-[100px] text-xs'
            key={index}
            to={`/doctor/${item.speciality}`}
          >
            <img className='w-14 sm:w-20 mb-2' src={item.image} alt={item.speciality} />
            <p className='font-medium text-[var(--text-secondary)]'>{item.speciality}</p>
          </Link>
        ))}
      </div>

    </section>
  )
}

export default SpecialityMenu
