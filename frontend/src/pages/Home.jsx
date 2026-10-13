import React from 'react'
import { assets } from '../assets/assets_frontend/assets'
import SpecialityMenu from '../components/SpecialityMenu'
import TopDoctors from '../components/TopDoctors'
import Banner from '../components/Banner'

const Home = () => {
  return (
    <div>

      {/* ================= HERO SECTION ================= */}
      <div className='flex flex-col md:flex-row flex-wrap gradient-hero rounded-2xl px-6 md:px-10 lg:px-20 relative overflow-hidden'>

        {/* Floating decorations */}
        <div className='floating-orb floating-orb-1'></div>
        <div className='floating-orb floating-orb-2'></div>

        {/* Left Side */}
        <div className='md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px] relative z-10'>
          <p className='text-3xl md:text-4xl lg:text-5xl text-white font-bold leading-tight md:leading-tight lg:leading-tight animate-fade-in-up'>
            Book Appointment <br /> With Trusted Doctors
          </p>

          <div className='flex flex-col md:flex-row items-center gap-3 text-white/90 text-sm font-light animate-fade-in-up animate-delay-200'>
            <img className='w-28' src={assets.group_profiles} alt='Group Profiles' />
            <p>Simply browse through our extensive list of trusted doctors, <br className='hidden sm:block' /> schedule your appointment hassle-free.</p>
          </div>

          <a href='#speciality' className='flex items-center gap-2 bg-white px-8 py-3 rounded-full text-[var(--primary-dark)] text-sm font-semibold m-auto md:m-0 hover:scale-105 hover:shadow-lg transition-all duration-300 animate-fade-in-up animate-delay-300'>
            Book appointment
            <img className='w-3' src={assets.arrow_icon} alt='Arrow' />
          </a>
        </div>

        {/* Right Side */}
        <div className='md:w-1/2 relative'>
          <img
            className='w-full md:absolute bottom-0 h-auto rounded-lg animate-slide-in-right'
            src={assets.header_img}
            alt='Hero Banner'
          />
        </div>

      </div>

      {/* ================= SPECIALITY MENU ================= */}
      <SpecialityMenu />

      {/* ================= TOP DOCTORS ================= */}
      <TopDoctors />

      {/* ================= BANNER ================= */}
      <Banner />

    </div>
  )
}

export default Home