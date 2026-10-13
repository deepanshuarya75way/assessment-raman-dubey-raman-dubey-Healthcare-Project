import express from 'express'
import { bookAppointment, getMyAppointments, cancelAppointment, payAppointment } from '../controllers/appointmentController.js'
import authUser from '../middleware/auth.js'

const router = express.Router()

router.post('/book', authUser, bookAppointment)
router.get('/my', authUser, getMyAppointments)
router.put('/cancel/:id', authUser, cancelAppointment)
router.put('/pay/:id', authUser, payAppointment)

export default router

