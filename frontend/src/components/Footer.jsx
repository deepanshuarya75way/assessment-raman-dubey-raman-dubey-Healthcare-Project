import React from 'react'
import Logo from './Logo'

const Footer = () => {
  return (
    <div className='md:mx-10'>

      {/* Gradient top accent line */}
      <div className='h-1 w-full rounded-full gradient-primary opacity-30 mt-20'></div>

      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 text-sm'>

        {/* Left Section */}
        <div>
          <div className='mb-5'>
            <Logo />
          </div>
          <p className='w-full md:w-2/3 text-[var(--text-muted)] leading-6'>
            DocConnect makes healthcare accessible by connecting patients with trusted doctors. Book appointments seamlessly, manage your health records, and receive personalized care — all from one platform.
          </p>
        </div>

        {/* Center Section */}
        <div>
          <p className='text-xl font-semibold mb-5 text-[var(--text-primary)]'>COMPANY</p>
          <ul className='flex flex-col gap-2 text-[var(--text-muted)]'>
            <li className='hover:text-[var(--primary)] cursor-pointer transition-colors duration-200'>Home</li>
            <li className='hover:text-[var(--primary)] cursor-pointer transition-colors duration-200'>About us</li>
            <li className='hover:text-[var(--primary)] cursor-pointer transition-colors duration-200'>Contact us</li>
            <li className='hover:text-[var(--primary)] cursor-pointer transition-colors duration-200'>Privacy policy</li>
          </ul>
        </div>

        {/* Right Section */}
        <div>
          <p className='text-xl font-semibold mb-5 text-[var(--text-primary)]'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-2 text-[var(--text-muted)]'>
            <li>+1-212-456-7890</li>
            <li>support@docconnect.com</li>
          </ul>
        </div>

      </div>

      {/* Copyright */}
      <div>
        <hr className='border-[var(--border-subtle)]' />
        <p className='py-5 text-sm text-center text-[var(--text-muted)]'>Copyright 2024 &copy; DocConnect — All Rights Reserved.</p>
      </div>

    </div>
  )
}

export default Footer
