const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
  id: { type: Number, required: true }, // Keep for compatibility with existing logic
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  currentClass: { type: String },
  course: { type: String, required: true },
  message: { type: String },
  password: { type: String, required: true },
  emailVerified: { type: Boolean, default: false },
  admissionStatus: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  verificationToken: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Admission', admissionSchema);
