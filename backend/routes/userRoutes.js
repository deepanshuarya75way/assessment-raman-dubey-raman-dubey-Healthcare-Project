import express from 'express'
import { registerUser, loginUser, getUserProfile, updateUserProfile, uploadProfileImage } from '../controllers/userController.js'
import authUser from '../middleware/auth.js'
import { uploadUserImage } from '../middleware/upload.js'

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/profile', authUser, getUserProfile)
router.put('/profile', authUser, updateUserProfile)
router.put('/profile/image', authUser, uploadUserImage.single('image'), uploadProfileImage)

export default router

