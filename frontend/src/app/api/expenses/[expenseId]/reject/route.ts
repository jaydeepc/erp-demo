import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Expense from '@/lib/models/Expense';
import { authenticateToken } from '@/lib/middleware/auth';

// Reject an expense claim (Manager only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { expenseId: string } }
) {
  try {
    const authResult = await authenticateToken(request);
    
    if (authResult.error) {
      return NextResponse.json(
        { message: authResult.error },
        { status: authResult.status }
      );
    }

    const user = authResult.user;
    
    // Only managers can reject expenses
    if (user.role !== 'MANAGER') {
      return NextResponse.json(
        { message: 'Only managers can reject expense claims' },
        { status: 403 }
      );
    }

    await connectDB();
    
    const { expenseId } = params;
    const { comments } = await request.json();

    // Find the expense
    const expense = await Expense.findById(expenseId);
    
    if (!expense) {
      return NextResponse.json(
        { message: 'Expense not found' },
        { status: 404 }
      );
    }

    // Check if expense is still pending
    if (expense.status !== 'PENDING') {
      return NextResponse.json(
        { message: 'Expense has already been reviewed' },
        { status: 400 }
      );
    }

    // Update expense status to rejected
    expense.status = 'REJECTED';
    expense.reviewedAt = new Date();
    expense.reviewedBy = user._id;
    expense.comments = comments || 'Rejected';

    await expense.save();

    // Populate the reviewedBy field for response
    await expense.populate('reviewedBy', 'fullName email');
    await expense.populate('userId', 'fullName email');

    return NextResponse.json({
      _id: expense._id,
      userId: expense.userId._id,
      amount: expense.amount,
      currency: expense.currency,
      description: expense.description,
      expenseDate: expense.expenseDate,
      status: expense.status,
      submittedAt: expense.submittedAt,
      reviewedAt: expense.reviewedAt,
      reviewedBy: expense.reviewedBy._id,
      comments: expense.comments
    });
  } catch (error) {
    console.error('Reject expense error:', error);
    return NextResponse.json(
      { message: 'Server error while rejecting expense' },
      { status: 500 }
    );
  }
}
