import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seedEvents() {
  const upcomingEvents = [
    {
      title: "Study in Canada: Complete Guide 2025",
      slug: "study-in-canada-complete-guide-2025",
      description: "Comprehensive overview of Canadian universities, application processes, visa requirements, and post-graduation opportunities.",
      startAt: new Date('2025-02-15T19:00:00.000Z'), // 2:00 PM EST
      endAt: new Date('2025-02-15T20:30:00.000Z'), // 90 minutes later
      venue: "Online Webinar",
      city: "Virtual",
      capacity: 500,
      seatsRemaining: 255, // 500 - 245 attendees
      status: "published",
      bannerUrl: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800&h=400&fit=crop"
    },
    {
      title: "UK University Applications Workshop",
      slug: "uk-university-applications-workshop",
      description: "Interactive workshop covering UCAS applications, personal statements, and interview preparation for UK universities.",
      startAt: new Date('2025-02-20T10:00:00.000Z'), // 10:00 AM GMT
      endAt: new Date('2025-02-20T12:00:00.000Z'), // 2 hours later
      venue: "Online Workshop",
      city: "Virtual",
      capacity: 300,
      seatsRemaining: 144, // 300 - 156 attendees
      status: "published",
      bannerUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop"
    },
    {
      title: "Scholarship Opportunities & Funding Guide",
      slug: "scholarship-opportunities-funding-guide",
      description: "Discover available scholarships, grants, and funding options for international students across different countries.",
      startAt: new Date('2025-02-25T20:00:00.000Z'), // 3:00 PM EST
      endAt: new Date('2025-02-25T21:15:00.000Z'), // 75 minutes later
      venue: "Online Webinar",
      city: "Virtual",
      capacity: 400,
      seatsRemaining: 211, // 400 - 189 attendees
      status: "published",
      bannerUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=400&fit=crop"
    },
    {
      title: "Australia Study & Work Opportunities",
      slug: "australia-study-work-opportunities",
      description: "Learn about Australian universities, student visa process, and post-study work opportunities in Australia.",
      startAt: new Date('2025-03-05T02:00:00.000Z'), // 1:00 PM AEDT
      endAt: new Date('2025-03-05T04:00:00.000Z'), // 2 hours later
      venue: "Online Seminar",
      city: "Virtual",
      capacity: 250,
      seatsRemaining: 152, // 250 - 98 attendees
      status: "published",
      bannerUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop"
    }
  ];

  const pastEvents = [
    {
      title: "USA University Fair 2024",
      slug: "usa-university-fair-2024",
      description: "Comprehensive university fair featuring top US institutions, admission requirements, and application guidance.",
      startAt: new Date('2024-12-15T18:00:00.000Z'),
      endAt: new Date('2024-12-15T20:00:00.000Z'),
      venue: "Convention Center",
      city: "New York",
      capacity: 500,
      seatsRemaining: 0,
      status: "completed",
      bannerUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=400&fit=crop"
    },
    {
      title: "European Study Options Webinar",
      slug: "european-study-options-webinar",
      description: "Explore study opportunities across Europe including Germany, Netherlands, France, and other EU countries.",
      startAt: new Date('2024-12-10T15:00:00.000Z'),
      endAt: new Date('2024-12-10T17:00:00.000Z'),
      venue: "Online Webinar",
      city: "Virtual",
      capacity: 350,
      seatsRemaining: 0,
      status: "completed",
      bannerUrl: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&h=400&fit=crop"
    },
    {
      title: "IELTS Preparation Workshop",
      slug: "ielts-preparation-workshop",
      description: "Intensive IELTS preparation workshop covering all four skills: reading, writing, listening, and speaking.",
      startAt: new Date('2024-11-28T14:00:00.000Z'),
      endAt: new Date('2024-11-28T17:00:00.000Z'),
      venue: "Learning Center",
      city: "Toronto",
      capacity: 300,
      seatsRemaining: 0,
      status: "completed",
      bannerUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=400&fit=crop"
    }
  ];

  console.log('Seeding events...');

  // Create upcoming events
  for (const event of upcomingEvents) {
    await prisma.event.upsert({
      where: { slug: event.slug },
      update: event,
      create: event,
    });
  }

  // Create past events
  for (const event of pastEvents) {
    await prisma.event.upsert({
      where: { slug: event.slug },
      update: event,
      create: event,
    });
  }

  console.log('Events seeded successfully!');
}

seedEvents()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });