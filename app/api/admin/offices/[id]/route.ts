import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

// Validation schema for updating offices
const updateOfficeSchema = z.object({
  city: z.string().min(1, 'City is required').optional(),
  phone: z.string().min(1, 'Phone number is required').optional(),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
  mapEmbedUrl: z.string().optional().or(z.literal(''))
})

// GET /api/admin/offices/[id] - Get a specific office
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // TODO: Add authentication check
    // const session = await getServerSession(authOptions)
    // if (!session?.user?.isAdmin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const { id } = await params
    const office = await prisma.office.findUnique({
      where: { id }
    })

    if (!office) {
      return NextResponse.json(
        { error: 'Office not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(office)
  } catch (error) {
    console.error('Error fetching office:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/offices/[id] - Update a specific office
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // TODO: Add authentication check
    // const session = await getServerSession(authOptions)
    // if (!session?.user?.isAdmin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const { id } = await params
    // Check if office exists
    const existingOffice = await prisma.office.findUnique({
      where: { id }
    })

    if (!existingOffice) {
      return NextResponse.json(
        { error: 'Office not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    
    // Validate request body
    const validatedData = updateOfficeSchema.parse(body)

    // Clean up empty strings to null for optional fields
    const cleanedData = {
      ...validatedData,
      email: validatedData.email === '' ? null : validatedData.email,
      mapEmbedUrl: validatedData.mapEmbedUrl === '' ? null : validatedData.mapEmbedUrl
    }

    // If city is being updated, check for duplicates
    if (cleanedData.city && cleanedData.city !== existingOffice.city) {
      const duplicateOffice = await prisma.office.findFirst({
        where: {
          city: {
            equals: cleanedData.city,
            mode: 'insensitive'
          },
          id: {
            not: id
          }
        }
      })

      if (duplicateOffice) {
        return NextResponse.json(
          { error: 'An office in this city already exists' },
          { status: 400 }
        )
      }
    }

    // Update the office
    const updatedOffice = await prisma.office.update({
      where: { id },
      data: cleanedData
    })

    return NextResponse.json(updatedOffice)
  } catch (error) {
    console.error('Error updating office:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/offices/[id] - Delete a specific office
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // TODO: Add authentication check
    // const session = await getServerSession(authOptions)
    // if (!session?.user?.isAdmin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const { id } = await params
    // Check if office exists
    const existingOffice = await prisma.office.findUnique({
      where: { id }
    })

    if (!existingOffice) {
      return NextResponse.json(
        { error: 'Office not found' },
        { status: 404 }
      )
    }

    // Delete the office
    await prisma.office.delete({
      where: { id }
    })

    return NextResponse.json(
      { message: 'Office deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting office:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}