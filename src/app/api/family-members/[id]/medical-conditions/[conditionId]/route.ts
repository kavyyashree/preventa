import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PUT update a medical condition
export async function PUT(request: NextRequest, { params }: { params: { id: string; conditionId: string } }) {
  try {
    const { condition, diagnosisDate, severity, treatment, notes } = await request.json()
    const { conditionId } = params

    const medicalCondition = await db.medicalCondition.update({
      where: { id: conditionId },
      data: {
        ...(condition && { condition }),
        ...(diagnosisDate && { diagnosisDate }),
        ...(severity && { severity }),
        ...(treatment !== undefined && { treatment }),
        ...(notes !== undefined && { notes })
      }
    })

    return NextResponse.json({ medicalCondition })
  } catch (error) {
    console.error('Error updating medical condition:', error)
    return NextResponse.json(
      { error: 'Failed to update medical condition' },
      { status: 500 }
    )
  }
}

// DELETE a medical condition
export async function DELETE(request: NextRequest, { params }: { params: { id: string; conditionId: string } }) {
  try {
    const { conditionId } = params

    await db.medicalCondition.delete({
      where: { id: conditionId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting medical condition:', error)
    return NextResponse.json(
      { error: 'Failed to delete medical condition' },
      { status: 500 }
    )
  }
}