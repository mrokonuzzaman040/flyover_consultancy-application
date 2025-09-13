import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  startAt: z.string().min(1, 'Start date is required'),
  endAt: z.string().optional(),
  venue: z.string().optional(),
  city: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  bannerUrl: z.string().optional(),
  status: z.enum(['draft', 'published', 'cancelled', 'completed']),
  capacity: z.number().min(0, 'Capacity must be non-negative'),
  seatsRemaining: z.number().min(0, 'Seats remaining must be non-negative')
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const events = await prisma.event.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ events })
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Validate the request body
    const validationResult = eventSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.error.issues 
        },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Check if slug already exists
    const existingEvent = await prisma.event.findUnique({
      where: { slug: data.slug }
    })

    if (existingEvent) {
      return NextResponse.json(
        { error: 'An event with this slug already exists' },
        { status: 400 }
      )
    }

    // Create the event
    const event = await prisma.event.create({
      data: {
        title: data.title,
        slug: data.slug,
        startAt: new Date(data.startAt),
        endAt: data.endAt ? new Date(data.endAt) : null,
        venue: data.venue || null,
        city: data.city || null,
        description: data.description,
        bannerUrl: data.bannerUrl || null,
        status: data.status,
        capacity: data.capacity,
        seatsRemaining: data.seatsRemaining
      }
    })

    return NextResponse.json({ event }, { status: 201 })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}