import { useState, useEffect } from 'react';

interface NavigationItem {
  label: string;
  href: string;
  dropdown?: Array<{
    label: string;
    href: string;
  }>;
}

interface Destination {
  _id: string;
  title: string;
  slug: string;
}

interface Service {
  _id: string;
  title: string;
  slug: string;
}

interface Scholarship {
  _id: string;
  title: string;
  slug: string;
}

export function useNavigation() {
  const [navigationData, setNavigationData] = useState<NavigationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNavigationData() {
      try {
        setLoading(true);
        
        // Fetch data from all three endpoints
        const [destinationsRes, servicesRes, scholarshipsRes] = await Promise.all([
          fetch('/api/destinations?limit=20'),
          fetch('/api/services?limit=20'),
          fetch('/api/scholarships?limit=20')
        ]);

        if (!destinationsRes.ok || !servicesRes.ok || !scholarshipsRes.ok) {
          throw new Error('Failed to fetch navigation data');
        }

        const [destinationsData, servicesData, scholarshipsData] = await Promise.all([
          destinationsRes.json(),
          servicesRes.json(),
          scholarshipsRes.json()
        ]);

        // Build navigation structure
        const navigation: NavigationItem[] = [
          {
            label: 'About Us',
            href: '/about'
          },
          {
            label: 'Destinations',
            href: '/destinations',
            dropdown: destinationsData.destinations?.map((dest: Destination) => ({
              label: dest.title,
              href: `/destinations/${dest.slug}`
            })) || []
          },
          {
            label: 'Our Services',
            href: '/services',
            dropdown: servicesData.services?.map((service: Service) => ({
              label: service.title,
              href: `/services/${service.slug}`
            })) || []
          },
          {
            label: 'Scholarships',
            href: '/scholarships',
            dropdown: scholarshipsData.scholarships?.map((scholarship: Scholarship) => ({
              label: scholarship.title,
              href: `/scholarships/${scholarship.slug}`
            })) || []
          },
          {
            label: 'Blogs',
            href: '/blogs'
          },
          {
            label: 'Contact',
            href: '/contact'
          }
        ];

        setNavigationData(navigation);
        setError(null);
      } catch (err) {
        console.error('Error fetching navigation data:', err);
        setError('Failed to load navigation data');
        
        // Fallback to basic navigation without dropdowns
        setNavigationData([
          { label: 'About Us', href: '/about' },
          { label: 'Destinations', href: '/destinations' },
          { label: 'Our Services', href: '/services' },
          { label: 'Scholarships', href: '/scholarships' },
          { label: 'Blogs', href: '/blogs' },
          { label: 'Contact', href: '/contact' }
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchNavigationData();
  }, []);

  return { navigationData, loading, error };
}