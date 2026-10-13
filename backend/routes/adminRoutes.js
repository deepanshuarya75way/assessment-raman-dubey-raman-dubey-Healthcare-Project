import express from 'express'
import {
  adminLogin,
  getDashboard,
  getAllAppointments,
  adminCancelAppointment,
  completeAppointment,
  addDoctor,
  updateDoctor,
  deleteDoctor,
  toggleDoctorAvailability,
  getAllUsers
} from '../controllers/adminController.js'
import { getAllContacts, updateContactStatus } from '../controllers/contactController.js'
import authAdmin from '../middleware/authAdmin.js'
import { uploadDoctorImage } from '../middleware/upload.js'

const router = express.Router()

// Auth
router.post('/login', adminLogin)

// Dashboard
router.get('/dashboard', authAdmin, getDashboard)

// Appointments
router.get('/appointments', authAdmin, getAllAppointments)
router.put('/appointments/cancel/:id', authAdmin, adminCancelAppointment)
router.put('/appointments/complete/:id', authAdmin, completeAppointment)

// Doctors CRUD
router.post('/doctors', authAdmin, uploadDoctorImage.single('image'), addDoctor)
router.put('/doctors/:id', authAdmin, uploadDoctorImage.single('image'), updateDoctor)
router.delete('/doctors/:id', authAdmin, deleteDoctor)
router.put('/doctors/:id/availability', authAdmin, toggleDoctorAvailability)

// Users
router.get('/users', authAdmin, getAllUsers)

// Contacts
router.get('/contacts', authAdmin, getAllContacts)
router.put('/contacts/:id', authAdmin, updateContactStatus)

export default router
