import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const eventUpdateSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  slug: z.string().min(1, 'Slug is required').optional(),
  startAt: z.string().min(1, 'Start date is required').optional(),
  endAt: z.string().optional(),
  venue: z.string().optional(),
  city: z.string().optional(),
  description: z.string().min(1, 'Description is required').optional(),
  bannerUrl: z.string().optional(),
  status: z.enum(['draft', 'published', 'cancelled', 'completed']).optional(),
  capacity: z.number().min(0, 'Capacity must be non-negative').optional(),
  seatsRemaining: z.number().min(0, 'Seats remaining must be non-negative').optional()
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const event = await prisma.event.findUnique({
      where: { id }
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    return NextResponse.json({ event })
  } catch (error) {
    console.error('Error fetching event:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    
    // Validate the request body
    const validationResult = eventUpdateSchema.safeParse(body)
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

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id }
    })

    if (!existingEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // If slug is being updated, check if it's already taken by another event
    if (data.slug && data.slug !== existingEvent.slug) {
      const slugExists = await prisma.event.findUnique({
        where: { slug: data.slug }
      })

      if (slugExists) {
        return NextResponse.json(
          { error: 'An event with this slug already exists' },
          { status: 400 }
        )
      }
    }

    // Prepare update data
    const updateData: {
      title?: string
      slug?: string
      startAt?: Date
      endAt?: Date | null
      venue?: string | null
      city?: string | null
      description?: string
      bannerUrl?: string | null
      status?: string
      capacity?: number
      seatsRemaining?: number
    } = {}

    if (data.title !== undefined) updateData.title = data.title
    if (data.slug !== undefined) updateData.slug = data.slug
    if (data.startAt !== undefined) updateData.startAt = new Date(data.startAt)
    if (data.endAt !== undefined) updateData.endAt = data.endAt ? new Date(data.endAt) : null
    if (data.venue !== undefined) updateData.venue = data.venue || null
    if (data.city !== undefined) updateData.city = data.city || null
    if (data.description !== undefined) updateData.description = data.description
    if (data.bannerUrl !== undefined) updateData.bannerUrl = data.bannerUrl || null
    if (data.status !== undefined) updateData.status = data.status
    if (data.capacity !== undefined) updateData.capacity = data.capacity
    if (data.seatsRemaining !== undefined) updateData.seatsRemaining = data.seatsRemaining

    // Update the event
    const event = await prisma.event.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({ event })
  } catch (error) {
    console.error('Error updating event:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id }
    })

    if (!existingEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Delete the event
    await prisma.event.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Event deleted successfully' })
  } catch (error) {
    console.error('Error deleting event:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}