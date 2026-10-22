// TypeScript interfaces matching the exact schema in dashboard_data.json

export interface OverallSummary {
  total_startups: number;
  disclosed_funding_startups: number;
  total_funding_usd: number;
  avg_funding_usd: number;
  avg_funding_rounds: number;
  overall_success_rate_pct: number;
  closed_rate_pct: number;
}

export interface StatusDistributionItem {
  status: string;
  count: number;
  percentage: number;
}

export interface CountryItem {
  country: string;
  startups: number;
  successful: number;
  success_rate_pct: number;
}

export interface IndustryItem {
  industry: string;
  startups: number;
  successful: number;
  success_rate_pct: number;
}

export interface FundingRoundsItem {
  rounds: string;
  startups: number;
  successful: number;
  success_rate_pct: number;
}

export interface FundingBucketItem {
  bucket: string;
  startups: number;
  successful: number;
  success_rate_pct: number;
}

export interface YearlyTrendItem {
  year: number;
  startups: number;
  successful: number;
  success_rate_pct: number;
}

export interface AvgFundingByStatusItem {
  status: string;
  avg_funding_usd: number;
}

export interface TimeToFundingItem {
  status: string;
  avg_years: number;
  count: number;
}

export interface DashboardData {
  overall_summary: OverallSummary;
  status_distribution: StatusDistributionItem[];
  top_countries: CountryItem[];
  industry_success_rates: IndustryItem[];
  funding_rounds_vs_success: FundingRoundsItem[];
  funding_buckets_vs_success: FundingBucketItem[];
  yearly_trends: YearlyTrendItem[];
  average_funding_by_status: AvgFundingByStatusItem[];
  time_to_first_funding: TimeToFundingItem[];
}

export type SortDirection = 'asc' | 'desc';

export type ActivePage =
  | 'overview'
  | 'status'
  | 'countries'
  | 'industries'
  | 'funding-rounds'
  | 'funding-amount'
  | 'yearly-trends'
  | 'funding-by-status'
  | 'time-to-funding';
