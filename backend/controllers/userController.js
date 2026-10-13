import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

// @desc    Register a new user
// @route   POST /api/user/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please fill all fields.' })
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists with this email.' })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    })

    const token = generateToken(user._id)

    res.status(201).json({
      success: true,
      token,
      message: 'Account created successfully!'
    })

  } catch (error) {
    console.error('Register error:', error.message)
    res.status(500).json({ success: false, message: 'Server error.' })
  }
}

// @desc    Login user
// @route   POST /api/user/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' })
    }

    // Find user (include password for comparison)
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials.' })
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials.' })
    }

    const token = generateToken(user._id)

    res.json({
      success: true,
      token,
      message: 'Login successful!'
    })

  } catch (error) {
    console.error('Login error:', error.message)
    res.status(500).json({ success: false, message: 'Server error.' })
  }
}

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' })
    }

    res.json({ success: true, userData: user })

  } catch (error) {
    console.error('Get profile error:', error.message)
    res.status(500).json({ success: false, message: 'Server error.' })
  }
}

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const { name, phone, address, gender, dob } = req.body

    const updateData = {}
    if (name) updateData.name = name
    if (phone) updateData.phone = phone
    if (address) updateData.address = address
    if (gender) updateData.gender = gender
    if (dob) updateData.dob = dob

    const user = await User.findByIdAndUpdate(req.userId, updateData, { new: true })

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' })
    }

    res.json({ success: true, userData: user, message: 'Profile updated successfully!' })

  } catch (error) {
    console.error('Update profile error:', error.message)
    res.status(500).json({ success: false, message: 'Server error.' })
  }
}

// @desc    Upload user profile image
// @route   PUT /api/user/profile/image
// @access  Private
export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select an image.' })
    }

    const imagePath = '/images/users/' + req.file.filename

    const user = await User.findByIdAndUpdate(
      req.userId,
      { image: imagePath },
      { new: true }
    )

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' })
    }

    res.json({
      success: true,
      userData: user,
      message: 'Profile image updated successfully!'
    })

  } catch (error) {
    console.error('Upload image error:', error.message)
    res.status(500).json({ success: false, message: 'Server error.' })
  }
}

