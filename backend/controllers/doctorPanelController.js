import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Doctor from '../models/doctorModel.js'
import Appointment from '../models/appointmentModel.js'

// Generate JWT token for doctor
const generateDoctorToken = (id) => {
  return jwt.sign({ id, role: 'doctor' }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

// @desc    Doctor login
// @route   POST /api/doctor-panel/login
// @access  Public
export const doctorLogin = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' })
    }

    const doctor = await Doctor.findOne({ email }).select('+password')
    if (!doctor) {
      return res.status(400).json({ success: false, message: 'Invalid credentials.' })
    }

    if (!doctor.password) {
      return res.status(400).json({
        success: false,
        message: 'No password set. Please ask admin to set your password, or use the first-time setup.'
      })
    }

    const isMatch = await bcrypt.compare(password, doctor.password)
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials.' })
    }

    const token = generateDoctorToken(doctor._id)

    res.json({
      success: true,
      token,
      message: 'Login successful!'
    })

  } catch (error) {
    console.error('Doctor login error:', error.message)
    res.status(500).json({ success: false, message: 'Server error.' })
  }
}

// @desc    Doctor first-time password setup
// @route   POST /api/doctor-panel/setup-password
// @access  Public
export const setupPassword = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' })
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' })
    }

    const doctor = await Doctor.findOne({ email }).select('+password')
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found with this email.' })
    }

    // Only allow setup if no password is set yet
    if (doctor.password) {
      return res.status(400).json({ success: false, message: 'Password already set. Please use login.' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    doctor.password = hashedPassword
    await doctor.save()

    const token = generateDoctorToken(doctor._id)

    res.json({
      success: true,
      token,
      message: 'Password set successfully! You are now logged in.'
    })

  } catch (error) {
    console.error('Setup password error:', error.message)
    res.status(500).json({ success: false, message: 'Server error.' })
  }
}

// @desc    Get doctor's own profile
// @route   GET /api/doctor-panel/profile
// @access  Doctor
export const getDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.doctorId)
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' })
    }

    res.json({ success: true, doctor })

  } catch (error) {
    console.error('Get doctor profile error:', error.message)
    res.status(500).json({ success: false, message: 'Server error.' })
  }
}

// @desc    Update doctor's own profile
// @route   PUT /api/doctor-panel/profile
// @access  Doctor
export const updateDoctorProfile = async (req, res) => {
  try {
    const { about, fees, available, address } = req.body

    const updateData = {}
    if (about !== undefined) updateData.about = about
    if (fees !== undefined) updateData.fees = Number(fees)
    if (available !== undefined) updateData.available = available
    if (address) updateData.address = typeof address === 'string' ? JSON.parse(address) : address

    // Handle image upload
    if (req.file) {
      updateData.image = '/images/' + req.file.filename
    }

    const doctor = await Doctor.findByIdAndUpdate(req.doctorId, updateData, { new: true })

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' })
    }

    res.json({
      success: true,
      doctor,
      message: 'Profile updated successfully!'
    })

  } catch (error) {
    console.error('Update doctor profile error:', error.message)
    res.status(500).json({ success: false, message: 'Server error.' })
  }
}

// @desc    Get doctor's dashboard stats
// @route   GET /api/doctor-panel/dashboard
// @access  Doctor
export const getDoctorDashboard = async (req, res) => {
  try {
    const docId = req.doctorId

    const totalAppointments = await Appointment.countDocuments({ docId })
    const completedAppointments = await Appointment.countDocuments({ docId, isCompleted: true })
    const cancelledAppointments = await Appointment.countDocuments({ docId, cancelled: true })
    const pendingAppointments = await Appointment.countDocuments({ docId, cancelled: false, isCompleted: false })

    // Revenue
    const revenueResult = await Appointment.aggregate([
      { $match: { docId: doctor_id_to_objectId(docId), payment: true, cancelled: false } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ])
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0

    // Recent 5 appointments
    const recentAppointments = await Appointment.find({ docId })
      .sort({ date: -1 })
      .limit(5)

    // Today's appointments
    const today = new Date()
    const todayStr = today.toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric'
    })
    const todayAppointments = await Appointment.countDocuments({
      docId,
      slotDate: todayStr,
      cancelled: false
    })

    res.json({
      success: true,
      dashboard: {
        totalAppointments,
        completedAppointments,
        cancelledAppointments,
        pendingAppointments,
        totalRevenue,
        todayAppointments,
        recentAppointments
      }
    })

  } catch (error) {
    console.error('Doctor dashboard error:', error.message)
    res.status(500).json({ success: false, message: 'Server error.' })
  }
}

// Helper to convert string ID to ObjectId for aggregation
import mongoose from 'mongoose'
function doctor_id_to_objectId(id) {
  return new mongoose.Types.ObjectId(id)
}

// @desc    Get doctor's appointments
// @route   GET /api/doctor-panel/appointments
// @access  Doctor
export const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ docId: req.doctorId }).sort({ date: -1 })
    res.json({ success: true, appointments })
  } catch (error) {
    console.error('Get doctor appointments error:', error.message)
    res.status(500).json({ success: false, message: 'Server error.' })
  }
}

// @desc    Mark appointment as completed (by doctor)
// @route   PUT /api/doctor-panel/appointments/complete/:id
// @access  Doctor
export const doctorCompleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' })
    }

    // Verify this appointment belongs to this doctor
    if (appointment.docId.toString() !== req.doctorId) {
      return res.status(403).json({ success: false, message: 'Not authorized.' })
    }

    if (appointment.cancelled) {
      return res.status(400).json({ success: false, message: 'Cannot complete a cancelled appointment.' })
    }

    appointment.isCompleted = true
    await appointment.save()

    res.json({ success: true, message: 'Appointment marked as completed.' })

  } catch (error) {
    console.error('Doctor complete appointment error:', error.message)
    res.status(500).json({ success: false, message: 'Server error.' })
  }
}

// @desc    Cancel appointment (by doctor)
// @route   PUT /api/doctor-panel/appointments/cancel/:id
// @access  Doctor
export const doctorCancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' })
    }

    if (appointment.docId.toString() !== req.doctorId) {
      return res.status(403).json({ success: false, message: 'Not authorized.' })
    }

    if (appointment.cancelled) {
      return res.status(400).json({ success: false, message: 'Already cancelled.' })
    }

    appointment.cancelled = true
    await appointment.save()

    // Free the slot
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

    res.json({ success: true, message: 'Appointment cancelled.' })

  } catch (error) {
    console.error('Doctor cancel appointment error:', error.message)
    res.status(500).json({ success: false, message: 'Server error.' })
  }
}
