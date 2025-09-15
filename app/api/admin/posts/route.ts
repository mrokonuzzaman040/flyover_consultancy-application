import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dbConnect, toObject } from "@/lib/mongoose";
import { Post } from "@/lib/models/Post";

const schema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).transform((s)=>s.toLowerCase()).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  excerpt: z.string().optional().nullable(),
  contentMD: z.string().min(1),
  tags: z.array(z.string()).default([]),
  country: z.array(z.string()).default([]),
  author: z.string().min(1),
  coverUrl: z.string().url().optional().nullable(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  publishedAt: z.string().or(z.date()).optional().transform((v) => (v ? new Date(v) : undefined)),
});

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const q: Record<string, unknown> = {};
    if (status && ["draft", "published", "archived"].includes(status)) q.status = status;
    const posts = await Post.find(q).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ posts: posts.map((p) => ({ ...toObject(p as { _id: unknown }) })) });
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const json = await req.json();
    const parsed = schema.safeParse(json);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    const exists = await Post.findOne({ slug: parsed.data.slug });
    if (exists) return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    const doc = await Post.create(parsed.data);
    return NextResponse.json({ post: toObject(doc.toObject()) }, { status: 201 });
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
