import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

// TODO: Add authentication middleware
// import { getServerSession } from 'next-auth/next'
// import { authOptions } from '@/lib/auth'

const universitySchema = z.object({
  name: z.string(),
  location: z.string(),
  ranking: z.string().optional(),
  image: z.string().optional(),
  description: z.string().optional(),
  popularCourses: z.array(z.string())
})

const updateDestinationSchema = z.object({
  country: z.string().min(1, 'Country is required').optional(),
  slug: z.string().min(1, 'Slug is required').optional(),
  flag: z.string().optional(),
  image: z.string().optional(),
  description: z.string().optional(),
  highlights: z.array(z.string()).optional(),
  universities: z.array(universitySchema).optional(),
  students: z.string().optional(),
  popularCities: z.array(z.string()).optional(),
  averageCost: z.string().optional(),
  workRights: z.string().optional(),
  color: z.string().optional(),
  hero: z.string().optional(),
  overviewMD: z.string().optional(),
  costsMD: z.string().optional(),
  intakesMD: z.string().optional(),
  visaMD: z.string().optional(),
  scholarshipsMD: z.string().optional(),
  popularCourses: z.array(z.string()).optional(),
  faqs: z.array(z.object({
    question: z.string(),
    answer: z.string()
  })).optional()
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // TODO: Add authentication check
    // const session = await getServerSession(authOptions)
    // if (!session || session.user.role !== 'ADMIN') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const { slug } = await params
    
    const destination = await prisma.destination.findUnique({
      where: { slug }
    })

    if (!destination) {
      return NextResponse.json(
        { error: 'Destination not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(destination)
  } catch (error) {
    console.error('Error fetching destination:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // TODO: Add authentication check
    // const session = await getServerSession(authOptions)
    // if (!session || session.user.role !== 'ADMIN') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const { slug } = await params
    const body = await request.json()
    const validatedData = updateDestinationSchema.parse(body)

    // Check if destination exists
    const existingDestination = await prisma.destination.findUnique({
      where: { slug }
    })

    if (!existingDestination) {
      return NextResponse.json(
        { error: 'Destination not found' },
        { status: 404 }
      )
    }

    // Check if slug is being updated and if it already exists
    if (validatedData.slug && validatedData.slug !== existingDestination.slug) {
      const slugExists = await prisma.destination.findUnique({
        where: { slug: validatedData.slug }
      })

      if (slugExists) {
        return NextResponse.json(
          { error: 'A destination with this slug already exists' },
          { status: 400 }
        )
      }
    }

    const updateData: {
      country?: string
      slug?: string
      hero?: string
      overviewMD?: string
      costsMD?: string
      intakesMD?: string
      visaMD?: string
      scholarshipsMD?: string
      popularCourses?: string[]
      faqs?: {
        question: string
        answer: string
      }[]
      flag?: string
      image?: string
      description?: string
      highlights?: string[]
      universities?: {
        name: string
        location: string
        ranking?: string
        image?: string
        description?: string
        popularCourses: string[]
      }[]
      students?: string
      popularCities?: string[]
      averageCost?: string
      workRights?: string
      color?: string
    } = {}

    // Only include fields that are present in the request
    if (validatedData.country !== undefined) updateData.country = validatedData.country
    if (validatedData.slug !== undefined) updateData.slug = validatedData.slug
    if (validatedData.flag !== undefined) updateData.flag = validatedData.flag
    if (validatedData.image !== undefined) updateData.image = validatedData.image
    if (validatedData.description !== undefined) updateData.description = validatedData.description
    if (validatedData.highlights !== undefined) updateData.highlights = validatedData.highlights
    if (validatedData.universities !== undefined) updateData.universities = validatedData.universities
    if (validatedData.students !== undefined) updateData.students = validatedData.students
    if (validatedData.popularCities !== undefined) updateData.popularCities = validatedData.popularCities
    if (validatedData.averageCost !== undefined) updateData.averageCost = validatedData.averageCost
    if (validatedData.workRights !== undefined) updateData.workRights = validatedData.workRights
    if (validatedData.color !== undefined) updateData.color = validatedData.color
    if (validatedData.hero !== undefined) updateData.hero = validatedData.hero
    if (validatedData.overviewMD !== undefined) updateData.overviewMD = validatedData.overviewMD
    if (validatedData.costsMD !== undefined) updateData.costsMD = validatedData.costsMD
    if (validatedData.intakesMD !== undefined) updateData.intakesMD = validatedData.intakesMD
    if (validatedData.visaMD !== undefined) updateData.visaMD = validatedData.visaMD
    if (validatedData.scholarshipsMD !== undefined) updateData.scholarshipsMD = validatedData.scholarshipsMD
    if (validatedData.popularCourses !== undefined) updateData.popularCourses = validatedData.popularCourses
    if (validatedData.faqs !== undefined) updateData.faqs = validatedData.faqs

    const destination = await prisma.destination.update({
      where: { slug },
      data: updateData
    })

    return NextResponse.json(destination)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error updating destination:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // TODO: Add authentication check
    // const session = await getServerSession(authOptions)
    // if (!session || session.user.role !== 'ADMIN') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const { slug } = await params
    const destination = await prisma.destination.findUnique({
      where: { slug }
    })

    if (!destination) {
      return NextResponse.json(
        { error: 'Destination not found' },
        { status: 404 }
      )
    }

    await prisma.destination.delete({
      where: { slug }
    })

    return NextResponse.json({ message: 'Destination deleted successfully' })
  } catch (error) {
    console.error('Error deleting destination:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}