import { useState, useEffect } from 'react';
import type { DashboardData } from '../types/dashboard';

interface UseDashboardDataReturn {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useDashboardData(): UseDashboardDataReturn {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchCount, setFetchCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/dashboard_data.json');
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const json = await response.json();

        // Validate that the expected top-level keys exist
        const requiredKeys: (keyof DashboardData)[] = [
          'overall_summary',
          'status_distribution',
          'top_countries',
          'industry_success_rates',
          'funding_rounds_vs_success',
          'funding_buckets_vs_success',
          'yearly_trends',
          'average_funding_by_status',
          'time_to_first_funding',
        ];

        const missingKeys = requiredKeys.filter((k) => !(k in json));
        if (missingKeys.length > 0) {
          throw new Error(`Malformed data: missing keys: ${missingKeys.join(', ')}`);
        }

        if (!cancelled) {
          setData(json as DashboardData);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unknown error loading dashboard data');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [fetchCount]);

  const refetch = () => setFetchCount((c) => c + 1);

  return { data, loading, error, refetch };
}
