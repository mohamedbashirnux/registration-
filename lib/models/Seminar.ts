import mongoose from 'mongoose';

const SeminarSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['course', 'seminar'],
    required: true
  },
  courseStartDate: {
    type: Date,
    required: true
  },
  courseEndDate: {
    type: Date,
    required: true
  },
  certificateData: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  lectureImage: {
    type: String,
    required: false
  },
  lectureName: {
    type: String,
    required: true
  },
  lectureBio: {
    type: String,
    required: false
  },
  summary: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

// Delete the cached model to force schema update
if (mongoose.models.Seminar) {
  delete mongoose.models.Seminar;
}

export default mongoose.model('Seminar', SeminarSchema);