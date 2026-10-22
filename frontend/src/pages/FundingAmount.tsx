import type { DashboardData } from '../types/dashboard';
import { formatCount, formatPct } from '../utils/format';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line,
} from 'recharts';

interface FundingAmountProps { data: DashboardData; }

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

export default function FundingAmount({ data }: FundingAmountProps) {
  const items = data.funding_buckets_vs_success;

  const barData = items.map(i => ({
    name: i.bucket,
    'Startups': i.startups,
    'Successful': i.successful,
  }));

  const lineData = items.map(i => ({
    name: i.bucket,
    'Success Rate (%)': i.success_rate_pct,
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Volume */}
        <div className="card animate-fade-in-up">
          <p className="section-title">Startups by Funding Bucket</p>
          <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 20 }}>
            Distribution of startups across funding ranges
          </p>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 4, right: 8, bottom: 30, left: 0 }} barGap={3}>
                <CartesianGrid strokeDasharray="0" stroke="#F3F4F6" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#9CA3AF', fontSize: 10 }}
                  axisLine={false} tickLine={false}
                  angle={-30} textAnchor="end" interval={0}
                />
                <YAxis
                  tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v}
                  tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                <Bar dataKey="Startups" fill="#111111" radius={[4, 4, 0, 0]} maxBarSize={28} />
                <Bar dataKey="Successful" fill="#E5E7EB" radius={[4, 4, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Success Rate */}
        <div className="card animate-fade-in-up stagger-2">
          <p className="section-title">Success Rate by Funding Level</p>
          <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 20 }}>
            More capital generally correlates with higher success
          </p>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 4, right: 16, bottom: 30, left: 0 }}>
                <CartesianGrid strokeDasharray="0" stroke="#F3F4F6" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#9CA3AF', fontSize: 10 }}
                  axisLine={false} tickLine={false}
                  angle={-30} textAnchor="end" interval={0}
                />
                <YAxis
                  tickFormatter={(v) => `${v}%`}
                  tick={{ fill: '#9CA3AF', fontSize: 11 }}
                  axisLine={false} tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="Success Rate (%)"
                  stroke="#111111"
                  strokeWidth={2.5}
                  dot={{ fill: '#111111', strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card animate-fade-in-up stagger-3">
        <p className="section-title" style={{ marginBottom: 16 }}>Funding Bucket Details</p>
        <table className="table-base">
          <thead>
            <tr>
              <th>Funding Range</th>
              <th>Total Startups</th>
              <th>Successful</th>
              <th>Success Rate</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.bucket}>
                <td style={{ fontWeight: 600, color: '#111111' }}>{item.bucket}</td>
                <td>{formatCount(item.startups)}</td>
                <td>{formatCount(item.successful)}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 100, height: 4, background: '#F3F4F6', borderRadius: 999 }}>
                      <div style={{
                        height: '100%', borderRadius: 999, background: '#111111',
                        width: `${Math.min(item.success_rate_pct * 2.5, 100)}%`,
                      }} />
                    </div>
                    <span style={{
                      fontSize: 12, fontWeight: 600,
                      color: item.success_rate_pct >= 30 ? '#16A34A' : '#111111',
                    }}>
                      {formatPct(item.success_rate_pct)}
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
