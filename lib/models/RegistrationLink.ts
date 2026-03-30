import mongoose from 'mongoose';

const RegistrationLinkSchema = new mongoose.Schema({
  seminarId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seminar',
    required: true
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  usedBy: {
    type: String,
    default: null
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.models.RegistrationLink || mongoose.model('RegistrationLink', RegistrationLinkSchema);