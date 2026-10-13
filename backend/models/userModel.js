import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
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
    required: true,
    select: false
  },
  phone: {
    type: String,
    default: ''
  },
  address: {
    line1: { type: String, default: '' },
    line2: { type: String, default: '' }
  },
  gender: {
    type: String,
    default: 'Not Selected'
  },
  dob: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  }
}, {
  timestamps: true,
  minimize: false
})

const User = mongoose.model('User', userSchema)

export default User
