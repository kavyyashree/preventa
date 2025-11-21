import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET all medical conditions for a family member
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id: familyMemberId } = params

    const medicalConditions = await db.medicalCondition.findMany({
      where: { familyMemberId },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ medicalConditions })
  } catch (error) {
    console.error('Error fetching medical conditions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch medical conditions' },
      { status: 500 }
    )
  }
}

// POST create a new medical condition
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { condition, diagnosisDate, severity, treatment, notes } = await request.json()
    const { id: familyMemberId } = params

    if (!condition || !diagnosisDate || !severity) {
      return NextResponse.json(
        { error: 'Condition, diagnosis date, and severity are required' },
        { status: 400 }
      )
    }

    const medicalCondition = await db.medicalCondition.create({
      data: {
        familyMemberId,
        condition,
        diagnosisDate,
        severity,
        treatment,
        notes
      }
    })

    return NextResponse.json({ medicalCondition })
  } catch (error) {
    console.error('Error creating medical condition:', error)
    return NextResponse.json(
      { error: 'Failed to create medical condition' },
      { status: 500 }
    )
  }
}