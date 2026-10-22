// Formatting utilities for consistent display across the dashboard

/** Format a number as USD with appropriate suffix (B/M/K) */
export function formatUSD(value: number | undefined | null, compact = false): string {
  if (value === undefined || value === null || isNaN(value)) return 'N/A';
  if (compact) {
    if (Math.abs(value) >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (Math.abs(value) >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (Math.abs(value) >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
    return `$${value.toFixed(2)}`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

/** Format a percentage with fixed decimals */
export function formatPct(value: number | undefined | null, decimals = 1): string {
  if (value === undefined || value === null || isNaN(value)) return 'N/A';
  return `${value.toFixed(decimals)}%`;
}

/** Format a large integer with comma separators */
export function formatCount(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) return 'N/A';
  return new Intl.NumberFormat('en-US').format(Math.round(value));
}

/** Format a decimal number to N decimals */
export function formatDecimal(value: number | undefined | null, decimals = 2): string {
  if (value === undefined || value === null || isNaN(value)) return 'N/A';
  return value.toFixed(decimals);
}

/** Format years to one decimal */
export function formatYears(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) return 'N/A';
  return `${value.toFixed(1)} yrs`;
}

/** Title-case a status string */
export function titleCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

/** Return a Tailwind color class for a startup status */
export function statusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'operating': return 'text-emerald-400';
    case 'acquired': return 'text-blue-400';
    case 'ipo': return 'text-purple-400';
    case 'closed': return 'text-red-400';
    default: return 'text-slate-400';
  }
}

/** Return a badge class for a startup status */
export function statusBadgeClass(status: string): string {
  switch (status.toLowerCase()) {
    case 'operating': return 'badge-emerald';
    case 'acquired': return 'badge-blue';
    case 'ipo': return 'badge-purple';
    case 'closed': return 'badge-red';
    default: return 'badge bg-slate-700 text-slate-300';
  }
}

/** Recharts chart color by status */
export const STATUS_COLORS: Record<string, string> = {
  operating: '#10b981',
  acquired: '#3b82f6',
  ipo: '#a855f7',
  closed: '#ef4444',
};

/** Chart accent palette */
export const CHART_COLORS = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#a855f7', // purple
  '#f59e0b', // amber
  '#ef4444', // red
  '#06b6d4', // cyan
  '#f97316', // orange
  '#84cc16', // lime
  '#ec4899', // pink
  '#14b8a6', // teal
];
