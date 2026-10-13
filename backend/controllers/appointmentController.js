import Appointment from '../models/appointmentModel.js'
import Doctor from '../models/doctorModel.js'
import User from '../models/userModel.js'
import { sendBookingConfirmation, sendCancellationEmail } from '../utils/email.js'

// @desc    Book an appointment
// @route   POST /api/appointments/book
// @access  Private
export const bookAppointment = async (req, res) => {
  try {
    const { docId, slotDate, slotTime } = req.body
    const userId = req.userId

    if (!docId || !slotDate || !slotTime) {
      return res.status(400).json({ success: false, message: 'Please provide all booking details.' })
    }

    // Get doctor data
    const docData = await Doctor.findById(docId)
    if (!docData) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' })
    }

    if (!docData.available) {
      return res.status(400).json({ success: false, message: 'Doctor is not available.' })
    }

    // Check if slot is already booked
    let slots_booked = docData.slots_booked || {}
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.status(400).json({ success: false, message: 'This slot is already booked.' })
      }
      slots_booked[slotDate].push(slotTime)
    } else {
      slots_booked[slotDate] = [slotTime]
    }

    // Get user data
    const userData = await User.findById(userId)
    if (!userData) {
      return res.status(404).json({ success: false, message: 'User not found.' })
    }

    // Create appointment
    const appointment = await Appointment.create({
      userId,
      docId,
      slotDate,
      slotTime,
      userData: {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        image: userData.image
      },
      docData: {
        name: docData.name,
        speciality: docData.speciality,
        image: docData.image,
        fees: docData.fees,
        address: docData.address
      },
      amount: docData.fees,
      date: Date.now()
    })

    // Update doctor's booked slots
    await Doctor.findByIdAndUpdate(docId, { slots_booked })

    // Send booking confirmation email (non-blocking)
    sendBookingConfirmation(userData.email, userData.name, docData.name, slotDate, slotTime)

    res.status(201).json({
      success: true,
      appointment,
      message: 'Appointment booked successfully!'
    })

  } catch (error) {
    console.error('Book appointment error:', error.message)
    res.status(500).json({ success: false, message: 'Server error.' })
  }
}

// @desc    Get user's appointments
// @route   GET /api/appointments/my
// @access  Private
export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.userId }).sort({ date: -1 })

    res.json({ success: true, appointments })

  } catch (error) {
    console.error('Get appointments error:', error.message)
    res.status(500).json({ success: false, message: 'Server error.' })
  }
}

// @desc    Cancel an appointment
// @route   PUT /api/appointments/cancel/:id
// @access  Private
export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' })
    }

    // Verify ownership
    if (appointment.userId.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this appointment.' })
    }

    if (appointment.cancelled) {
      return res.status(400).json({ success: false, message: 'Appointment is already cancelled.' })
    }

    // Mark as cancelled
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

    // Send cancellation email (non-blocking)
    sendCancellationEmail(
      appointment.userData?.email,
      appointment.userData?.name,
      appointment.docData?.name,
      appointment.slotDate,
      appointment.slotTime
    )

    res.json({ success: true, message: 'Appointment cancelled successfully.' })

  } catch (error) {
    console.error('Cancel appointment error:', error.message)
    res.status(500).json({ success: false, message: 'Server error.' })
  }
}

// @desc    Simulate payment for an appointment
// @route   PUT /api/appointments/pay/:id
// @access  Private
export const payAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' })
    }

    if (appointment.userId.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized.' })
    }

    if (appointment.cancelled) {
      return res.status(400).json({ success: false, message: 'Cannot pay for a cancelled appointment.' })
    }

    if (appointment.payment) {
      return res.status(400).json({ success: false, message: 'Payment already completed.' })
    }

    // In production, integrate Razorpay/Stripe here
    // For now, simulate successful payment
    appointment.payment = true
    await appointment.save()

    res.json({ success: true, message: 'Payment successful!' })

  } catch (error) {
    console.error('Payment error:', error.message)
    res.status(500).json({ success: false, message: 'Server error.' })
  }
}
