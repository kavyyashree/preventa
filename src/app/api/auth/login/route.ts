import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory user store for demo purposes
const users = new Map()

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Simple demo authentication - accept email/password and create/get user
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Create or get user from in-memory store
    let userId = `user_${Date.now()}`
    let user = users.get(userId)

    if (!user) {
      user = {
        id: userId,
        email: email,
        name: email.split('@')[0],
        dateOfBirth: '1990-01-01'
      }
      users.set(userId, user)
    }

    // Create a simple token (in production, use JWT)
    const token = `${userId}.${Date.now()}`

    const response = NextResponse.json({
      success: true,
      user: user,
      token: token
    })

    // Set token in cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 60 // 60 days
    })

    return response
  } catch (error) {
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}