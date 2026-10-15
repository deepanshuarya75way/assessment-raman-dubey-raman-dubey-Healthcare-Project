import mongoose from 'mongoose'

const appointmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  docId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  slotDate: {
    type: String,
    required: true
  },
  slotTime: {
    type: String,
    required: true
  },
  userData: {
    type: Object,
    required: true
  },
  docData: {
    type: Object,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  cancelled: {
    type: Boolean,
    default: false
  },
  payment: {
    type: Boolean,
    default: false
  },
  isCompleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  minimize: false
})

const Appointment = mongoose.model('Appointment', appointmentSchema)
appointmentSchema.index({ doctor: 1, date: 1, timeslot: 1}, {unique: true });
export default Appointment
