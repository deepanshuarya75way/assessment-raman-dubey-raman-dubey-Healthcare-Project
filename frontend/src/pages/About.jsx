import React from 'react'
import { assets } from '../assets/assets_frontend/assets'

const About = () => {
  return (
    <div>

      {/* Title */}
      <div className='text-center text-2xl pt-10'>
        <p className='section-title'>ABOUT <span className='accent'>US</span></p>
      </div>

      {/* About Content */}
      <div className='my-10 flex flex-col md:flex-row gap-12'>

        <img className='w-full md:max-w-[360px] rounded-2xl shadow-md' src={assets.about_image} alt='About DocConnect' />

        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-[var(--text-secondary)]'>
          <p>Welcome to DocConnect, your trusted partner in managing your healthcare needs conveniently and efficiently. At DocConnect, we understand the challenges individuals face when it comes to scheduling doctor appointments and managing their health records.</p>
          <p>DocConnect is committed to excellence in healthcare technology. We continuously strive to enhance our platform, integrating the latest advancements to improve user experience and deliver superior service. Whether you're booking your first appointment or managing ongoing care, DocConnect is here to support you every step of the way.</p>
          <b className='text-[var(--text-primary)]'>Our Vision</b>
          <p>Our vision at DocConnect is to create a seamless healthcare experience for every user. We aim to bridge the gap between patients and healthcare providers, making it easier for you to access the care you need, when you need it.</p>
        </div>

      </div>

      {/* Why Choose Us */}
      <div className='text-xl my-4'>
        <p className='section-title'>WHY <span className='accent'>CHOOSE US</span></p>
      </div>

      <div className='flex flex-col md:flex-row mb-20 gap-1'>

        <div className='glass-card px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] text-[var(--text-secondary)] cursor-pointer hover:gradient-primary hover:text-white rounded-l-xl md:rounded-l-xl rounded-r-none md:rounded-r-none flex-1' style={{ borderRadius: 'var(--radius-lg) 0 0 var(--radius-lg)' }}>
          <b>Efficiency:</b>
          <p>Streamlined appointment scheduling that fits into your busy lifestyle.</p>
        </div>

        <div className='glass-card px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] text-[var(--text-secondary)] cursor-pointer hover:gradient-primary hover:text-white flex-1' style={{ borderRadius: 0 }}>
          <b>Convenience:</b>
          <p>Access to a network of trusted healthcare professionals in your area.</p>
        </div>

        <div className='glass-card px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] text-[var(--text-secondary)] cursor-pointer hover:gradient-primary hover:text-white flex-1' style={{ borderRadius: '0 var(--radius-lg) var(--radius-lg) 0' }}>
          <b>Personalization:</b>
          <p>Tailored recommendations and reminders to help you stay on top of your health.</p>
        </div>

      </div>

    </div>
  )
}

export default About