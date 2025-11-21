import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET all family members for the authenticated user
export async function GET(request: NextRequest) {
  try {
    // For demo purposes, we'll use a hardcoded user ID
    // In production, you'd get this from the authenticated user session
    const userId = 'demo-user-id'

    const familyMembers = await db.familyMember.findMany({
      where: { userId },
      include: {
        medicalHistory: true,
        medicalDocuments: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ familyMembers })
  } catch (error) {
    console.error('Error fetching family members:', error)
    return NextResponse.json(
      { error: 'Failed to fetch family members' },
      { status: 500 }
    )
  }
}

// POST create a new family member
export async function POST(request: NextRequest) {
  try {
    const { name, relationship, age, gender } = await request.json()

    if (!name || !relationship || !age || !gender) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // For demo purposes, we'll use a hardcoded user ID
    const userId = 'demo-user-id'

    const familyMember = await db.familyMember.create({
      data: {
        userId,
        name,
        relationship,
        age: parseInt(age),
        gender
      },
      include: {
        medicalHistory: true,
        medicalDocuments: true
      }
    })

    return NextResponse.json({ familyMember })
  } catch (error) {
    console.error('Error creating family member:', error)
    return NextResponse.json(
      { error: 'Failed to create family member' },
      { status: 500 }
    )
  }
}