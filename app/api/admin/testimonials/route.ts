import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

// Validation schema for testimonial creation/update
const testimonialSchema = z.object({
  author: z.string().min(1, 'Author name is required'),
  quote: z.string().min(1, 'Quote is required'),
  source: z.string().optional(),
  avatarUrl: z.string().url().optional().or(z.literal('')),
  publishedAt: z.string().datetime().optional().nullable()
})

// GET /api/admin/testimonials - Get all testimonials
export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check
    // const session = await getServerSession(authOptions)
    // if (!session?.user?.isAdmin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'all'

    const skip = (page - 1) * limit

    // Build where clause
    const where: {
      OR?: Array<{
        author?: { contains: string; mode: 'insensitive' }
        quote?: { contains: string; mode: 'insensitive' }
        source?: { contains: string; mode: 'insensitive' }
      }>
      publishedAt?: { not: null } | null
    } = {}
    
    if (search) {
      where.OR = [
        { author: { contains: search, mode: 'insensitive' } },
        { quote: { contains: search, mode: 'insensitive' } },
        { source: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (status === 'published') {
      where.publishedAt = { not: null }
    } else if (status === 'draft') {
      where.publishedAt = null
    }

    const [testimonials, total] = await Promise.all([
      prisma.testimonial.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.testimonial.count({ where })
    ])

    return NextResponse.json({
      testimonials,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/admin/testimonials - Create new testimonial
export async function POST(request: NextRequest) {
  try {
    // TODO: Add authentication check
    // const session = await getServerSession(authOptions)
    // if (!session?.user?.isAdmin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const body = await request.json()
    
    // Validate request body
    const validationResult = testimonialSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.error.issues
        },
        { status: 400 }
      )
    }

    const { author, quote, source, avatarUrl, publishedAt } = validationResult.data

    // Create testimonial
    const testimonial = await prisma.testimonial.create({
      data: {
        author,
        quote,
        source: source || null,
        avatarUrl: avatarUrl || null,
        publishedAt: publishedAt ? new Date(publishedAt) : null
      }
    })

    return NextResponse.json(testimonial, { status: 201 })
  } catch (error) {
    console.error('Error creating testimonial:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}