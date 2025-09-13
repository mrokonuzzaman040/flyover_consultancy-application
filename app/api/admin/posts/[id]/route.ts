import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const PostUpdateSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters").optional(),
  slug: z.string().min(1, "Slug is required").max(100, "Slug must be less than 100 characters").optional(),
  excerpt: z.string().optional(),
  contentMD: z.string().min(1, "Content is required").optional(),
  tags: z.array(z.string()).optional(),
  country: z.array(z.string()).optional(),
  author: z.string().min(1, "Author is required").optional(),
  coverUrl: z.string().url().optional().or(z.literal("")),
  status: z.enum(["draft", "published", "archived"]).optional()
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPPORT')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    
    const post = await prisma.post.findUnique({
      where: { id }
    })

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json({ post })
  } catch (error) {
    console.error('Post GET API error:', error)
    return NextResponse.json(
      { error: "Internal server error" },
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
    
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPPORT')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = PostUpdateSchema.parse(body)

    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id }
    })

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Check if slug already exists (if slug is being updated)
    if (validatedData.slug && validatedData.slug !== existingPost.slug) {
      const slugExists = await prisma.post.findUnique({
        where: { slug: validatedData.slug }
      })

      if (slugExists) {
        return NextResponse.json(
          { error: "A post with this slug already exists" },
          { status: 400 }
        )
      }
    }

    // Prepare update data
    const updateData: {
      title?: string
      slug?: string
      excerpt?: string
      contentMD?: string
      tags?: string[]
      country?: string[]
      author?: string
      coverUrl?: string | null
      status?: string
      publishedAt?: Date | null
    } = { ...validatedData }
    
    // Handle publishedAt based on status change
    if (validatedData.status) {
      if (validatedData.status === 'published' && existingPost.status !== 'published') {
        updateData.publishedAt = new Date()
      } else if (validatedData.status !== 'published' && existingPost.status === 'published') {
        updateData.publishedAt = null
      }
    }

    // Handle coverUrl
    if (validatedData.coverUrl === "") {
      updateData.coverUrl = null
    }

    const post = await prisma.post.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({ post })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      )
    }

    console.error('Post PATCH API error:', error)
    return NextResponse.json(
      { error: "Internal server error" },
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
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    
    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id }
    })

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    await prisma.post.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Post deleted successfully" })
  } catch (error) {
    console.error('Post DELETE API error:', error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}