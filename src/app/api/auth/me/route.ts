import { NextRequest, NextResponse } from 'next/server';
import { users } from '@/lib/mockUsers';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    // For demo purposes, accept any token and return a demo user
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
        name: user.name,
        dateOfBirth: user.dateOfBirth || null,
        gender: user.gender || null,
        height: user.height || null,
        weight: user.weight || null,
        bloodType: user.bloodType || null,
        ethnicity: user.ethnicity || null
      }
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}