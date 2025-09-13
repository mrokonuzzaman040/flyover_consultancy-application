import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

// In a real application, you would store these in a database
// For this demo, we'll use environment variables and in-memory storage
let systemSettings = {
  siteName: process.env.SITE_NAME || "Flyover Admin",
  siteDescription: process.env.SITE_DESCRIPTION || "Admin dashboard for file management",
  adminEmail: process.env.ADMIN_EMAIL || "",
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || "10"),
  allowedFileTypes: (process.env.ALLOWED_FILE_TYPES || "image/jpeg,image/png,image/gif,application/pdf").split(','),
  enableRegistration: process.env.ENABLE_REGISTRATION === 'true',
  enableEmailVerification: process.env.ENABLE_EMAIL_VERIFICATION !== 'false',
  maintenanceMode: process.env.MAINTENANCE_MODE === 'true',
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || "",
  smtpHost: process.env.SMTP_HOST || "",
  smtpPort: parseInt(process.env.SMTP_PORT || "587"),
  smtpUser: process.env.SMTP_USER || ""
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Don't expose sensitive information like API keys in full
    const safeSettings = {
      ...systemSettings,
      cloudinaryApiKey: systemSettings.cloudinaryApiKey ? '***' + systemSettings.cloudinaryApiKey.slice(-4) : '',
    }

    return NextResponse.json({ settings: safeSettings })
  } catch (error) {
    console.error('Get settings API error:', error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { settings } = body

    // Validate required fields
    if (!settings.siteName || !settings.adminEmail) {
      return NextResponse.json(
        { error: "Site name and admin email are required" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(settings.adminEmail)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Validate file size
    if (settings.maxFileSize < 1 || settings.maxFileSize > 100) {
      return NextResponse.json(
        { error: "Max file size must be between 1 and 100 MB" },
        { status: 400 }
      )
    }

    // Validate SMTP port
    if (settings.smtpPort < 1 || settings.smtpPort > 65535) {
      return NextResponse.json(
        { error: "Invalid SMTP port" },
        { status: 400 }
      )
    }

    // Update settings (in a real app, save to database)
    systemSettings = {
      ...systemSettings,
      ...settings,
      maxFileSize: parseInt(settings.maxFileSize),
      smtpPort: parseInt(settings.smtpPort),
      allowedFileTypes: Array.isArray(settings.allowedFileTypes) 
        ? settings.allowedFileTypes 
        : settings.allowedFileTypes.split(',').map((type: string) => type.trim())
    }

    // In a real application, you would also update environment variables
    // or save to a configuration database table

    return NextResponse.json({ 
      message: "Settings updated successfully",
      settings: systemSettings 
    })
  } catch (error) {
    console.error('Update settings API error:', error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}