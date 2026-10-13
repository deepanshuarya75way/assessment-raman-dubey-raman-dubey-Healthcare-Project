import Doctor from '../models/doctorModel.js'

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
export const getAllDoctors = async (req, res) => {
  try {
    const { speciality, search } = req.query

    let filter = {}
    if (speciality) {
      filter.speciality = speciality
    }
    if (search) {
      filter.name = { $regex: search, $options: 'i' }
    }

    const doctors = await Doctor.find(filter).select('-slots_booked')

    res.json({ success: true, doctors })

  } catch (error) {
    console.error('Get doctors error:', error.message)
    res.status(500).json({ success: false, message: 'Server error.' })
  }
}

// @desc    Get doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).select('-slots_booked')

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' })
    }

    res.json({ success: true, doctor })

  } catch (error) {
    console.error('Get doctor error:', error.message)
    res.status(500).json({ success: false, message: 'Server error.' })
  }
}
