import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Expense from '@/lib/models/Expense';
import { authenticateToken } from '@/lib/middleware/auth';

// Get all pending expense claims (Manager only)
export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateToken(request);
    
    if (authResult.error) {
      return NextResponse.json(
        { message: authResult.error },
        { status: authResult.status }
      );
    }

    const user = authResult.user;
    
    // Only managers can view pending expenses
    if (user.role !== 'MANAGER') {
      return NextResponse.json(
        { message: 'Only managers can view pending expense claims' },
        { status: 403 }
      );
    }

    await connectDB();
    
    // Get URL search params for optional userId filter
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    // Build query - get pending expenses, optionally filtered by userId
    const query: any = { status: 'PENDING' };
    if (userId) {
      query.userId = userId;
    }
    
    // Get pending expenses with user information populated
    const expenses = await Expense.find(query)
      .sort({ submittedAt: -1 })
      .populate('userId', 'fullName email username')
      .populate('reviewedBy', 'fullName email');

    // Transform the response to match the expected API schema
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

    return NextResponse.json(transformedExpenses);
  } catch (error) {
    console.error('Get pending expenses error:', error);
    return NextResponse.json(
      { message: 'Server error while fetching pending expenses' },
      { status: 500 }
    );
  }
}
