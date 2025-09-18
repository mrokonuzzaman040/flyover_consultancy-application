import { useState, useEffect } from 'react';

interface Award {
  _id: string;
  id: number;
  title: string;
  image: string;
  year: number;
  createdAt: string;
  updatedAt: string;
}

export function useAwards() {
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAwards() {
      try {
        setLoading(true);
        const response = await fetch('/api/awards');
        
        if (!response.ok) {
          throw new Error('Failed to fetch awards');
        }

        const data = await response.json();
        setAwards(data.awards || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching awards:', err);
        setError('Failed to load awards');
        setAwards([]);
      } finally {
        setLoading(false);
      }
    }

    fetchAwards();
  }, []);

  return { awards, loading, error };
}
