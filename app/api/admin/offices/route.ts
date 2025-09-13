import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

// Validation schema for creating/updating offices
const officeSchema = z.object({
  city: z.string().min(1, 'City is required'),
  phone: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
  mapEmbedUrl: z.string().optional().or(z.literal(''))
})

// GET /api/admin/offices - List all offices with pagination and search
export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check
    // const session = await getServerSession(authOptions)
    // if (!session?.user?.isAdmin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const skip = (page - 1) * limit

    // Build search conditions
    const where: {
      OR?: Array<{
        city?: { contains: string; mode: 'insensitive' }
        phone?: { contains: string; mode: 'insensitive' }
        email?: { contains: string; mode: 'insensitive' }
      }>
    } = {}

    if (search) {
      where.OR = [
        { city: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Get offices with pagination
    const [offices, total] = await Promise.all([
      prisma.office.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.office.count({ where })
    ])

    return NextResponse.json({
      offices,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching offices:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/admin/offices - Create a new office
export async function POST(request: NextRequest) {
  try {
    // TODO: Add authentication check
    // const session = await getServerSession(authOptions)
    // if (!session?.user?.isAdmin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const body = await request.json()
    
    // Validate request body
    const validatedData = officeSchema.parse(body)

    // Clean up empty strings to null for optional fields
    const cleanedData = {
      ...validatedData,
      email: validatedData.email === '' ? null : validatedData.email,
      mapEmbedUrl: validatedData.mapEmbedUrl === '' ? null : validatedData.mapEmbedUrl
    }

    // Check if office with same city already exists
    const existingOffice = await prisma.office.findFirst({
      where: {
        city: {
          equals: cleanedData.city,
          mode: 'insensitive'
        }
      }
    })

    if (existingOffice) {
      return NextResponse.json(
        { error: 'An office in this city already exists' },
        { status: 400 }
      )
    }

    // Create the office
    const office = await prisma.office.create({
      data: {
        city: cleanedData.city,
        phone: cleanedData.phone,
        email: cleanedData.email,
        mapEmbedUrl: cleanedData.mapEmbedUrl,
        address: cleanedData.city // Using city as address since it's required
      }
    })

    return NextResponse.json(office, { status: 201 })
  } catch (error) {
    console.error('Error creating office:', error)
    
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