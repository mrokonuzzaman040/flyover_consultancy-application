import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongoose';
import Slide from '@/lib/models/Slide';
import Service from '@/lib/models/Service';
import Destination from '@/lib/models/Destination';
import WhyChooseUsFeature from '@/lib/models/WhyChooseUsFeature';
import StudyAbroadStep from '@/lib/models/StudyAbroadStep';
import SuccessStory from '@/lib/models/SuccessStory';
import Insight from '@/lib/models/Insight';
import Event from '@/lib/models/Event';
import Partner from '@/lib/models/Partner';
import Award from '@/lib/models/Award';
import Stat from '@/lib/models/Stat';
import { ContactInfo } from '@/lib/models/ContactInfo';

export async function GET() {
  try {
    await dbConnect();

    // Fetch all homepage data in parallel for maximum performance
    const [slides, services, destinations, whyChooseUsFeatures, studyAbroadSteps, successStories, insights, events, partners, awards, stats, contactInfo] = await Promise.all([
      Slide.find({}).lean(),
      Service.find({}).lean(),
      Destination.find({}).lean(),
      WhyChooseUsFeature.find({}).lean(),
      StudyAbroadStep.find({}).lean(),
      SuccessStory.find({}).lean(),
      Insight.find({}).lean(),
      Event.find({}).lean(),
      Partner.find({}).lean(),
      Award.find({}).lean(),
      Stat.find({}).lean(),
      ContactInfo.findOne({}).lean()
    ]);

    // Return all data in a single response
    return NextResponse.json({
      success: true,
      data: {
        slides,
        services,
        destinations,
        whyChooseUsFeatures,
        studyAbroadSteps,
        successStories,
        insights,
        events,
        upcomingEvents: events, // Same as events for now
        partners,
        awards,
        stats,
        contactInfo
      }
    });
  } catch (error) {
    console.error('Homepage API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch homepage data' },
      { status: 500 }
    );
  }
}

// Add caching headers for better performance
export const revalidate = 300; // Revalidate every 5 minutes