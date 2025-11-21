import { NextRequest, NextResponse } from 'next/server';

// In-memory user store for demo purposes
const users = new Map<string, { email: string; name: string; password: string }>();

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    // For demo purposes, accept any token and return a demo user
    // In production, you'd verify the JWT token
    const userEmail = 'demo@example.com';
    
    if (!users.has(userEmail)) {
      users.set(userEmail, {
        email: userEmail,
        name: 'Demo User',
        password: 'demo123'
      });
    }

    const user = users.get(userEmail)!;

    return NextResponse.json({
      user: {
        id: '1',
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}