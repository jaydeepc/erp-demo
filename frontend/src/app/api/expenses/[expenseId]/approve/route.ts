import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Expense from '@/lib/models/Expense';
import { authenticateToken } from '@/lib/middleware/auth';

// Approve an expense claim (Manager only)
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
    
    // Only managers can approve expenses
    if (user.role !== 'MANAGER') {
      return NextResponse.json(
        { message: 'Only managers can approve expense claims' },
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

    // Update expense status to approved
    expense.status = 'APPROVED';
    expense.reviewedAt = new Date();
    expense.reviewedBy = user._id;
    expense.comments = comments || 'Approved';

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
    console.error('Approve expense error:', error);
    return NextResponse.json(
      { message: 'Server error while approving expense' },
      { status: 500 }
    );
  }
}
