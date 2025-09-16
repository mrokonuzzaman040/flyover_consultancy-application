import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/mongoose'
import Slide from '@/lib/models/Slide'

interface SlideData {
  id?: string
  image: string
  headline: string
  sub: string
  primary: {
    label: string
    isModal?: boolean
    href?: string
  }
  secondary: {
    label: string
    href?: string
    isModal?: boolean
  }
  order?: number
  active?: boolean
}

// GET - Fetch single slide
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect()
    const { id } = await params
    const slide = await Slide.findById(id)
    
    if (!slide) {
      return NextResponse.json(
        { error: 'Slide not found' },
        { status: 404 }
      )
    }
    
    const responseSlide = {
      id: slide._id.toString(),
      image: slide.image,
      headline: slide.headline,
      sub: slide.sub,
      primary: slide.primary,
      secondary: slide.secondary,
      order: slide.order,
      active: slide.active
    }
    
    return NextResponse.json({ slide: responseSlide })
  } catch (error) {
    console.error('Error fetching slide:', error)
    return NextResponse.json(
      { error: 'Failed to fetch slide' },
      { status: 500 }
    )
  }
}

// PUT - Update single slide
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const slideData: SlideData = await request.json()
    await dbConnect()
    const { id } = await params
    
    const updatedSlide = await Slide.findByIdAndUpdate(
      id,
      {
        image: slideData.image,
        headline: slideData.headline,
        sub: slideData.sub,
        primary: slideData.primary,
        secondary: slideData.secondary,
        order: slideData.order,
        active: slideData.active
      },
      { new: true }
    )
    
    if (!updatedSlide) {
      return NextResponse.json(
        { error: 'Slide not found' },
        { status: 404 }
      )
    }
    
    const responseSlide = {
      id: updatedSlide._id.toString(),
      image: updatedSlide.image,
      headline: updatedSlide.headline,
      sub: updatedSlide.sub,
      primary: updatedSlide.primary,
      secondary: updatedSlide.secondary,
      order: updatedSlide.order,
      active: updatedSlide.active
    }
    
    return NextResponse.json({ slide: responseSlide })
  } catch (error) {
    console.error('Error updating slide:', error)
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    )
  }
}

// DELETE - Delete single slide
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect()
    const { id } = await params
    
    const deletedSlide = await Slide.findByIdAndDelete(id)
    
    if (!deletedSlide) {
      return NextResponse.json(
        { error: 'Slide not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ message: 'Slide deleted successfully' })
  } catch (error) {
    console.error('Error deleting slide:', error)
    return NextResponse.json(
      { error: 'Failed to delete slide' },
      { status: 500 }
    )
  }
}
