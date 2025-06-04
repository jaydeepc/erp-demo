import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import connectDB from '../mongodb';
import User from '../models/User';

export interface AuthenticatedRequest extends NextRequest {
  user?: any;
}

export async function authenticateToken(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return { error: 'No token, authorization denied', status: 401 };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key') as any;
    
    await connectDB();
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return { error: 'Token is not valid', status: 401 };
    }

    return { user };
  } catch (error) {
    return { error: 'Token is not valid', status: 401 };
  }
}

export function requireRole(roles: string[]) {
  return (user: any) => {
    if (!user) {
      return { error: 'Authentication required', status: 401 };
    }

    if (!roles.includes(user.role)) {
      return { error: 'Access denied. Insufficient permissions.', status: 403 };
    }

    return { success: true };
  };
}
