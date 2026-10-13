import express from 'express'
import {
  doctorLogin,
  setupPassword,
  getDoctorProfile,
  updateDoctorProfile,
  getDoctorDashboard,
  getDoctorAppointments,
  doctorCompleteAppointment,
  doctorCancelAppointment
} from '../controllers/doctorPanelController.js'
import authDoctor from '../middleware/authDoctor.js'
import { uploadDoctorImage } from '../middleware/upload.js'

const router = express.Router()

// Auth
router.post('/login', doctorLogin)
router.post('/setup-password', setupPassword)

// Profile
router.get('/profile', authDoctor, getDoctorProfile)
router.put('/profile', authDoctor, uploadDoctorImage.single('image'), updateDoctorProfile)

// Dashboard
router.get('/dashboard', authDoctor, getDoctorDashboard)

// Appointments
router.get('/appointments', authDoctor, getDoctorAppointments)
router.put('/appointments/complete/:id', authDoctor, doctorCompleteAppointment)
router.put('/appointments/cancel/:id', authDoctor, doctorCancelAppointment)

export default router
