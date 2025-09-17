import { useState, useEffect } from 'react';

interface SuccessStory {
  _id: string;
  storyId: number;
  rating: number;
  text: string;
  author: string;
  university: string;
  program: string;
  country: string;
  scholarship: string;
  year: string;
  avatar: string;
  flag: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export function useSuccessStories() {
  const [successStories, setSuccessStories] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSuccessStories() {
      try {
        setLoading(true);
        const response = await fetch('/api/success-stories');
        
        if (!response.ok) {
          throw new Error('Failed to fetch success stories');
        }

        const data = await response.json();
        setSuccessStories(data.successStories || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching success stories:', err);
        setError('Failed to load success stories');
        setSuccessStories([]);
      } finally {
        setLoading(false);
      }
    }

    fetchSuccessStories();
  }, []);

  return { successStories, loading, error };
}
