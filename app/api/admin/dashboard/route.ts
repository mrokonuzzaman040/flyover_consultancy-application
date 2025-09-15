import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import { Lead } from "@/lib/models/Lead";
import { Post } from "@/lib/models/Post";
import { Event } from "@/lib/models/Event";
import { Testimonial } from "@/lib/models/Testimonial";

export async function GET() {
  try {
    await dbConnect();
    const [totalLeads, totalPosts, totalEvents, totalTestimonials] = await Promise.all([
      Lead.countDocuments({}),
      Post.countDocuments({}),
      Event.countDocuments({}),
      Testimonial.countDocuments({}),
    ]);
    return NextResponse.json({
      totalLeads,
      totalPosts,
      totalEvents,
      totalTestimonials,
      totalUploads: 0,
      recentActivity: Math.max(totalLeads, totalPosts, totalEvents, totalTestimonials),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({
      totalLeads: 0,
      totalPosts: 0,
      totalEvents: 0,
      totalTestimonials: 0,
      totalUploads: 0,
      recentActivity: 0,
    });
  }
}

