const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  studentId: {
    type: Number,
    required: true,
    unique: true // One fee plan per student for now
  },
  totalFees: {
    type: Number,
    required: true
  },
  paidAmount: {
    type: Number,
    default: 0
  },
  remainingAmount: {
    type: Number
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Paid', 'Pending', 'Overdue'],
    default: 'Pending'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate remaining amount and status before saving
feeSchema.pre('save', function(next) {
  this.remainingAmount = this.totalFees - this.paidAmount;
  
  if (this.remainingAmount <= 0) {
    this.status = 'Paid';
  } else if (new Date(this.dueDate) < new Date()) {
    this.status = 'Overdue';
  } else {
    this.status = 'Pending';
  }
  
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Fee', feeSchema);
