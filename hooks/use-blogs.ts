"use client";

import { useState, useEffect } from 'react';
import { Blog } from '@/lib/models/Blog';

interface BlogWithExtras extends Blog {
  categoryColor: string;
  authorRole: string;
  views: string;
  likes: string;
}

const getCategoryColor = (category: string): string => {
  const colorMap: { [key: string]: string } = {
    'Study Guides': 'bg-blue-100 text-blue-800',
    'Scholarships': 'bg-purple-100 text-purple-800',
    'Visa Guides': 'bg-green-100 text-green-800',
    'Success Stories': 'bg-yellow-100 text-yellow-800',
    'University Tips': 'bg-indigo-100 text-indigo-800',
    'Financial Planning': 'bg-orange-100 text-orange-800',
    'Study Abroad': 'bg-pink-100 text-pink-800',
    'Cultural Adaptation': 'bg-cyan-100 text-cyan-800',
  };
  return colorMap[category] || 'bg-gray-100 text-gray-800';
};

const getAuthorRole = (author: string): string => {
  // Simple mapping based on author name patterns or default roles
  const roleMap: { [key: string]: string } = {
    'Dr.': 'Education Consultant',
    'Prof.': 'Academic Advisor',
    'Ahmed': 'Immigration Lawyer',
    'Maria': 'Financial Aid Advisor',
    'James': 'Student Life Coordinator',
  };
  
  for (const [key, role] of Object.entries(roleMap)) {
    if (author.includes(key)) {
      return role;
    }
  }
  return 'Education Consultant';
};

const generateRandomViews = (): string => {
  const views = Math.floor(Math.random() * 20000) + 1000;
  return views > 1000 ? `${(views / 1000).toFixed(1)}K` : views.toString();
};

const generateRandomLikes = (): string => {
  const likes = Math.floor(Math.random() * 2000) + 100;
  return likes > 1000 ? `${(likes / 1000).toFixed(1)}K` : likes.toString();
};



export const useBlogs = (limit: number = 4) => {
  const [blogs, setBlogs] = useState<BlogWithExtras[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/blogs');
        
        if (!response.ok) {
          throw new Error('Failed to fetch blogs');
        }
        
        const data = await response.json();
        
        if (data.success && data.blogs) {
          const blogsWithExtras: BlogWithExtras[] = data.blogs
            .slice(0, limit)
            .map((blog: Blog) => ({
              ...blog,
              categoryColor: getCategoryColor(blog.category),
              authorRole: getAuthorRole(blog.author),
              views: generateRandomViews(),
              likes: generateRandomLikes(),
            }));
          
          setBlogs(blogsWithExtras);
        } else {
          setBlogs([]);
        }
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch blogs');
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [limit]);

  return { blogs, loading, error };
};