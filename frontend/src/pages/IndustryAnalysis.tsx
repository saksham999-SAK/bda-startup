import { useState } from 'react';
import type { DashboardData } from '../types/dashboard';
import { formatCount, formatPct } from '../utils/format';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';

interface IndustryAnalysisProps { data: DashboardData; }

interface TooltipProps {
  active?: boolean;
  payload?: { value: number; name: string; color: string }[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <p className="label">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color, margin: '2px 0 0', fontSize: 13 }}>
          {p.name}: <strong>{p.name.includes('%') ? formatPct(p.value) : formatCount(p.value)}</strong>
        </p>
      ))}
    </div>
  );
}

export default function IndustryAnalysis({ data }: IndustryAnalysisProps) {
  const [view, setView] = useState<'volume' | 'rate'>('rate');
  const industries = data.industry_success_rates.slice(0, 15);

  const chartData = [...industries]
    .sort((a, b) => view === 'rate' ? b.success_rate_pct - a.success_rate_pct : b.startups - a.startups)
    .slice(0, 12)
    .map(ind => ({
      name: ind.industry.length > 14 ? ind.industry.slice(0, 14) + '…' : ind.industry,
      fullName: ind.industry,
      'Startups': ind.startups,
      'Success Rate (%)': ind.success_rate_pct,
    }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Filter */}
      <div className="card-sm animate-fade-in-up" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 13, color: '#6B7280', fontWeight: 500 }}>View:</span>
        {[
          { key: 'rate' as const, label: 'By Success Rate' },
          { key: 'volume' as const, label: 'By Volume' },
        ].map(opt => (
          <button
            key={opt.key}
            onClick={() => setView(opt.key)}
            style={{
              padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 500,
              border: '1px solid',
              borderColor: view === opt.key ? '#111111' : '#E5E7EB',
              background: view === opt.key ? '#111111' : '#FFFFFF',
              color: view === opt.key ? '#FFFFFF' : '#6B7280',
              cursor: 'pointer', transition: 'all 0.15s',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="card animate-fade-in-up stagger-2">
        <p className="section-title">
          {view === 'rate' ? 'Success Rate by Industry' : 'Startups by Industry'}
        </p>
        <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 20 }}>
          {view === 'rate' ? 'Percentage of acquired or IPO outcomes' : 'Total startups per industry vertical'}
        </p>
        <div style={{ height: 340 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 0, right: 40, bottom: 0, left: 8 }}
            >
              <CartesianGrid strokeDasharray="0" stroke="#F3F4F6" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fill: '#9CA3AF', fontSize: 11 }}
                axisLine={false} tickLine={false}
                tickFormatter={view === 'rate'
                  ? (v) => `${v}%`
                  : (v) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v
                }
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: '#374151', fontSize: 11 }}
                axisLine={false} tickLine={false}
                width={110}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
              <Bar
                dataKey={view === 'rate' ? 'Success Rate (%)' : 'Startups'}
                fill="#111111"
                radius={[0, 4, 4, 0]}
                maxBarSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div className="card animate-fade-in-up stagger-3">
        <p className="section-title" style={{ marginBottom: 16 }}>Industry Details</p>
        <table className="table-base">
          <thead>
            <tr>
              <th>#</th>
              <th>Industry</th>
              <th>Total Startups</th>
              <th>Successful</th>
              <th>Success Rate</th>
            </tr>
          </thead>
          <tbody>
            {industries.map((ind, i) => (
              <tr key={ind.industry}>
                <td style={{ color: '#9CA3AF', fontSize: 12 }}>{i + 1}</td>
                <td style={{ fontWeight: 600, color: '#111111' }}>{ind.industry}</td>
                <td>{formatCount(ind.startups)}</td>
                <td>{formatCount(ind.successful)}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 80, height: 4, background: '#F3F4F6', borderRadius: 999 }}>
                      <div style={{
                        height: '100%', borderRadius: 999, background: '#111111',
                        width: `${Math.min(ind.success_rate_pct * 3.5, 100)}%`,
                      }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#111111' }}>
                      {formatPct(ind.success_rate_pct)}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
