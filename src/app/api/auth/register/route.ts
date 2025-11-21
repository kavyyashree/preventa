import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory user store for demo purposes
const users = new Map()

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    // Simple demo registration
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
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
        name: name,
        dateOfBirth: '1990-01-01'
      }
      users.set(userId, user)
    }

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
      { error: 'Registration failed' },
      { status: 500 }
    )
  }
}