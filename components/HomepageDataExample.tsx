'use client';

import { useHomepageData } from '@/lib/hooks/useHomepageData';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export default function HomepageDataExample() {
  const { data, loading, error, refetch } = useHomepageData();

  if (loading) {
    return (
      <div className="space-y-4 p-6">
        <h2 className="text-2xl font-bold">Loading Homepage Data...</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertDescription>
            Error loading homepage data: {error}
          </AlertDescription>
        </Alert>
        <Button onClick={refetch} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6">
        <Alert>
          <AlertDescription>
            No homepage data available.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Homepage Data Overview</h2>
        <Button onClick={refetch} variant="outline">
          Refresh Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Slides */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-2">Hero Slides</h3>
          <p className="text-gray-600 mb-2">{data.slides.length} slides</p>
          <div className="space-y-2">
            {data.slides.slice(0, 2).map((slide) => (
              <div key={slide._id} className="text-sm">
                <p className="font-medium">{slide.headline}</p>
                <p className="text-gray-500 truncate">{slide.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Services */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-2">Services</h3>
          <p className="text-gray-600 mb-2">{data.services.length} services</p>
          <div className="space-y-2">
            {data.services.slice(0, 2).map((service) => (
              <div key={service._id} className="text-sm">
                <p className="font-medium">{service.name}</p>
                <p className="text-gray-500 truncate">{service.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Destinations */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-2">Destinations</h3>
          <p className="text-gray-600 mb-2">{data.destinations.length} destinations</p>
          <div className="space-y-2">
            {data.destinations.slice(0, 2).map((destination) => (
              <div key={destination._id} className="text-sm">
                <p className="font-medium">{destination.name}</p>
                <p className="text-gray-500">{destination.country}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Success Stories */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-2">Success Stories</h3>
          <p className="text-gray-600 mb-2">{data.successStories.length} stories</p>
          <div className="space-y-2">
            {data.successStories.slice(0, 2).map((story) => (
              <div key={story._id} className="text-sm">
                <p className="font-medium">{story.author}</p>
                <p className="text-gray-500">{story.country} • {story.year}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-2">Insights</h3>
          <p className="text-gray-600 mb-2">{data.insights.length} articles</p>
          <div className="space-y-2">
            {data.insights.slice(0, 2).map((insight) => (
              <div key={insight._id} className="text-sm">
                <p className="font-medium">{insight.title}</p>
                <p className="text-gray-500 truncate">{insight.excerpt}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-2">Statistics</h3>
          <p className="text-gray-600 mb-2">{data.stats.length} stats</p>
          <div className="space-y-2">
            {data.stats.map((stat) => (
              <div key={stat._id} className="text-sm flex justify-between">
                <span className="font-medium">{stat.label}</span>
                <span className="text-blue-600">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Info */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2 text-blue-800">Performance Features</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>✅ Single API call for all homepage data</li>
          <li>✅ Client-side caching (5 minutes)</li>
          <li>✅ Browser cache headers</li>
          <li>✅ Parallel database queries</li>
          <li>✅ TypeScript type safety</li>
          <li>✅ Error handling and retry functionality</li>
        </ul>
      </div>
    </div>
  );
}