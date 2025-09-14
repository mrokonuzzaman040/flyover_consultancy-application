import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding services...');

  // Application Support Service
  const applicationSupport = await prisma.service.upsert({
    where: { slug: 'application-support' },
    update: {},
    create: {
      name: 'Application Support',
      slug: 'application-support',
      title: 'Application Support',
      subtitle: 'Complete assistance with university applications, from document preparation to submission.',
      description: 'University applications require careful planning, attention to detail, and strategic positioning. Our comprehensive application support ensures your application stands out and maximizes your chances of admission.',
      image: '/hero/slide3.svg',
      sectionsMD: [
        '## Your Path to University Admission Success\n\nUniversity applications require careful planning, attention to detail, and strategic positioning. Our comprehensive application support ensures your application stands out and maximizes your chances of admission.',
        '## Complete Application Support\n\nWe provide end-to-end support for your university application process, ensuring every detail is perfect.',
        '## Our 5-Step Application Process\n\nWe follow a systematic approach to ensure your application is comprehensive and competitive.'
      ],
      features: [
        {
          icon: 'Target',
          title: 'Strategic Planning',
          description: 'We help you identify the best universities and programs that match your academic profile and career goals.'
        },
        {
          icon: 'FileCheck',
          title: 'Document Excellence',
          description: 'Professional assistance with all application documents to ensure they meet university standards.'
        },
        {
          icon: 'Users',
          title: 'Expert Guidance',
          description: 'Our experienced counselors provide personalized support throughout the entire application process.'
        }
      ],
      benefits: [
        'University selection and matching',
        'Application form completion',
        'Document preparation and verification',
        'Personal statement writing assistance',
        'Letter of recommendation guidance',
        'Application submission and tracking',
        'Interview preparation',
        'Scholarship application support'
      ],
      process: [
        {
          step: '01',
          title: 'Initial Assessment',
          description: 'We evaluate your academic background, career goals, and preferences to create a personalized application strategy.'
        },
        {
          step: '02',
          title: 'University Selection',
          description: 'Based on your profile, we help you select universities and programs that offer the best fit and admission chances.'
        },
        {
          step: '03',
          title: 'Document Preparation',
          description: 'We assist with preparing all required documents including transcripts, certificates, and supporting materials.'
        },
        {
          step: '04',
          title: 'Application Writing',
          description: 'Our experts help craft compelling personal statements and essays that highlight your unique strengths.'
        },
        {
          step: '05',
          title: 'Submission & Follow-up',
          description: 'We handle the application submission process and provide ongoing support until you receive your admission decision.'
        }
      ],
      ctaLabel: 'Get Started',
      ctaText: 'Ready to Start Your Application Journey?'
    }
  });

  // Course Selection Service
  const courseSelection = await prisma.service.upsert({
    where: { slug: 'course-selection' },
    update: {},
    create: {
      name: 'Course Selection',
      slug: 'course-selection',
      title: 'Course Selection',
      subtitle: 'Expert guidance to help you choose the right course and university for your career goals.',
      description: 'Selecting the right course is one of the most important decisions you\'ll make. Our expert counselors help you navigate through thousands of options to find the perfect program that aligns with your career aspirations and personal goals.',
      image: '/hero/slide1.svg',
      sectionsMD: [
        '## Choose Your Future with Confidence\n\nSelecting the right course is one of the most important decisions you\'ll make. Our expert counselors help you navigate through thousands of options to find the perfect program that aligns with your career aspirations and personal goals.',
        '## Our Course Selection Services\n\nWe provide comprehensive research and analysis to help you make informed decisions about your academic future.',
        '## Popular Study Fields & Career Prospects\n\nExplore trending fields with strong job growth and competitive salaries.'
      ],
      features: [
        {
          icon: 'BookOpen',
          title: 'Comprehensive Research',
          description: 'We analyze thousands of courses across multiple universities to find the perfect match for your goals.'
        },
        {
          icon: 'TrendingUp',
          title: 'Market Insights',
          description: 'Stay ahead with our analysis of industry trends and job market demands in your field of interest.'
        },
        {
          icon: 'Award',
          title: 'Quality Assurance',
          description: 'We only recommend accredited programs from reputable institutions with strong graduate outcomes.'
        }
      ],
      benefits: [
        'Career assessment and goal alignment',
        'Course and program research',
        'University ranking analysis',
        'Entry requirements evaluation',
        'Career prospects analysis',
        'Industry trends and job market insights',
        'Scholarship and funding opportunities',
        'Course comparison and recommendations'
      ],
      process: [
        {
          step: 'Assessment',
          title: 'Assessment',
          description: 'We evaluate your academic background, interests, career goals, and personal preferences.'
        },
        {
          step: 'Research',
          title: 'Research',
          description: 'Our team researches courses and universities that align with your profile and aspirations.'
        },
        {
          step: 'Analysis',
          title: 'Analysis',
          description: 'We analyze factors like course content, career prospects, entry requirements, and costs.'
        },
        {
          step: 'Recommendation',
          title: 'Recommendation',
          description: 'You receive a personalized report with our top course and university recommendations.'
        }
      ],
      ctaLabel: 'Get Started',
      ctaText: 'Ready to Find Your Perfect Course?'
    }
  });

  // Study Consultation Service
  const studyConsultation = await prisma.service.upsert({
    where: { slug: 'study-consultation' },
    update: {},
    create: {
      name: 'Study Consultation',
      slug: 'study-consultation',
      title: 'Study Consultation',
      subtitle: 'Expert guidance to help you choose the right course and university for your goals.',
      description: 'Our comprehensive study consultation service helps you navigate the complex world of international education. We provide personalized guidance to ensure you choose the right academic path for your career goals.',
      image: '/hero/slide1.svg',
      sectionsMD: [
        '## Make Informed Decisions About Your Future\n\nOur comprehensive study consultation service helps you navigate the complex world of international education. We provide personalized guidance to ensure you choose the right academic path for your career goals.',
        '## What\'s Included in Our Consultation\n\nWe provide comprehensive support to help you make the best decisions for your academic future.'
      ],
      features: [
        {
          icon: 'Users',
          title: 'Expert Counselors',
          description: 'Work with experienced education consultants who understand global academic systems.'
        },
        {
          icon: 'BookOpen',
          title: 'Comprehensive Research',
          description: 'Access detailed information about universities, courses, and career prospects.'
        },
        {
          icon: 'Target',
          title: 'Goal-Oriented Planning',
          description: 'Develop a clear roadmap aligned with your career aspirations and academic interests.'
        }
      ],
      benefits: [
        'Personalized academic pathway planning',
        'University and course recommendations',
        'Career-focused program selection',
        'Budget and scholarship guidance',
        'Timeline and application strategy',
        'One-on-one expert counseling'
      ],
      ctaLabel: 'Book Consultation',
      ctaText: 'Ready to Start Your Academic Journey?'
    }
  });

  // Visa Assistance Service
  const visaAssistance = await prisma.service.upsert({
    where: { slug: 'visa-assistance' },
    update: {},
    create: {
      name: 'Visa Assistance',
      slug: 'visa-assistance',
      title: 'Visa Assistance',
      subtitle: 'Complete support with visa applications, documentation, and interview preparation.',
      description: 'Visa applications can be complex and stressful. Our experienced team provides comprehensive support throughout the entire process, ensuring your application is complete, accurate, and submitted on time.',
      image: '/hero/slide2.svg',
      sectionsMD: [
        '## Navigate Visa Requirements with Confidence\n\nVisa applications can be complex and stressful. Our experienced team provides comprehensive support throughout the entire process, ensuring your application is complete, accurate, and submitted on time.',
        '## Our Visa Services Include\n\nWe provide comprehensive support for all aspects of the visa application process.',
        '## Visa Types We Handle\n\nWe provide assistance for all major student visa categories across popular study destinations.'
      ],
      features: [
        {
          icon: 'FileText',
          title: 'Document Management',
          description: 'Comprehensive checklist and verification of all required documents for your visa application.'
        },
        {
          icon: 'Clock',
          title: 'Timely Processing',
          description: 'Efficient handling of your application to meet deadlines and avoid delays.'
        },
        {
          icon: 'Shield',
          title: 'Success Guarantee',
          description: 'High success rate with expert guidance and thorough preparation for your visa interview.'
        }
      ],
      benefits: [
        'Visa application form completion',
        'Document checklist and verification',
        'Interview preparation and coaching',
        'Application submission support',
        'Status tracking and follow-up',
        'Appeal and reapplication assistance'
      ],
      ctaLabel: 'Get Started',
      ctaText: 'Ready to Start Your Visa Application?'
    }
  });

  console.log('Seeded service:', applicationSupport.name);
  console.log('Seeded service:', courseSelection.name);
  console.log('Seeded service:', studyConsultation.name);
  console.log('Seeded service:', visaAssistance.name);
  console.log('Services seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
