import { useState } from 'react';
import type { DashboardData } from '../types/dashboard';
import { formatCount, formatPct } from '../utils/format';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line,
} from 'recharts';

interface YearlyTrendsProps { data: DashboardData; }

interface TooltipProps {
  active?: boolean;
  payload?: { value: number; name: string; color: string }[];
  label?: string | number;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <p className="label">Year {label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color, margin: '2px 0 0', fontSize: 13 }}>
          {p.name}: <strong>{p.name.includes('%') ? formatPct(p.value) : formatCount(p.value)}</strong>
        </p>
      ))}
    </div>
  );
}

export default function YearlyTrends({ data }: YearlyTrendsProps) {
  const allYears = data.yearly_trends;
  const minYear = Math.min(...allYears.map(y => y.year));
  const maxYear = Math.max(...allYears.map(y => y.year));
  const [yearRange, setYearRange] = useState<[number, number]>([minYear, maxYear]);

  const filtered = allYears.filter(y => y.year >= yearRange[0] && y.year <= yearRange[1]);

  const chartData = filtered.map(y => ({
    year: y.year,
    'Founded': y.startups,
    'Successful': y.successful,
    'Success Rate (%)': y.success_rate_pct,
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Filter */}
      <div className="card-sm animate-fade-in-up" style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 13, color: '#6B7280', fontWeight: 500 }}>Year range:</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{ fontSize: 11, color: '#9CA3AF' }}>From</label>
          <select
            value={yearRange[0]}
            onChange={e => setYearRange([+e.target.value, yearRange[1]])}
            className="input-base"
            style={{ padding: '4px 8px', fontSize: 12, minWidth: 80 }}
          >
            {allYears.map(y => (
              <option key={y.year} value={y.year} disabled={y.year > yearRange[1]}>{y.year}</option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{ fontSize: 11, color: '#9CA3AF' }}>To</label>
          <select
            value={yearRange[1]}
            onChange={e => setYearRange([yearRange[0], +e.target.value])}
            className="input-base"
            style={{ padding: '4px 8px', fontSize: 12, minWidth: 80 }}
          >
            {allYears.map(y => (
              <option key={y.year} value={y.year} disabled={y.year < yearRange[0]}>{y.year}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setYearRange([minYear, maxYear])}
          style={{
            fontSize: 12, color: '#111111', fontWeight: 500,
            background: 'none', border: 'none', cursor: 'pointer',
            textDecoration: 'underline', fontFamily: 'Inter, sans-serif',
          }}
        >
          Reset
        </button>
        <span style={{ marginLeft: 'auto', fontSize: 12, color: '#9CA3AF' }}>
          {filtered.length} years selected
        </span>
      </div>

      {/* Volume chart */}
      <div className="card animate-fade-in-up stagger-2">
        <p className="section-title">Startups Founded per Year</p>
        <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 20 }}>
          Rapid growth in founding through the 2010s
        </p>
        <div style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }} barGap={2}>
              <CartesianGrid strokeDasharray="0" stroke="#F3F4F6" vertical={false} />
              <XAxis
                dataKey="year"
                tick={{ fill: '#9CA3AF', fontSize: 11 }}
                axisLine={false} tickLine={false}
                tickFormatter={(v) => `'${String(v).slice(2)}`}
              />
              <YAxis
                tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v}
                tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
              <Bar dataKey="Founded" fill="#111111" radius={[3, 3, 0, 0]} maxBarSize={20} />
              <Bar dataKey="Successful" fill="#E5E7EB" radius={[3, 3, 0, 0]} maxBarSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Success rate line */}
      <div className="card animate-fade-in-up stagger-3">
        <p className="section-title">Success Rate Over Time</p>
        <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 20 }}>
          Older cohorts show higher rates — more time to exit or acquire
        </p>
        <div style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="0" stroke="#F3F4F6" vertical={false} />
              <XAxis
                dataKey="year"
                tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `'${String(v).slice(2)}`}
              />
              <YAxis
                tickFormatter={(v) => `${v}%`}
                tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false}
                domain={[0, 40]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="Success Rate (%)"
                stroke="#111111"
                strokeWidth={2.5}
                dot={filtered.length <= 20 ? { fill: '#111111', strokeWidth: 0, r: 3 } : false}
                activeDot={{ r: 5, fill: '#111111' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid #F3F4F6' }}>
          <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0, lineHeight: 1.6 }}>
            <strong style={{ color: '#374151' }}>Note:</strong> Recent cohorts appear less successful because they've had less time
            to achieve acquisition or IPO. The 2015 dataset cutoff creates a recency bias.
          </p>
        </div>
      </div>
    </div>
  );
}
