import mongoose from 'mongoose'

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    select: false,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  speciality: {
    type: String,
    required: true
  },
  degree: {
    type: String,
    default: ''
  },
  experience: {
    type: String,
    default: ''
  },
  about: {
    type: String,
    default: ''
  },
  fees: {
    type: Number,
    required: true
  },
  available: {
    type: Boolean,
    default: true
  },
  address: {
    line1: { type: String, default: '' },
    line2: { type: String, default: '' }
  },
  slots_booked: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true,
  minimize: false
})

const Doctor = mongoose.model('Doctor', doctorSchema)

export default Doctor
