'use client';

import { useState, useEffect } from 'react';
import type { HomepageData, HomepageApiResponse } from '@/lib/types/homepage';

interface UseHomepageDataReturn {
  data: HomepageData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Cache for homepage data
let cachedData: HomepageData | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useHomepageData(): UseHomepageDataReturn {
  const [data, setData] = useState<HomepageData | null>(cachedData);
  const [loading, setLoading] = useState(!cachedData);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/homepage', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add cache control for browser caching
        cache: 'force-cache',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: HomepageApiResponse = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch homepage data');
      }

      // Update cache
      cachedData = result.data;
      cacheTimestamp = Date.now();
      setData(result.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Homepage data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    // Clear cache and refetch
    cachedData = null;
    cacheTimestamp = 0;
    await fetchData();
  };

  useEffect(() => {
    // Check if we have valid cached data
    const now = Date.now();
    const isCacheValid = cachedData && (now - cacheTimestamp) < CACHE_DURATION;

    if (isCacheValid) {
      // Use cached data
      setData(cachedData);
      setLoading(false);
    } else {
      // Fetch fresh data
      fetchData();
    }
  }, []);

  return {
    data,
    loading,
    error,
    refetch,
  };
}

// Preload function for even faster loading
export async function preloadHomepageData(): Promise<void> {
  const now = Date.now();
  const isCacheValid = cachedData && (now - cacheTimestamp) < CACHE_DURATION;

  if (!isCacheValid) {
    try {
      const response = await fetch('/api/homepage', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'force-cache',
      });

      if (response.ok) {
        const result: HomepageApiResponse = await response.json();
        if (result.success) {
          cachedData = result.data;
          cacheTimestamp = Date.now();
        }
      }
    } catch (error) {
      console.error('Preload homepage data error:', error);
    }
  }
}