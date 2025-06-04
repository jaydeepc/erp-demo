import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from '@/lib/middleware/auth';

export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateToken(request);
    
    if (authResult.error) {
      return NextResponse.json(
        { message: authResult.error },
        { status: authResult.status }
      );
    }

    return NextResponse.json(authResult.user);
  } catch (error) {
    console.error('User verification error:', error);
    return NextResponse.json(
      { message: 'Server error during user verification' },
      { status: 500 }
    );
  }
}
