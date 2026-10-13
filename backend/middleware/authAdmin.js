import jwt from 'jsonwebtoken'

const authAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Not authorized. Admin login required.' })
    }

    const token = authHeader.split(' ')[1]

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Verify this is an admin token
    if (decoded.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied. Admin only.' })
    }

    req.adminId = decoded.id
    next()
  } catch (error) {
    console.error('Admin auth error:', error.message)
    res.status(401).json({ success: false, message: 'Admin token is invalid or expired.' })
  }
}

export default authAdmin
