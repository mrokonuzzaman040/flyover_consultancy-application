import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

// TODO: Add authentication middleware
// import { getServerSession } from 'next-auth/next'
// import { authOptions } from '@/lib/auth'

const destinationSchema = z.object({
  country: z.string().min(1, 'Country is required'),
  slug: z.string().min(1, 'Slug is required'),
  hero: z.string().optional(),
  overviewMD: z.string().optional(),
  costsMD: z.string().optional(),
  intakesMD: z.string().optional(),
  visaMD: z.string().optional(),
  scholarshipsMD: z.string().optional(),
  popularCourses: z.array(z.string()).default([]),
  faqs: z.array(z.object({
    question: z.string(),
    answer: z.string()
  })).optional()
})

export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check
    // const session = await getServerSession(authOptions)
    // if (!session || session.user.role !== 'ADMIN') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const where: {
      OR?: Array<{
        country?: { contains: string; mode: 'insensitive' }
        slug?: { contains: string; mode: 'insensitive' }
      }>
    } = {}

    if (search) {
      where.OR = [
        { country: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [destinations, total] = await Promise.all([
      prisma.destination.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.destination.count({ where })
    ])

    return NextResponse.json({
      destinations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching destinations:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // TODO: Add authentication check
    // const session = await getServerSession(authOptions)
    // if (!session || session.user.role !== 'ADMIN') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const body = await request.json()
    const validatedData = destinationSchema.parse(body)

    // Check if slug already exists
    const existingDestination = await prisma.destination.findUnique({
      where: { slug: validatedData.slug }
    })

    if (existingDestination) {
      return NextResponse.json(
        { error: 'A destination with this slug already exists' },
        { status: 400 }
      )
    }

    const destination = await prisma.destination.create({
      data: validatedData
    })

    return NextResponse.json(destination, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error creating destination:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}