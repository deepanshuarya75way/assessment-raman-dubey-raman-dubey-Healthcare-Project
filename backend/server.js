import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import connectDB from './config/db.js'
import userRoutes from './routes/userRoutes.js'
import doctorRoutes from './routes/doctorRoutes.js'
import appointmentRoutes from './routes/appointmentRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import contactRoutes from './routes/contactRoutes.js'
import doctorPanelRoutes from './routes/doctorPanelRoutes.js'

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load env vars
dotenv.config()

// Ensure upload directories exist
const imagesDir = path.join(__dirname, 'public', 'images')
const usersImagesDir = path.join(__dirname, 'public', 'images', 'users')
if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true })
if (!fs.existsSync(usersImagesDir)) fs.mkdirSync(usersImagesDir, { recursive: true })

// Connect to database
connectDB()

// Initialize Express
const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Serve static files (doctor images etc.)
app.use('/images', express.static(path.join(__dirname, 'public', 'images')))

// API Routes
app.use('/api/user', userRoutes)
app.use('/api/doctors', doctorRoutes)
app.use('/api/appointments', appointmentRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/doctor-panel', doctorPanelRoutes)

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'DocConnect API is running' })
})

// Start server
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀 DocConnect API running on port ${PORT}`)
})

