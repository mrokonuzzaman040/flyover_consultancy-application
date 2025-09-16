import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'sections-data.json')

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

function readData() {
  try {
    const fileContent = fs.readFileSync(DATA_FILE_PATH, 'utf8')
    return JSON.parse(fileContent)
  } catch (error) {
    console.error('Error reading data file:', error)
    return { slides: [] }
  }
}

function writeData(data: { slides: Slide[] }) {
  try {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2))
    return true
  } catch (error) {
    console.error('Error writing data file:', error)
    return false
  }
}

// GET - Fetch all slides
export async function GET() {
  try {
    const data = readData()
    const slides = data.slides || []
    
    // Add IDs to slides if they don't have them
    const slidesWithIds = slides.map((slide: Slide, index: number) => ({
      ...slide,
      id: slide.id || `slide-${index + 1}`
    }))
    
    return NextResponse.json({ slides: slidesWithIds })
  } catch {
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
    const data = readData()
    
    if (!data.slides) {
      data.slides = []
    }
    
    // Generate ID for new slide
    const newId = `slide-${Date.now()}`
    const slideWithId = { ...newSlide, id: newId }
    
    data.slides.push(slideWithId)
    
    if (writeData(data)) {
      return NextResponse.json({ slide: slideWithId }, { status: 201 })
    } else {
      return NextResponse.json(
        { error: 'Failed to save slide' },
        { status: 500 }
      )
    }
  } catch {
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
    const data = readData()
    
    if (!data.slides || !updatedSlide.id) {
      return NextResponse.json(
        { error: 'Slide not found or invalid ID' },
        { status: 404 }
      )
    }
    
    const slideIndex = data.slides.findIndex((slide: Slide) => 
      slide.id === updatedSlide.id || data.slides.indexOf(slide).toString() === updatedSlide.id
    )
    
    if (slideIndex === -1) {
      return NextResponse.json(
        { error: 'Slide not found' },
        { status: 404 }
      )
    }
    
    data.slides[slideIndex] = updatedSlide
    
    if (writeData(data)) {
      return NextResponse.json({ slide: updatedSlide })
    } else {
      return NextResponse.json(
        { error: 'Failed to update slide' },
        { status: 500 }
      )
    }
  } catch {
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
    
    const data = readData()
    
    if (!data.slides) {
      return NextResponse.json(
        { error: 'No slides found' },
        { status: 404 }
      )
    }
    
    const slideIndex = data.slides.findIndex((slide: Slide, index: number) => 
      slide.id === slideId || index.toString() === slideId
    )
    
    if (slideIndex === -1) {
      return NextResponse.json(
        { error: 'Slide not found' },
        { status: 404 }
      )
    }
    
    data.slides.splice(slideIndex, 1)
    
    if (writeData(data)) {
      return NextResponse.json({ message: 'Slide deleted successfully' })
    } else {
      return NextResponse.json(
        { error: 'Failed to delete slide' },
        { status: 500 }
      )
    }
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete slide' },
      { status: 500 }
    )
  }
}