'use client';

import { useState, useEffect } from 'react';
import { IPartner } from '../lib/models/Partner';

export interface PartnerWithExtras extends Omit<IPartner, '_id'> {
  _id?: string;
}

export function usePartners() {
  const [partners, setPartners] = useState<PartnerWithExtras[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/partners');
        
        if (!response.ok) {
          throw new Error('Failed to fetch partners');
        }
        
        const data = await response.json();
        setPartners(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  return { partners, loading, error };
}