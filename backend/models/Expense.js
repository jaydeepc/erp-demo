const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0.01
  },
  currency: {
    type: String,
    required: true,
    default: 'USD',
    enum: ['USD', 'INR', 'EUR', 'GBP']
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  expenseDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    default: 'PENDING'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: {
    type: Date,
    default: null
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  comments: {
    type: String,
    trim: true,
    maxlength: 1000,
    default: null
  }
}, {
  timestamps: true
});

// Index for better query performance
expenseSchema.index({ userId: 1, status: 1 });
expenseSchema.index({ status: 1, submittedAt: -1 });

module.exports = mongoose.model('Expense', expenseSchema);
