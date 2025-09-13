import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPPORT")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get counts for all models
    const [totalLeads, totalPosts, totalEvents, totalTestimonials, totalUploads] = await Promise.all([
      prisma.lead.count(),
      prisma.post.count(),
      prisma.event.count(),
      prisma.testimonial.count(),
      prisma.upload.count()
    ])

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const recentActivity = await prisma.lead.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      }
    })

    const stats = {
      totalLeads,
      totalPosts,
      totalEvents,
      totalTestimonials,
      totalUploads,
      recentActivity
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Dashboard API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}