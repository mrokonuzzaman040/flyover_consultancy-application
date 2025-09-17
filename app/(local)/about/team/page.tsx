import { Metadata } from 'next'
import Reveal from '@/components/ui/reveal'
import PageHeader from '@/components/page-header'
import { Mail, Linkedin, Phone, MapPin, Award, Users, Target, Heart } from 'lucide-react'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Our Team | Flyover Education',
  description: 'Meet the dedicated professionals at Flyover Education who are committed to helping students achieve their international education dreams.',
}

interface TeamMember {
  _id?: string
  id: string
  name: string
  role: string
  image: string
  bio: string
  expertise: string[]
  email: string
  linkedin: string
  phone: string
  isActive: boolean
  order: number
}

async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/team`, {
      next: { revalidate: 300 } // Revalidate every 5 minutes
    })
    
    if (!response.ok) {
      console.error('Failed to fetch team members')
      return []
    }
    
    const data = await response.json()
    return data.team || []
  } catch (error) {
    console.error('Error fetching team members:', error)
    return []
  }
}


const stats = [
  { icon: Users, value: '50+', label: 'Team Members' },
  { icon: Award, value: '25+', label: 'Years Combined Experience' },
  { icon: Target, value: '98%', label: 'Success Rate' },
  { icon: Heart, value: '5000+', label: 'Students Helped' }
]

export default async function TeamPage() {
  const teamMembers = await getTeamMembers()
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <PageHeader
        title="Meet Our Team"
        subtitle="Dedicated professionals committed to your success"
        image="/hero/slide2.svg"
      />

      {/* Team Stats */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-600 text-white rounded-full mb-4">
                      <Icon className="w-8 h-8" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </div>
                )
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Team Introduction */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Passionate Experts, Proven Results
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Our diverse team of education professionals, former admissions officers, and industry experts 
              brings together decades of experience to guide you through every step of your international 
              education journey. We&apos;re not just consultants – we&apos;re your partners in success.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Team Members Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {teamMembers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No team members found. Please check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <Reveal key={member.id || index} delay={index * 0.1}>
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    {/* Profile Image */}
                    <div className="aspect-w-3 aspect-h-4 bg-gradient-to-br from-brand-100 to-brand-200 p-8">
                      <div className="flex items-center justify-center">
                        {member.image ? (
                          <div className="relative w-32 h-32 rounded-full overflow-hidden">
                            <Image
                              src={member.image}
                              alt={member.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-32 h-32 bg-brand-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Member Info */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                      <p className="text-brand-600 font-medium mb-3">{member.role}</p>
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">{member.bio}</p>
                      
                      {/* Expertise Tags */}
                      {member.expertise && member.expertise.length > 0 && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {member.expertise.map((skill, skillIndex) => (
                              <span 
                                key={skillIndex}
                                className="px-2 py-1 bg-brand-50 text-brand-700 text-xs rounded-full"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Contact Info */}
                      <div className="space-y-2">
                        <a 
                          href={`mailto:${member.email}`}
                          className="flex items-center text-gray-600 hover:text-brand-600 text-sm transition-colors"
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          {member.email}
                        </a>
                        {member.linkedin && (
                          <a 
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-gray-600 hover:text-brand-600 text-sm transition-colors"
                          >
                            <Linkedin className="w-4 h-4 mr-2" />
                            LinkedIn Profile
                          </a>
                        )}
                        <a 
                          href={`tel:${member.phone}`}
                          className="flex items-center text-gray-600 hover:text-brand-600 text-sm transition-colors"
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          {member.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Our Global Presence
              </h2>
              <p className="text-lg text-gray-600">
                With offices around the world, we&apos;re always close to our students
              </p>
            </div>
          </Reveal>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                city: 'New York',
                address: '123 Education Ave, Suite 500\nNew York, NY 10001',
                phone: '+1 (555) 123-4567',
                email: 'newyork@flyovereducation.com'
              },
              {
                city: 'London',
                address: '45 Academic Street\nLondon, UK SW1A 1AA',
                phone: '+44 20 7123 4567',
                email: 'london@flyovereducation.com'
              },
              {
                city: 'Sydney',
                address: '78 University Road\nSydney, NSW 2000',
                phone: '+61 2 9123 4567',
                email: 'sydney@flyovereducation.com'
              }
            ].map((office, index) => (
              <Reveal key={index} delay={index * 0.1}>
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <MapPin className="w-5 h-5 text-brand-600 mr-2" />
                    {office.city}
                  </h3>
                  <div className="space-y-3 text-gray-600">
                    <p className="whitespace-pre-line">{office.address}</p>
                    <p className="flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      {office.phone}
                    </p>
                    <p className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      {office.email}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Join Our Team CTA */}
      <section className="py-16 bg-brand-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <h2 className="text-3xl font-bold text-white mb-4">
              Join Our Mission
            </h2>
            <p className="text-xl text-white/90 mb-8">
              We&apos;re always looking for passionate professionals to join our team and help shape the future of international education.
            </p>
            <a 
              href="/contact"
              className="inline-flex items-center px-8 py-3 bg-white text-brand-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              View Open Positions
            </a>
          </Reveal>
        </div>
      </section>
    </div>
  )
}