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

// GET - Fetch all slides
export async function GET() {
  try {
    await dbConnect()
    const slides = await Slide.find().sort({ order: 1 })
    
    const slidesWithIds = slides.map((slide) => ({
      id: slide._id.toString(),
      image: slide.image,
      headline: slide.headline,
      sub: slide.sub,
      primary: slide.primary,
      secondary: slide.secondary,
      order: slide.order,
      active: slide.active
    }))
    
    return NextResponse.json({ slides: slidesWithIds })
  } catch (error) {
    console.error('Error fetching slides:', error)
    return NextResponse.json(
      { error: 'Failed to fetch slides' },
      { status: 500 }
    )
  }
}

// POST - Create new slide
export async function POST(request: NextRequest) {
  try {
    const slideData: SlideData = await request.json()
    await dbConnect()
    
    const newSlide = new Slide({
      image: slideData.image,
      headline: slideData.headline,
      sub: slideData.sub,
      primary: slideData.primary,
      secondary: slideData.secondary,
      order: slideData.order || 0,
      active: slideData.active !== undefined ? slideData.active : true
    })
    
    const savedSlide = await newSlide.save()
    
    const responseSlide = {
      id: savedSlide._id.toString(),
      image: savedSlide.image,
      headline: savedSlide.headline,
      sub: savedSlide.sub,
      primary: savedSlide.primary,
      secondary: savedSlide.secondary,
      order: savedSlide.order,
      active: savedSlide.active
    }
    
    return NextResponse.json({ slide: responseSlide }, { status: 201 })
  } catch (error) {
    console.error('Error creating slide:', error)
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    )
  }
}

// PUT - Update existing slide
export async function PUT(request: NextRequest) {
  try {
    const slideData: SlideData = await request.json()
    await dbConnect()
    
    if (!slideData.id) {
      return NextResponse.json(
        { error: 'Slide ID is required' },
        { status: 400 }
      )
    }
    
    const updatedSlide = await Slide.findByIdAndUpdate(
      slideData.id,
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

// DELETE - Delete slide
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slideId = searchParams.get('id')
    
    if (!slideId) {
      return NextResponse.json(
        { error: 'Slide ID is required' },
        { status: 400 }
      )
    }
    
    await dbConnect()
    
    const deletedSlide = await Slide.findByIdAndDelete(slideId)
    
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