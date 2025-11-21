import { NextRequest, NextResponse } from 'next/server';
import { users } from '@/lib/mockUsers';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const body = await request.json();
    // For demo, we tie updates to demo@example.com
    const userEmail = 'demo@example.com';

    const existing = users.get(userEmail) || { email: userEmail, password: 'demo123' };
    const updated = { ...existing, ...body };
    users.set(userEmail, updated);

    return NextResponse.json({ user: { id: '1', email: updated.email, name: updated.name, dateOfBirth: updated.dateOfBirth, gender: updated.gender, height: updated.height, weight: updated.weight, bloodType: updated.bloodType, ethnicity: updated.ethnicity } });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
