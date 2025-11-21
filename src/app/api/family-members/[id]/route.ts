import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PUT update a family member
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { name, relationship, age, gender } = await request.json()
    const { id } = params

    const familyMember = await db.familyMember.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(relationship && { relationship }),
        ...(age && { age: parseInt(age) }),
        ...(gender && { gender })
      },
      include: {
        medicalHistory: true,
        medicalDocuments: true
      }
    })

    return NextResponse.json({ familyMember })
  } catch (error) {
    console.error('Error updating family member:', error)
    return NextResponse.json(
      { error: 'Failed to update family member' },
      { status: 500 }
    )
  }
}

// DELETE a family member
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    await db.familyMember.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting family member:', error)
    return NextResponse.json(
      { error: 'Failed to delete family member' },
      { status: 500 }
    )
  }
}