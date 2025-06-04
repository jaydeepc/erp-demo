const express = require('express');
const Expense = require('../models/Expense');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// Submit a new expense claim (Employee only)
router.post('/', auth, requireRole(['EMPLOYEE']), async (req, res) => {
  try {
    const { amount, currency, description, expenseDate } = req.body;

    // Validation
    if (!amount || !description || !expenseDate) {
      return res.status(400).json({ message: 'Amount, description, and expense date are required' });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    // Create new expense
    const expense = new Expense({
      userId: req.user._id,
      amount,
      currency: currency || 'USD',
      description,
      expenseDate: new Date(expenseDate)
    });

    await expense.save();

    res.status(201).json(expense);
  } catch (error) {
    console.error('Expense creation error:', error);
    res.status(500).json({ message: 'Server error creating expense' });
  }
});

// Get all own expense claims (Employee only)
router.get('/my', auth, requireRole(['EMPLOYEE']), async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user._id })
      .sort({ submittedAt: -1 })
      .populate('reviewedBy', 'fullName');

    res.json(expenses);
  } catch (error) {
    console.error('Error fetching user expenses:', error);
    res.status(500).json({ message: 'Server error fetching expenses' });
  }
});

// Get all pending expense claims (Manager only)
router.get('/pending', auth, requireRole(['MANAGER']), async (req, res) => {
  try {
    const { userId } = req.query;
    
    let filter = { status: 'PENDING' };
    if (userId) {
      filter.userId = userId;
    }

    const expenses = await Expense.find(filter)
      .sort({ submittedAt: -1 })
      .populate('userId', 'fullName email')
      .populate('reviewedBy', 'fullName');

    // Transform the response to match the API schema
    const transformedExpenses = expenses.map(expense => ({
      _id: expense._id,
      user: {
        _id: expense.userId._id,
        fullName: expense.userId.fullName,
        email: expense.userId.email
      },
      amount: expense.amount,
      currency: expense.currency,
      description: expense.description,
      expenseDate: expense.expenseDate,
      status: expense.status,
      submittedAt: expense.submittedAt,
      reviewedAt: expense.reviewedAt,
      reviewedBy: expense.reviewedBy,
      comments: expense.comments
    }));

    res.json(transformedExpenses);
  } catch (error) {
    console.error('Error fetching pending expenses:', error);
    res.status(500).json({ message: 'Server error fetching pending expenses' });
  }
});

// Approve an expense claim (Manager only)
router.put('/:expenseId/approve', auth, requireRole(['MANAGER']), async (req, res) => {
  try {
    const { expenseId } = req.params;
    const { comments } = req.body;

    const expense = await Expense.findById(expenseId);
    
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    if (expense.status !== 'PENDING') {
      return res.status(400).json({ message: 'Expense has already been reviewed' });
    }

    expense.status = 'APPROVED';
    expense.reviewedAt = new Date();
    expense.reviewedBy = req.user._id;
    expense.comments = comments || null;

    await expense.save();

    res.json(expense);
  } catch (error) {
    console.error('Error approving expense:', error);
    res.status(500).json({ message: 'Server error approving expense' });
  }
});

// Reject an expense claim (Manager only)
router.put('/:expenseId/reject', auth, requireRole(['MANAGER']), async (req, res) => {
  try {
    const { expenseId } = req.params;
    const { comments } = req.body;

    const expense = await Expense.findById(expenseId);
    
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    if (expense.status !== 'PENDING') {
      return res.status(400).json({ message: 'Expense has already been reviewed' });
    }

    expense.status = 'REJECTED';
    expense.reviewedAt = new Date();
    expense.reviewedBy = req.user._id;
    expense.comments = comments || null;

    await expense.save();

    res.json(expense);
  } catch (error) {
    console.error('Error rejecting expense:', error);
    res.status(500).json({ message: 'Server error rejecting expense' });
  }
});

module.exports = router;
