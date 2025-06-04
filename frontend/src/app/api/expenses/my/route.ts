import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Expense from '@/lib/models/Expense';
import { authenticateToken } from '@/lib/middleware/auth';

// Get all own expense claims (Employee only)
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
    
    // Only employees can view their own expenses
    if (user.role !== 'EMPLOYEE') {
      return NextResponse.json(
        { message: 'Only employees can view their expense claims' },
        { status: 403 }
      );
    }

    await connectDB();
    
    // Get all expenses for this user, sorted by submission date (newest first)
    const expenses = await Expense.find({ userId: user._id })
      .sort({ submittedAt: -1 })
      .populate('reviewedBy', 'fullName email');

    return NextResponse.json(expenses);
  } catch (error) {
    console.error('Get my expenses error:', error);
    return NextResponse.json(
      { message: 'Server error while fetching expenses' },
      { status: 500 }
    );
  }
}
