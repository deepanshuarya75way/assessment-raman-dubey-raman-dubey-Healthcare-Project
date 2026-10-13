import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Admin from '../models/adminModel.js'
import Doctor from '../models/doctorModel.js'
import Appointment from '../models/appointmentModel.js'
import User from '../models/userModel.js'

// Generate JWT token for admin
const generateAdminToken = (id) => {
  return jwt.sign({ id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' })
    }

    // Check for admin
    const admin = await Admin.findOne({ email }).select('+password')
    if (!admin) {
      return res.status(400).json({ success: false, message: 'Invalid admin credentials.' })
    }

    const isMatch = await bcrypt.compare(password, admin.password)
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid admin credentials.' })
    }

    const token = generateAdminToken(admin._id)

    res.json({
      success: true,
      token,
      message: 'Admin login successful!'
    })

  } catch (error) {
    console.error('Admin login error:', error.message)
    res.status(500).json({ success: false, message: 'Server error.' })
  }
}

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Admin
export const getDashboard = async (req, res) => {
  try {
    const totalDoctors = await Doctor.countDocuments()
    const totalUsers = await User.countDocuments()
    const totalAppointments = await Appointment.countDocuments()
    const cancelledAppointments = await Appointment.countDocuments({ cancelled: true })
    const completedAppointments = await Appointment.countDocuments({ isCompleted: true })
    const pendingAppointments = await Appointment.countDocuments({ cancelled: false, isCompleted: false })

    // Revenue from completed/paid appointments
    const revenueResult = await Appointment.aggregate([
      { $match: { payment: true, cancelled: false } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ])
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0

    // Recent 5 appointments
    const recentAppointments = await Appointment.find()
      .sort({ date: -1 })
      .limit(5)

    res.json({
      success: true,
      dashboard: {
        totalDoctors,
        totalUsers,
        totalAppointments,
        cancelledAppointments,
        completedAppointments,
        pendingAppointments,
        totalRevenue,
        recentAppointments
      }
    })

  } catch (error) {
    console.error('Dashboard error:', error.message)
    res.status(500).json({ success: false, message: 'Server error.' })
  }
}

// @desc    Get all appointments (admin)
// @route   GET /api/admin/appointments
// @access  Admin
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ date: -1 })
    res.json({ success: true, appointments })
  } catch (error) {
    console.error('Get all appointments error:', error.message)
    res.status(500).json({ success: false, message: 'Server error.' })
  }
}

// @desc    Cancel any appointment (admin)
// @route   PUT /api/admin/appointments/cancel/:id
// @access  Admin
export const adminCancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' })
    }

    appointment.cancelled = true
    await appointment.save()

    // Free the slot on the doctor
    const doctor = await Doctor.findById(appointment.docId)
    if (doctor) {
      let slots_booked = doctor.slots_booked || {}
      if (slots_booked[appointment.slotDate]) {
        slots_booked[appointment.slotDate] = slots_booked[appointment.slotDate].filter(
          (time) => time !== appointment.slotTime
        )
        await Doctor.findByIdAndUpdate(appointment.docId, { slots_booked })
      }
    }

    res.json({ success: true, message: 'Appointment cancelled by admin.' })

  } catch (error) {
    console.error('Admin cancel appointment error:', error.message)
    res.status(500).json({ success: false, message: 'Server error.' })
  }
}

// @desc    Mark appointment as completed (admin)
// @route   PUT /api/admin/appointments/complete/:id
// @access  Admin
export const completeAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' })
    }

    appointment.isCompleted = true
    await appointment.save()

    res.json({ success: true, message: 'Appointment marked as completed.' })

  } catch (error) {
    console.error('Complete appointment error:', error.message)
    res.status(500).json({ success: false, message: 'Server error.' })
  }
}

// @desc    Add a new doctor (admin)
// @route   POST /api/admin/doctors
// @access  Admin
export const addDoctor = async (req, res) => {
  try {
    const { name, email, speciality, degree, experience, about, fees, available, address } = req.body

    if (!name || !email || !speciality || !fees) {
      return res.status(400).json({ success: false, message: 'Please fill required fields (name, email, speciality, fees).' })
    }

    // Check if doctor already exists
    const existingDoctor = await Doctor.findOne({ email })
    if (existingDoctor) {
      return res.status(400).json({ success: false, message: 'A doctor with this email already exists.' })
    }

    // Handle image upload
    let imagePath = ''
    if (req.file) {
      imagePath = '/images/' + req.file.filename
    }

    const doctor = await Doctor.create({
      name,
      email,
      image: imagePath,
      speciality,
      degree: degree || '',
      experience: experience || '',
      about: about || '',
      fees: Number(fees),
      available: available !== undefined ? available : true,
      address: address ? (typeof address === 'string' ? JSON.parse(address) : address) : { line1: '', line2: '' }
    })

    res.status(201).json({
      success: true,
      doctor,
      message: 'Doctor added successfully!'
    })

  } catch (error) {
    console.error('Add doctor error:', error.message)
    res.status(500).json({ success: false, message: 'Server error.' })
  }
}

// @desc    Update a doctor (admin)
// @route   PUT /api/admin/doctors/:id
// @access  Admin
export const updateDoctor = async (req, res) => {
  try {
    const { name, email, speciality, degree, experience, about, fees, available, address } = req.body

    const updateData = {}
    if (name) updateData.name = name
    if (email) updateData.email = email
    if (speciality) updateData.speciality = speciality
    if (degree !== undefined) updateData.degree = degree
    if (experience !== undefined) updateData.experience = experience
    if (about !== undefined) updateData.about = about
    if (fees !== undefined) updateData.fees = Number(fees)
    if (available !== undefined) updateData.available = available
    if (address) updateData.address = typeof address === 'string' ? JSON.parse(address) : address

    // Handle image upload
    if (req.file) {
      updateData.image = '/images/' + req.file.filename
    }

    const doctor = await Doctor.findByIdAndUpdate(req.params.id, updateData, { new: true })

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' })
    }

    res.json({
      success: true,
      doctor,
      message: 'Doctor updated successfully!'
    })

  } catch (error) {
    console.error('Update doctor error:', error.message)
    res.status(500).json({ success: false, message: 'Server error.' })
  }
}

// @desc    Delete a doctor (admin)
// @route   DELETE /api/admin/doctors/:id
// @access  Admin
export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id)
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' })
    }

    res.json({ success: true, message: 'Doctor deleted successfully.' })

  } catch (error) {
    console.error('Delete doctor error:', error.message)
    res.status(500).json({ success: false, message: 'Server error.' })
  }
}

// @desc    Toggle doctor availability (admin)
// @route   PUT /api/admin/doctors/:id/availability
// @access  Admin
export const toggleDoctorAvailability = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' })
    }

    doctor.available = !doctor.available
    await doctor.save()

    res.json({
      success: true,
      available: doctor.available,
      message: `Doctor is now ${doctor.available ? 'available' : 'unavailable'}.`
    })

  } catch (error) {
    console.error('Toggle availability error:', error.message)
    res.status(500).json({ success: false, message: 'Server error.' })
  }
}

// @desc    Get all users (admin)
// @route   GET /api/admin/users
// @access  Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 })
    res.json({ success: true, users })
  } catch (error) {
    console.error('Get all users error:', error.message)
    res.status(500).json({ success: false, message: 'Server error.' })
  }
}
