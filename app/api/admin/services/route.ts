import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

// TODO: Add authentication middleware
// import { getServerSession } from 'next-auth/next'
// import { authOptions } from '@/lib/auth'

const createServiceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  sectionsMD: z.array(z.string()).optional().default([]),
  features: z.array(z.object({
    icon: z.string().optional(),
    title: z.string(),
    description: z.string()
  })).optional(),
  benefits: z.array(z.string()).optional(),
  process: z.array(z.object({
    step: z.string(),
    title: z.string(),
    description: z.string()
  })).optional(),
  ctaLabel: z.string().optional(),
  ctaText: z.string().optional()
})

const querySchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('10'),
  search: z.string().optional()
})

export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check
    // const session = await getServerSession(authOptions)
    // if (!session || session.user.role !== 'ADMIN') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const { searchParams } = new URL(request.url)
    const { page, limit, search } = querySchema.parse({
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '10',
      search: searchParams.get('search') || undefined
    })

    const pageNum = parseInt(page)
    const limitNum = parseInt(limit)
    const skip = (pageNum - 1) * limitNum

    const where: {
      OR?: Array<{
        name?: { contains: string; mode: 'insensitive' }
        slug?: { contains: string; mode: 'insensitive' }
      }>
    } = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.service.count({ where })
    ])

    return NextResponse.json({
      services,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    })
  } catch (error) {
    console.error('Error fetching services:', error)
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
    const validatedData = createServiceSchema.parse(body)

    // Check if slug already exists
    const existingService = await prisma.service.findUnique({
      where: { slug: validatedData.slug }
    })

    if (existingService) {
      return NextResponse.json(
        { error: 'A service with this slug already exists' },
        { status: 400 }
      )
    }

    const service = await prisma.service.create({
      data: validatedData
    })

    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error creating service:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}