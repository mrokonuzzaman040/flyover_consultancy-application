import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/mongoose'
import { HomeSettings } from '@/lib/models/HomeSettings'

interface Slide {
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
}

async function getHomeSettings() {
  await dbConnect()
  let homeSettings = await HomeSettings.findOne()
  
  if (!homeSettings) {
    homeSettings = new HomeSettings({
      heroSlider: []
    })
    await homeSettings.save()
  }
  
  return homeSettings
}

// GET - Fetch all slides
export async function GET() {
  try {
    const homeSettings = await getHomeSettings()
    const slides = homeSettings.heroSlider || []
    
    // Add IDs to slides if they don't have them and convert to expected format
     const slidesWithIds = slides.map((slide: Record<string, unknown>, index: number) => ({
      id: slide._id?.toString() || `slide-${index + 1}`,
      image: slide.image || slide.imageUrl || '',
      headline: slide.headline || slide.title || '',
      sub: slide.sub || slide.subtitle || '',
      primary: slide.primaryButton || { label: '', href: '', isModal: false },
      secondary: slide.secondaryButton || { label: '', href: '', isModal: false }
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
    const newSlide: Slide = await request.json()
    const homeSettings = await getHomeSettings()
    
    // Convert to database format
    const slideForDB = {
      image: newSlide.image,
      imageUrl: newSlide.image,
      headline: newSlide.headline,
      title: newSlide.headline,
      sub: newSlide.sub,
      subtitle: newSlide.sub,
      primaryButton: newSlide.primary,
      secondaryButton: newSlide.secondary
    }
    
    homeSettings.heroSlider.push(slideForDB)
    await homeSettings.save()
    
    const savedSlide = {
      ...newSlide,
      id: `slide-${Date.now()}`
    }
    
    return NextResponse.json({ slide: savedSlide }, { status: 201 })
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
    const updatedSlide: Slide = await request.json()
    const homeSettings = await getHomeSettings()
    
    if (!updatedSlide.id) {
      return NextResponse.json(
        { error: 'Slide ID is required' },
        { status: 400 }
      )
    }
    
    const slideIndex = homeSettings.heroSlider.findIndex(
      (slide: Record<string, unknown>) => slide._id?.toString() === updatedSlide.id
    )
    
    if (slideIndex === -1) {
      return NextResponse.json(
        { error: 'Slide not found' },
        { status: 404 }
      )
    }
    
    // Convert to database format
    const slideForDB = {
      _id: homeSettings.heroSlider[slideIndex]._id,
      image: updatedSlide.image,
      imageUrl: updatedSlide.image,
      headline: updatedSlide.headline,
      title: updatedSlide.headline,
      sub: updatedSlide.sub,
      subtitle: updatedSlide.sub,
      primaryButton: updatedSlide.primary,
      secondaryButton: updatedSlide.secondary
    }
    
    homeSettings.heroSlider[slideIndex] = slideForDB
    await homeSettings.save()
    
    return NextResponse.json({ slide: updatedSlide })
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
    
    const homeSettings = await getHomeSettings()
    
    const slideIndex = homeSettings.heroSlider.findIndex(
      (slide: Record<string, unknown>) => slide._id?.toString() === slideId
    )
    
    if (slideIndex === -1) {
      return NextResponse.json(
        { error: 'Slide not found' },
        { status: 404 }
      )
    }
    
    homeSettings.heroSlider.splice(slideIndex, 1)
    await homeSettings.save()
    
    return NextResponse.json({ message: 'Slide deleted successfully' })
  } catch (error) {
    console.error('Error deleting slide:', error)
    return NextResponse.json(
      { error: 'Failed to delete slide' },
      { status: 500 }
    )
  }
}