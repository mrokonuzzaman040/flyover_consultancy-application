import { Metadata } from 'next'
import Reveal from '@/components/ui/reveal'
import PageHeader from '@/components/page-header'
import { Target, Eye, Heart, Globe, Users, Lightbulb, Award, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mission & Vision | Flyover Education',
  description: 'Discover our mission to democratize international education and our vision for a globally connected future where every student can achieve their dreams.',
}

const coreValues = [
  {
    icon: Heart,
    title: 'Student-Centric Approach',
    description: 'Every decision we make is guided by what&apos;s best for our students. Their success is our success, and their dreams fuel our passion.'
  },
  {
    icon: Globe,
    title: 'Global Perspective',
    description: 'We believe in the power of international education to broaden horizons, foster understanding, and create global citizens.'
  },
  {
    icon: Lightbulb,
    title: 'Innovation & Excellence',
    description: 'We continuously innovate our services and maintain the highest standards to provide exceptional educational consulting.'
  },
  {
    icon: Users,
    title: 'Inclusive Community',
    description: 'We celebrate diversity and ensure that quality international education is accessible to students from all backgrounds.'
  },
  {
    icon: Award,
    title: 'Integrity & Trust',
    description: 'We build lasting relationships through transparency, honesty, and unwavering commitment to ethical practices.'
  },
  {
    icon: Target,
    title: 'Results-Driven',
    description: 'We measure our success by the achievements of our students and their satisfaction with our services.'
  }
]

const impactStats = [
  { number: '5,000+', label: 'Students Guided', description: 'Successfully placed in top universities worldwide' },
  { number: '500+', label: 'Partner Universities', description: 'Across 25+ countries and 6 continents' },
  { number: '98%', label: 'Success Rate', description: 'Students accepted to their preferred universities' },
  { number: '$50M+', label: 'Scholarships Secured', description: 'In financial aid and merit scholarships' }
]

const futureGoals = [
  {
    title: 'Digital Innovation',
    description: 'Leverage AI and technology to personalize the student journey and improve outcomes.',
    timeline: '2024-2025'
  },
  {
    title: 'Global Expansion',
    description: 'Establish presence in 10 new countries to serve students worldwide.',
    timeline: '2025-2026'
  },
  {
    title: 'Scholarship Fund',
    description: 'Launch a $10M scholarship fund for underrepresented students.',
    timeline: '2026-2027'
  },
  {
    title: 'University Partnerships',
    description: 'Partner with 1,000+ universities to create exclusive opportunities.',
    timeline: '2027-2028'
  }
]

export default function MissionVisionPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <PageHeader
        title="Our Mission & Vision"
        subtitle="Empowering students to achieve their international education dreams"
        image="/hero/slide3.svg"
      />

      {/* Mission Statement */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-600 text-white rounded-full mb-8">
                <Target className="w-10 h-10" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <div className="max-w-4xl mx-auto">
                <p className="text-xl text-gray-700 leading-relaxed mb-8">
                  To democratize access to world-class international education by providing personalized, 
                  comprehensive guidance that empowers students to achieve their academic and career aspirations 
                  on a global stage.
                </p>
                <div className="bg-brand-50 rounded-2xl p-8">
                  <p className="text-lg text-brand-800 font-medium leading-relaxed">
                    &quot;We believe that every student, regardless of their background, deserves the opportunity 
                    to pursue their dreams at the world&apos;s best universities. Our mission is to make that 
                    dream a reality through expert guidance, unwavering support, and innovative solutions.&quot;
                  </p>
                  <div className="mt-6 text-brand-600 font-semibold">— Sarah Johnson, Founder & CEO</div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Vision Statement */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-600 text-white rounded-full mb-8">
                <Eye className="w-10 h-10" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Vision</h2>
              <div className="max-w-4xl mx-auto">
                <p className="text-xl text-gray-700 leading-relaxed mb-8">
                  To be the world&apos;s most trusted platform for international education, creating a global 
                  community where cultural exchange, academic excellence, and personal growth flourish without boundaries.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Globe className="w-8 h-8 text-brand-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Global Reach</h3>
                    <p className="text-gray-600">Connecting students worldwide with opportunities across all continents</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-brand-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Inclusive Access</h3>
                    <p className="text-gray-600">Making quality education accessible to students from all backgrounds</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Lightbulb className="w-8 h-8 text-brand-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Innovation</h3>
                    <p className="text-gray-600">Leading the industry with cutting-edge technology and methodologies</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Core Values</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                These fundamental principles guide every interaction, decision, and innovation at Flyover Education
              </p>
            </div>
          </Reveal>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreValues.map((value, index) => {
              const Icon = value.icon
              return (
                <Reveal key={index} delay={index * 0.1}>
                  <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                    <div className="w-16 h-16 bg-brand-600 rounded-full flex items-center justify-center mb-6">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* Impact & Statistics */}
      <section className="py-20 bg-brand-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-6">Our Impact</h2>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Measuring success through the achievements and satisfaction of our students
              </p>
            </div>
          </Reveal>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => (
              <Reveal key={index} delay={index * 0.1}>
                <div className="text-center">
                  <div className="text-5xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-xl font-semibold text-white/90 mb-2">{stat.label}</div>
                  <div className="text-white/80 text-sm">{stat.description}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Future Goals */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Future Goals</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Ambitious plans to expand our impact and serve even more students worldwide
              </p>
            </div>
          </Reveal>
          
          <div className="space-y-8">
            {futureGoals.map((goal, index) => (
              <Reveal key={index} delay={index * 0.1}>
                <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-brand-600 rounded-full flex items-center justify-center mr-4">
                          <ArrowRight className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{goal.title}</h3>
                          <div className="text-brand-600 font-medium">{goal.timeline}</div>
                        </div>
                      </div>
                      <p className="text-gray-600 leading-relaxed">{goal.description}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Join Us in Shaping the Future
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Be part of our mission to make international education accessible to all. 
              Whether you&apos;re a student, educator, or partner, there&apos;s a place for you in our global community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contact"
                className="inline-flex items-center px-8 py-3 bg-brand-600 text-white font-semibold rounded-lg hover:bg-brand-700 transition-colors"
              >
                Start Your Journey
              </a>
              <a 
                href="/team"
                className="inline-flex items-center px-8 py-3 border-2 border-brand-600 text-brand-600 font-semibold rounded-lg hover:bg-brand-50 transition-colors"
              >
                Meet Our Team
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}