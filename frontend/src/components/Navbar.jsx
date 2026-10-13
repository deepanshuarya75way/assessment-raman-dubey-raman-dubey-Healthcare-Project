import React, { useContext, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets_frontend/assets'
import Logo from './Logo'

const Navbar = () => {
  const navigate = useNavigate()
  const { token, setToken, userData } = useContext(AppContext)
  const [showMenu, setShowMenu] = useState(false)

  const logout = () => {
    setToken('')
    navigate('/')
  }

  return (
    <nav className='glass-nav sticky top-0 z-50 flex items-center justify-between text-sm py-3 px-4 sm:px-8 mb-5'>

      {/* Logo */}
      <div onClick={() => navigate('/')} className='cursor-pointer'>
        <Logo />
      </div>

      {/* Desktop Navigation */}
      <ul className='hidden md:flex items-center gap-8'>
        <NavLink to='/' className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          HOME
        </NavLink>
        <NavLink to='/doctor' className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          ALL DOCTORS
        </NavLink>
        <NavLink to='/about' className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          ABOUT
        </NavLink>
        <NavLink to='/contact' className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          CONTACT
        </NavLink>
      </ul>

      <div className='flex items-center gap-4'>
        {
          token
            ? <div className='flex items-center gap-2 cursor-pointer group relative'>
              <img className='w-9 h-9 rounded-full object-cover border-2 border-[var(--primary-light)] shadow-sm' src={userData?.image || assets.profile_pic} alt='Profile' />
              <img className='w-2.5' src={assets.dropdown_icon} alt='Dropdown' />

              {/* Dropdown Menu */}
              <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                <div className='dropdown-menu min-w-48 flex flex-col gap-3 p-4'>
                  <p onClick={() => navigate('/my-profile')} className='hover:text-[var(--primary)] cursor-pointer transition-colors duration-200'>My Profile</p>
                  <p onClick={() => navigate('/my-appointment')} className='hover:text-[var(--primary)] cursor-pointer transition-colors duration-200'>My Appointments</p>
                  <p onClick={logout} className='hover:text-red-500 cursor-pointer transition-colors duration-200'>Logout</p>
                </div>
              </div>
            </div>
            : <button
              onClick={() => navigate('/login')}
              className='btn-primary hidden md:block'
            >
              Create account
            </button>
        }

        {/* Mobile Menu Icon */}
        <img
          onClick={() => setShowMenu(true)}
          className='w-6 md:hidden cursor-pointer'
          src={assets.menu_icon}
          alt='Menu'
        />

        {/* Mobile Menu */}
        <div className={`${showMenu ? 'fixed w-full' : 'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-50 overflow-hidden bg-white/95 backdrop-blur-xl transition-all duration-300`}>
          <div className='flex items-center justify-between px-5 py-6'>
            <Logo size='small' />
            <img
              className='w-7 cursor-pointer'
              onClick={() => setShowMenu(false)}
              src={assets.cross_icon}
              alt='Close'
            />
          </div>
          <ul className='flex flex-col items-center gap-4 mt-8 px-5 text-lg font-medium'>
            <NavLink onClick={() => setShowMenu(false)} to='/' className={({ isActive }) => `nav-link text-lg ${isActive ? 'active' : ''}`}>
              HOME
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/doctor' className={({ isActive }) => `nav-link text-lg ${isActive ? 'active' : ''}`}>
              ALL DOCTORS
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/about' className={({ isActive }) => `nav-link text-lg ${isActive ? 'active' : ''}`}>
              ABOUT
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/contact' className={({ isActive }) => `nav-link text-lg ${isActive ? 'active' : ''}`}>
              CONTACT
            </NavLink>
          </ul>
        </div>
      </div>

    </nav>
  )
}

export default Navbar