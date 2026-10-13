import React from 'react'

const Logo = ({ className = '', size = 'default' }) => {
  const sizes = {
    small: { width: 130, fontSize: 18, iconSize: 24 },
    default: { width: 170, fontSize: 22, iconSize: 30 },
    large: { width: 200, fontSize: 26, iconSize: 36 },
  }

  const s = sizes[size] || sizes.default

  return (
    <div className={`flex items-center gap-2 select-none ${className}`} style={{ width: s.width }}>
      {/* Stethoscope + Plus Icon */}
      <svg
        width={s.iconSize}
        height={s.iconSize}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Gradient Defs */}
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0077B6" />
            <stop offset="1" stopColor="#00B4D8" />
          </linearGradient>
        </defs>
        {/* Circle background */}
        <rect width="40" height="40" rx="12" fill="url(#logoGrad)" />
        {/* Plus/Cross icon */}
        <rect x="18" y="10" width="4" height="20" rx="2" fill="white" />
        <rect x="10" y="18" width="20" height="4" rx="2" fill="white" />
        {/* Stethoscope hint — small circle */}
        <circle cx="20" cy="28" r="3" fill="none" stroke="white" strokeWidth="1.5" opacity="0.7" />
      </svg>

      {/* Brand Text */}
      <span
        style={{
          fontSize: s.fontSize,
          fontWeight: 700,
          letterSpacing: '-0.02em',
          lineHeight: 1,
        }}
      >
        <span style={{ color: '#023E8A' }}>Doc</span>
        <span
          style={{
            background: 'linear-gradient(135deg, #0077B6, #00B4D8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Connect
        </span>
      </span>
    </div>
  )
}

export default Logo
