import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET all medical documents for a family member
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id: familyMemberId } = params

    const medicalDocuments = await db.medicalDocument.findMany({
      where: { familyMemberId },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ medicalDocuments })
  } catch (error) {
    console.error('Error fetching medical documents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch medical documents' },
      { status: 500 }
    )
  }
}

// POST create a new medical document (metadata only)
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { name, type, size } = await request.json()
    const { id: familyMemberId } = params

    if (!name || !type || !size) {
      return NextResponse.json(
        { error: 'Document name, type, and size are required' },
        { status: 400 }
      )
    }

    const medicalDocument = await db.medicalDocument.create({
      data: {
        familyMemberId,
        name,
        type,
        size,
        uploadDate: new Date().toLocaleDateString()
      }
    })

    return NextResponse.json({ medicalDocument })
  } catch (error) {
    console.error('Error creating medical document:', error)
    return NextResponse.json(
      { error: 'Failed to create medical document' },
      { status: 500 }
    )
  }
}