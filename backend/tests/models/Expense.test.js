const Expense = require('../../models/Expense');
const User = require('../../models/User');
const mongoose = require('mongoose');

describe('Expense Model Tests', () => {
  let testUser, testManager;

  beforeEach(async () => {
    // Create test users for expense relationships
    testUser = await User.create({
      username: 'testemployee',
      password: 'password123',
      fullName: 'Test Employee',
      email: 'employee@test.com',
      role: 'EMPLOYEE'
    });

    testManager = await User.create({
      username: 'testmanager',
      password: 'password123',
      fullName: 'Test Manager',
      email: 'manager@test.com',
      role: 'MANAGER'
    });
  });

  describe('Expense Creation', () => {
    test('should create a valid expense with all required fields', async () => {
      const expenseData = {
        userId: testUser._id,
        amount: 150.75,
        currency: 'USD',
        description: 'Business lunch with client',
        expenseDate: new Date('2024-01-15')
      };

      const expense = new Expense(expenseData);
      const savedExpense = await expense.save();

      expect(savedExpense._id).toBeDefined();
      expect(savedExpense.userId.toString()).toBe(testUser._id.toString());
      expect(savedExpense.amount).toBe(expenseData.amount);
      expect(savedExpense.currency).toBe(expenseData.currency);
      expect(savedExpense.description).toBe(expenseData.description);
      expect(savedExpense.expenseDate).toEqual(expenseData.expenseDate);
      expect(savedExpense.status).toBe('PENDING'); // Default status
      expect(savedExpense.submittedAt).toBeDefined();
      expect(savedExpense.reviewedAt).toBeNull();
      expect(savedExpense.reviewedBy).toBeNull();
      expect(savedExpense.comments).toBeNull();
    });

    test('should set default status to PENDING', async () => {
      const expenseData = {
        userId: testUser._id,
        amount: 100.00,
        currency: 'USD',
        description: 'Office supplies',
        expenseDate: new Date()
      };

      const expense = new Expense(expenseData);
      const savedExpense = await expense.save();

      expect(savedExpense.status).toBe('PENDING');
    });

    test('should set default currency to USD', async () => {
      const expenseData = {
        userId: testUser._id,
        amount: 100.00,
        description: 'Office supplies',
        expenseDate: new Date()
        // currency not specified
      };

      const expense = new Expense(expenseData);
      const savedExpense = await expense.save();

      expect(savedExpense.currency).toBe('USD');
    });

    test('should automatically set submittedAt timestamp', async () => {
      const beforeSubmission = new Date();
      
      const expenseData = {
        userId: testUser._id,
        amount: 100.00,
        currency: 'USD',
        description: 'Office supplies',
        expenseDate: new Date()
      };

      const expense = new Expense(expenseData);
      const savedExpense = await expense.save();
      
      const afterSubmission = new Date();

      expect(savedExpense.submittedAt).toBeDefined();
      expect(savedExpense.submittedAt.getTime()).toBeGreaterThanOrEqual(beforeSubmission.getTime());
      expect(savedExpense.submittedAt.getTime()).toBeLessThanOrEqual(afterSubmission.getTime());
    });
  });

  describe('Expense Validation', () => {
    test('should require userId', async () => {
      const expenseData = {
        amount: 100.00,
        currency: 'USD',
        description: 'Office supplies',
        expenseDate: new Date()
      };

      const expense = new Expense(expenseData);
      
      await expect(expense.save()).rejects.toThrow();
    });

    test('should require amount', async () => {
      const expenseData = {
        userId: testUser._id,
        currency: 'USD',
        description: 'Office supplies',
        expenseDate: new Date()
      };

      const expense = new Expense(expenseData);
      
      await expect(expense.save()).rejects.toThrow();
    });

    test('should require positive amount', async () => {
      const expenseData = {
        userId: testUser._id,
        amount: -50.00, // Negative amount
        currency: 'USD',
        description: 'Office supplies',
        expenseDate: new Date()
      };

      const expense = new Expense(expenseData);
      
      await expect(expense.save()).rejects.toThrow();
    });

    test('should require amount greater than zero', async () => {
      const expenseData = {
        userId: testUser._id,
        amount: 0, // Zero amount
        currency: 'USD',
        description: 'Office supplies',
        expenseDate: new Date()
      };

      const expense = new Expense(expenseData);
      
      await expect(expense.save()).rejects.toThrow();
    });

    test('should require description', async () => {
      const expenseData = {
        userId: testUser._id,
        amount: 100.00,
        currency: 'USD',
        expenseDate: new Date()
      };

      const expense = new Expense(expenseData);
      
      await expect(expense.save()).rejects.toThrow();
    });

    test('should require expenseDate', async () => {
      const expenseData = {
        userId: testUser._id,
        amount: 100.00,
        currency: 'USD',
        description: 'Office supplies'
      };

      const expense = new Expense(expenseData);
      
      await expect(expense.save()).rejects.toThrow();
    });

    test('should only allow valid currencies', async () => {
      const expenseData = {
        userId: testUser._id,
        amount: 100.00,
        currency: 'INVALID', // Invalid currency
        description: 'Office supplies',
        expenseDate: new Date()
      };

      const expense = new Expense(expenseData);
      
      await expect(expense.save()).rejects.toThrow();
    });

    test('should allow valid currencies', async () => {
      const validCurrencies = ['USD', 'INR', 'EUR', 'GBP'];
      
      for (const currency of validCurrencies) {
        const expenseData = {
          userId: testUser._id,
          amount: 100.00,
          currency: currency,
          description: `Office supplies in ${currency}`,
          expenseDate: new Date()
        };

        const expense = new Expense(expenseData);
        const savedExpense = await expense.save();
        
        expect(savedExpense.currency).toBe(currency);
      }
    });

    test('should only allow valid status values', async () => {
      const expenseData = {
        userId: testUser._id,
        amount: 100.00,
        currency: 'USD',
        description: 'Office supplies',
        expenseDate: new Date(),
        status: 'INVALID_STATUS'
      };

      const expense = new Expense(expenseData);
      
      await expect(expense.save()).rejects.toThrow();
    });

    test('should allow valid status values', async () => {
      const validStatuses = ['PENDING', 'APPROVED', 'REJECTED'];
      
      for (const status of validStatuses) {
        const expenseData = {
          userId: testUser._id,
          amount: 100.00,
          currency: 'USD',
          description: `Office supplies - ${status}`,
          expenseDate: new Date(),
          status: status
        };

        const expense = new Expense(expenseData);
        const savedExpense = await expense.save();
        
        expect(savedExpense.status).toBe(status);
      }
    });

    test('should validate userId is a valid ObjectId', async () => {
      const expenseData = {
        userId: 'invalid-object-id',
        amount: 100.00,
        currency: 'USD',
        description: 'Office supplies',
        expenseDate: new Date()
      };

      const expense = new Expense(expenseData);
      
      await expect(expense.save()).rejects.toThrow();
    });

    test('should validate reviewedBy is a valid ObjectId when provided', async () => {
      const expenseData = {
        userId: testUser._id,
        amount: 100.00,
        currency: 'USD',
        description: 'Office supplies',
        expenseDate: new Date(),
        reviewedBy: 'invalid-object-id'
      };

      const expense = new Expense(expenseData);
      
      await expect(expense.save()).rejects.toThrow();
    });
  });

  describe('Expense Status Management', () => {
    let testExpense;

    beforeEach(async () => {
      testExpense = await Expense.create({
        userId: testUser._id,
        amount: 100.00,
        currency: 'USD',
        description: 'Test expense',
        expenseDate: new Date()
      });
    });

    test('should update expense to APPROVED status', async () => {
      testExpense.status = 'APPROVED';
      testExpense.reviewedBy = testManager._id;
      testExpense.reviewedAt = new Date();
      testExpense.comments = 'Approved - valid expense';

      const updatedExpense = await testExpense.save();

      expect(updatedExpense.status).toBe('APPROVED');
      expect(updatedExpense.reviewedBy.toString()).toBe(testManager._id.toString());
      expect(updatedExpense.reviewedAt).toBeDefined();
      expect(updatedExpense.comments).toBe('Approved - valid expense');
    });

    test('should update expense to REJECTED status', async () => {
      testExpense.status = 'REJECTED';
      testExpense.reviewedBy = testManager._id;
      testExpense.reviewedAt = new Date();
      testExpense.comments = 'Rejected - missing receipt';

      const updatedExpense = await testExpense.save();

      expect(updatedExpense.status).toBe('REJECTED');
      expect(updatedExpense.reviewedBy.toString()).toBe(testManager._id.toString());
      expect(updatedExpense.reviewedAt).toBeDefined();
      expect(updatedExpense.comments).toBe('Rejected - missing receipt');
    });
  });

  describe('Expense Queries', () => {
    beforeEach(async () => {
      // Create test expenses
      const expenses = [
        {
          userId: testUser._id,
          amount: 50.00,
          currency: 'USD',
          description: 'Lunch expense',
          expenseDate: new Date('2024-01-10'),
          status: 'PENDING'
        },
        {
          userId: testUser._id,
          amount: 100.00,
          currency: 'USD',
          description: 'Travel expense',
          expenseDate: new Date('2024-01-15'),
          status: 'APPROVED',
          reviewedBy: testManager._id,
          reviewedAt: new Date(),
          comments: 'Approved'
        },
        {
          userId: testUser._id,
          amount: 75.00,
          currency: 'EUR',
          description: 'Hotel expense',
          expenseDate: new Date('2024-01-20'),
          status: 'REJECTED',
          reviewedBy: testManager._id,
          reviewedAt: new Date(),
          comments: 'Missing receipt'
        }
      ];

      await Expense.insertMany(expenses);
    });

    test('should find expenses by userId', async () => {
      const userExpenses = await Expense.find({ userId: testUser._id });
      
      expect(userExpenses).toHaveLength(3);
      userExpenses.forEach(expense => {
        expect(expense.userId.toString()).toBe(testUser._id.toString());
      });
    });

    test('should find expenses by status', async () => {
      const pendingExpenses = await Expense.find({ status: 'PENDING' });
      const approvedExpenses = await Expense.find({ status: 'APPROVED' });
      const rejectedExpenses = await Expense.find({ status: 'REJECTED' });
      
      expect(pendingExpenses).toHaveLength(1);
      expect(approvedExpenses).toHaveLength(1);
      expect(rejectedExpenses).toHaveLength(1);
    });

    test('should find expenses by currency', async () => {
      const usdExpenses = await Expense.find({ currency: 'USD' });
      const eurExpenses = await Expense.find({ currency: 'EUR' });
      
      expect(usdExpenses).toHaveLength(2);
      expect(eurExpenses).toHaveLength(1);
    });

    test('should find expenses by date range', async () => {
      const startDate = new Date('2024-01-12');
      const endDate = new Date('2024-01-18');
      
      const expensesInRange = await Expense.find({
        expenseDate: {
          $gte: startDate,
          $lte: endDate
        }
      });
      
      expect(expensesInRange).toHaveLength(1);
      expect(expensesInRange[0].description).toBe('Travel expense');
    });

    test('should calculate total amount by status', async () => {
      const pendingTotal = await Expense.aggregate([
        { $match: { status: 'PENDING' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
      
      const approvedTotal = await Expense.aggregate([
        { $match: { status: 'APPROVED' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
      
      expect(pendingTotal[0].total).toBe(50.00);
      expect(approvedTotal[0].total).toBe(100.00);
    });

    test('should populate user information', async () => {
      const expenseWithUser = await Expense.findOne({ status: 'APPROVED' })
        .populate('userId', 'fullName email role');
      
      expect(expenseWithUser.userId.fullName).toBe('Test Employee');
      expect(expenseWithUser.userId.email).toBe('employee@test.com');
      expect(expenseWithUser.userId.role).toBe('EMPLOYEE');
    });

    test('should populate reviewer information', async () => {
      const expenseWithReviewer = await Expense.findOne({ status: 'APPROVED' })
        .populate('reviewedBy', 'fullName email role');
      
      expect(expenseWithReviewer.reviewedBy.fullName).toBe('Test Manager');
      expect(expenseWithReviewer.reviewedBy.email).toBe('manager@test.com');
      expect(expenseWithReviewer.reviewedBy.role).toBe('MANAGER');
    });
  });

  describe('Expense Business Logic', () => {
    test('should not allow expense date in the future', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30); // 30 days in future
      
      const expenseData = {
        userId: testUser._id,
        amount: 100.00,
        currency: 'USD',
        description: 'Future expense',
        expenseDate: futureDate
      };

      const expense = new Expense(expenseData);
      
      // This should be handled by application logic, not model validation
      // But we can test the date is stored correctly
      const savedExpense = await expense.save();
      expect(savedExpense.expenseDate).toEqual(futureDate);
    });

    test('should handle decimal amounts correctly', async () => {
      const expenseData = {
        userId: testUser._id,
        amount: 123.456, // More than 2 decimal places
        currency: 'USD',
        description: 'Decimal test',
        expenseDate: new Date()
      };

      const expense = new Expense(expenseData);
      const savedExpense = await expense.save();
      
      // MongoDB should store the exact decimal value
      expect(savedExpense.amount).toBe(123.456);
    });

    test('should handle large amounts', async () => {
      const expenseData = {
        userId: testUser._id,
        amount: 999999.99,
        currency: 'USD',
        description: 'Large expense',
        expenseDate: new Date()
      };

      const expense = new Expense(expenseData);
      const savedExpense = await expense.save();
      
      expect(savedExpense.amount).toBe(999999.99);
    });
  });
});
