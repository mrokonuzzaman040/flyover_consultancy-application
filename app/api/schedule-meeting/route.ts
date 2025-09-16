import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { dbConnect } from '@/lib/mongoose'
import { MeetingSchedule } from '@/lib/models/MeetingSchedule'

// Validation schema for meeting schedule
const meetingScheduleSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  message: z.string().optional(),
  preferredService: z.string().optional(),
  urgency: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('LOW'),
  scheduledDateTime: z.string().min(1, 'Scheduled date time is required')
})

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const body = await request.json()
    
    // Validate the request body
    const validatedData = meetingScheduleSchema.parse(body)
    
    // Check if the scheduled date is not in the past
    const scheduledDate = new Date(validatedData.scheduledDateTime)
    const now = new Date()
    
    if (scheduledDate <= now) {
      return NextResponse.json(
        { message: 'Scheduled date must be in the future' },
        { status: 400 }
      )
    }
    
    // Create new meeting schedule
    const meetingSchedule = new MeetingSchedule({
      fullName: validatedData.fullName,
      phoneNumber: validatedData.phoneNumber,
      email: validatedData.email || undefined,
      scheduledDateTime: scheduledDate,
      message: validatedData.message,
      preferredService: validatedData.preferredService,
      urgency: validatedData.urgency,
      status: 'PENDING'
    })
    
    await meetingSchedule.save()
    
    return NextResponse.json(
      { 
        message: 'Meeting scheduled successfully',
        meetingId: meetingSchedule._id
      },
      { status: 201 }
    )
    
  } catch (error) {
    console.error('Error scheduling meeting:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          message: 'Validation error',
          errors: error.issues
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}