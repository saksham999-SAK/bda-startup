import { useState } from 'react';
import type { DashboardData } from '../types/dashboard';
import { formatCount, formatPct } from '../utils/format';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

interface CountryAnalysisProps { data: DashboardData; }

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
          {p.name}: <strong>{p.name === 'Success Rate (%)' ? formatPct(p.value) : formatCount(p.value)}</strong>
        </p>
      ))}
    </div>
  );
}

export default function CountryAnalysis({ data }: CountryAnalysisProps) {
  const [sortBy, setSortBy] = useState<'startups' | 'success_rate_pct'>('startups');
  const countries = [...data.top_countries].sort((a, b) => b[sortBy] - a[sortBy]).slice(0, 12);

  const chartData = countries.map(c => ({
    name: c.country.length > 10 ? c.country.slice(0, 10) + '…' : c.country,
    fullName: c.country,
    'Startups': c.startups,
    'Successful': c.successful,
    'Success Rate (%)': c.success_rate_pct,
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Filter bar */}
      <div className="card-sm animate-fade-in-up" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 13, color: '#6B7280', fontWeight: 500 }}>Sort by:</span>
        {[
          { key: 'startups' as const, label: 'Total Startups' },
          { key: 'success_rate_pct' as const, label: 'Success Rate' },
        ].map(opt => (
          <button
            key={opt.key}
            onClick={() => setSortBy(opt.key)}
            style={{
              padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 500,
              border: '1px solid',
              borderColor: sortBy === opt.key ? '#111111' : '#E5E7EB',
              background: sortBy === opt.key ? '#111111' : '#FFFFFF',
              color: sortBy === opt.key ? '#FFFFFF' : '#6B7280',
              cursor: 'pointer', transition: 'all 0.15s',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {opt.label}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 12, color: '#9CA3AF' }}>
          Showing top {countries.length} countries
        </span>
      </div>

      {/* Bar chart */}
      <div className="card animate-fade-in-up stagger-2">
        <p className="section-title">Startups by Country</p>
        <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 20 }}>
          Founded vs successful exits per country
        </p>
        <div style={{ height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }} barGap={3}>
              <CartesianGrid strokeDasharray="0" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis
                tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v}
                tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
              <Bar dataKey="Startups" fill="#111111" radius={[4, 4, 0, 0]} maxBarSize={22} />
              <Bar dataKey="Successful" fill="#E5E7EB" radius={[4, 4, 0, 0]} maxBarSize={22} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div className="card animate-fade-in-up stagger-3">
        <p className="section-title" style={{ marginBottom: 16 }}>Country Rankings</p>
        <table className="table-base">
          <thead>
            <tr>
              <th>#</th>
              <th>Country</th>
              <th>Total Startups</th>
              <th>Successful</th>
              <th>Success Rate</th>
            </tr>
          </thead>
          <tbody>
            {countries.map((c, i) => (
              <tr key={c.country}>
                <td style={{ color: '#9CA3AF', fontSize: 12 }}>{i + 1}</td>
                <td style={{ fontWeight: 600, color: '#111111' }}>{c.country}</td>
                <td>{formatCount(c.startups)}</td>
                <td>{formatCount(c.successful)}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 80, height: 4, background: '#F3F4F6', borderRadius: 999 }}>
                      <div style={{
                        height: '100%', borderRadius: 999, background: '#111111',
                        width: `${Math.min(c.success_rate_pct * 3.5, 100)}%`,
                      }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#111111' }}>{formatPct(c.success_rate_pct)}</span>
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
