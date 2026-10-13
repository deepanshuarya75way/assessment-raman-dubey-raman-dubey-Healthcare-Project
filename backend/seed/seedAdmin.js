import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import Admin from '../models/adminModel.js'

dotenv.config()

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ MongoDB connected for admin seeding')

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@docconnect.com' })
    if (existingAdmin) {
      console.log('ℹ️  Admin already exists, skipping...')
      await mongoose.disconnect()
      process.exit(0)
    }

    // Create default admin
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash('admin123', salt)

    await Admin.create({
      email: 'admin@docconnect.com',
      password: hashedPassword
    })

    console.log('🌱 Default admin created:')
    console.log('   Email: admin@docconnect.com')
    console.log('   Password: admin123')

    await mongoose.disconnect()
    console.log('✅ Admin seeding complete.')
    process.exit(0)
  } catch (error) {
    console.error('❌ Admin seeding error:', error.message)
    process.exit(1)
  }
}

seedAdmin()
