import jwt from 'jsonwebtoken'

const authDoctor = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Not authorized. Please login.' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (decoded.role !== 'doctor') {
      return res.status(403).json({ success: false, message: 'Not authorized as doctor.' })
    }

    req.doctorId = decoded.id
    next()

  } catch (error) {
    console.error('Doctor auth error:', error.message)
    res.status(401).json({ success: false, message: 'Token invalid or expired.' })
  }
}

export default authDoctor
