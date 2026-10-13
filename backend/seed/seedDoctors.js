import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Doctor from '../models/doctorModel.js'

dotenv.config()

const doctors = [
  {
    name: 'Dr. Richard James',
    email: 'richard.james@docconnect.com',
    image: '/images/doc1.png',
    speciality: 'General physician',
    degree: 'MBBS',
    experience: '4 Years',
    about: 'Dr. James has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
    fees: 50,
    available: true,
    address: { line1: '17th Cross, Richmond', line2: 'Circle, Ring Road, London' }
  },
  {
    name: 'Dr. Emily Larson',
    email: 'emily.larson@docconnect.com',
    image: '/images/doc2.png',
    speciality: 'Gynecologist',
    degree: 'MBBS',
    experience: '3 Years',
    about: 'Dr. Larson has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
    fees: 60,
    available: true,
    address: { line1: '27th Cross, Richmond', line2: 'Circle, Ring Road, London' }
  },
  {
    name: 'Dr. Sarah Patel',
    email: 'sarah.patel@docconnect.com',
    image: '/images/doc3.png',
    speciality: 'Dermatologist',
    degree: 'MBBS',
    experience: '1 Years',
    about: 'Dr. Patel has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
    fees: 30,
    available: true,
    address: { line1: '37th Cross, Richmond', line2: 'Circle, Ring Road, London' }
  },
  {
    name: 'Dr. Christopher Lee',
    email: 'christopher.lee@docconnect.com',
    image: '/images/doc4.png',
    speciality: 'Pediatricians',
    degree: 'MBBS',
    experience: '2 Years',
    about: 'Dr. Lee has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
    fees: 40,
    available: true,
    address: { line1: '47th Cross, Richmond', line2: 'Circle, Ring Road, London' }
  },
  {
    name: 'Dr. Jennifer Garcia',
    email: 'jennifer.garcia@docconnect.com',
    image: '/images/doc5.png',
    speciality: 'Neurologist',
    degree: 'MBBS',
    experience: '4 Years',
    about: 'Dr. Garcia has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
    fees: 50,
    available: true,
    address: { line1: '57th Cross, Richmond', line2: 'Circle, Ring Road, London' }
  },
  {
    name: 'Dr. Andrew Williams',
    email: 'andrew.williams@docconnect.com',
    image: '/images/doc6.png',
    speciality: 'Neurologist',
    degree: 'MBBS',
    experience: '4 Years',
    about: 'Dr. Williams has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
    fees: 50,
    available: true,
    address: { line1: '57th Cross, Richmond', line2: 'Circle, Ring Road, London' }
  },
  {
    name: 'Dr. Christopher Davis',
    email: 'christopher.davis@docconnect.com',
    image: '/images/doc7.png',
    speciality: 'General physician',
    degree: 'MBBS',
    experience: '4 Years',
    about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
    fees: 50,
    available: true,
    address: { line1: '17th Cross, Richmond', line2: 'Circle, Ring Road, London' }
  },
  {
    name: 'Dr. Timothy White',
    email: 'timothy.white@docconnect.com',
    image: '/images/doc8.png',
    speciality: 'Gynecologist',
    degree: 'MBBS',
    experience: '3 Years',
    about: 'Dr. White has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
    fees: 60,
    available: true,
    address: { line1: '27th Cross, Richmond', line2: 'Circle, Ring Road, London' }
  },
  {
    name: 'Dr. Ava Mitchell',
    email: 'ava.mitchell@docconnect.com',
    image: '/images/doc9.png',
    speciality: 'Dermatologist',
    degree: 'MBBS',
    experience: '1 Years',
    about: 'Dr. Mitchell has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
    fees: 30,
    available: true,
    address: { line1: '37th Cross, Richmond', line2: 'Circle, Ring Road, London' }
  },
  {
    name: 'Dr. Jeffrey King',
    email: 'jeffrey.king@docconnect.com',
    image: '/images/doc10.png',
    speciality: 'Pediatricians',
    degree: 'MBBS',
    experience: '2 Years',
    about: 'Dr. King has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
    fees: 40,
    available: true,
    address: { line1: '47th Cross, Richmond', line2: 'Circle, Ring Road, London' }
  },
  {
    name: 'Dr. Zoe Kelly',
    email: 'zoe.kelly@docconnect.com',
    image: '/images/doc11.png',
    speciality: 'Neurologist',
    degree: 'MBBS',
    experience: '4 Years',
    about: 'Dr. Kelly has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
    fees: 50,
    available: true,
    address: { line1: '57th Cross, Richmond', line2: 'Circle, Ring Road, London' }
  },
  {
    name: 'Dr. Patrick Harris',
    email: 'patrick.harris@docconnect.com',
    image: '/images/doc12.png',
    speciality: 'Neurologist',
    degree: 'MBBS',
    experience: '4 Years',
    about: 'Dr. Harris has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
    fees: 50,
    available: true,
    address: { line1: '57th Cross, Richmond', line2: 'Circle, Ring Road, London' }
  },
  {
    name: 'Dr. Chloe Evans',
    email: 'chloe.evans@docconnect.com',
    image: '/images/doc13.png',
    speciality: 'General physician',
    degree: 'MBBS',
    experience: '4 Years',
    about: 'Dr. Evans has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
    fees: 50,
    available: true,
    address: { line1: '17th Cross, Richmond', line2: 'Circle, Ring Road, London' }
  },
  {
    name: 'Dr. Ryan Martinez',
    email: 'ryan.martinez@docconnect.com',
    image: '/images/doc14.png',
    speciality: 'Gynecologist',
    degree: 'MBBS',
    experience: '3 Years',
    about: 'Dr. Martinez has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
    fees: 60,
    available: true,
    address: { line1: '27th Cross, Richmond', line2: 'Circle, Ring Road, London' }
  },
  {
    name: 'Dr. Amelia Hill',
    email: 'amelia.hill@docconnect.com',
    image: '/images/doc15.png',
    speciality: 'Dermatologist',
    degree: 'MBBS',
    experience: '1 Years',
    about: 'Dr. Hill has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
    fees: 30,
    available: true,
    address: { line1: '37th Cross, Richmond', line2: 'Circle, Ring Road, London' }
  },
]

const seedDoctors = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ MongoDB connected for seeding')

    // Clear existing doctors
    await Doctor.deleteMany({})
    console.log('🗑️  Cleared existing doctors')

    // Insert seed data
    const inserted = await Doctor.insertMany(doctors)
    console.log(`🌱 Seeded ${inserted.length} doctors`)

    await mongoose.disconnect()
    console.log('✅ Seeding complete. MongoDB disconnected.')
    process.exit(0)
  } catch (error) {
    console.error('❌ Seeding error:', error.message)
    process.exit(1)
  }
}

seedDoctors()
