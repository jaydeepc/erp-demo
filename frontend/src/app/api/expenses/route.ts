import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Expense from '@/lib/models/Expense';
import { authenticateToken } from '@/lib/middleware/auth';

// Submit a new expense claim (Employee only)
export async function POST(request: NextRequest) {
  try {
    const authResult = await authenticateToken(request);
    
    if (authResult.error) {
      return NextResponse.json(
        { message: authResult.error },
        { status: authResult.status }
      );
    }

    const user = authResult.user;
    
    // Only employees can submit expenses
    if (user.role !== 'EMPLOYEE') {
      return NextResponse.json(
        { message: 'Only employees can submit expense claims' },
        { status: 403 }
      );
    }

    await connectDB();
    
    const { amount, currency, description, expenseDate } = await request.json();

    // Validation
    if (!amount || !currency || !description || !expenseDate) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { message: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    // Create new expense
    const expense = new Expense({
      userId: user._id,
      amount: parseFloat(amount),
      currency,
      description,
      expenseDate: new Date(expenseDate),
      status: 'PENDING'
    });

    await expense.save();

    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.error('Expense submission error:', error);
    return NextResponse.json(
      { message: 'Server error during expense submission' },
      { status: 500 }
    );
  }
}
