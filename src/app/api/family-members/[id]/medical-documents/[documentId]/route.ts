import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// DELETE a medical document
export async function DELETE(request: NextRequest, { params }: { params: { id: string; documentId: string } }) {
  try {
    const { documentId } = params

    await db.medicalDocument.delete({
      where: { id: documentId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting medical document:', error)
    return NextResponse.json(
      { error: 'Failed to delete medical document' },
      { status: 500 }
    )
  }
}