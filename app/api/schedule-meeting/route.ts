import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ratelimit } from '@/lib/ratelimit'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? '127.0.0.1'
    const { success } = await ratelimit.limit(ip)
    
    if (!success) {
      return NextResponse.json(
        { message: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const {
      fullName,
      phoneNumber,
      email,
      date,
      time,
      message,
      preferredService,
      urgency,
      scheduledDateTime
    } = body

    // Validation
    if (!fullName || !phoneNumber || !date || !time) {
      return NextResponse.json(
        { message: 'Full name, phone number, date, and time are required.' },
        { status: 400 }
      )
    }

    // Validate that the date is not today or in the past
    const selectedDate = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    selectedDate.setHours(0, 0, 0, 0)
    
    if (selectedDate <= today) {
      return NextResponse.json(
        { message: 'Please select a date from tomorrow onwards.' },
        { status: 400 }
      )
    }

    // Create the meeting schedule in database
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const meetingSchedule = await (prisma as any).meetingSchedule.create({
      data: {
        fullName,
        phoneNumber,
        email: email || null,
        preferredDate: date,
        preferredTime: time,
        scheduledDateTime: new Date(scheduledDateTime),
        message: message || null,
        preferredService: preferredService || null,
        urgency: urgency || 'normal',
        status: 'pending',
        source: 'website'
      }
    })

    return NextResponse.json(
      {
        message: 'Meeting scheduled successfully!',
        id: meetingSchedule.id
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error scheduling meeting:', error)
    return NextResponse.json(
      { message: 'Internal server error. Please try again later.' },
      { status: 500 }
    )
  }
}