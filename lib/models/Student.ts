import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true
  },
  ticketNumber: {
    type: Number,
    required: true
  },
  certificateSerial: {
    type: String,
    required: true,
    unique: true
  },
  seminarId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seminar',
    required: true
  },
  registrationToken: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

export default mongoose.models.Student || mongoose.model('Student', StudentSchema);