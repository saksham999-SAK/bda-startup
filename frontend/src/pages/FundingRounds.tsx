import type { DashboardData } from '../types/dashboard';
import { formatCount, formatPct } from '../utils/format';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line,
} from 'recharts';

interface FundingRoundsProps { data: DashboardData; }

interface TooltipProps {
  active?: boolean;
  payload?: { value: number; name: string; color: string }[];
  label?: string | number;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <p className="label">{label} rounds</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color, margin: '2px 0 0', fontSize: 13 }}>
          {p.name}: <strong>{p.name.includes('%') ? formatPct(p.value) : formatCount(p.value)}</strong>
        </p>
      ))}
    </div>
  );
}

export default function FundingRounds({ data }: FundingRoundsProps) {
  const items = data.funding_rounds_vs_success;

  const barData = items.map(i => ({
    rounds: i.rounds,
    'Startups': i.startups,
    'Successful': i.successful,
  }));

  const lineData = items.map(i => ({
    rounds: i.rounds,
    'Success Rate (%)': i.success_rate_pct,
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Volume chart */}
        <div className="card animate-fade-in-up">
          <p className="section-title">Volume by Funding Rounds</p>
          <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 20 }}>
            Startups grouped by number of funding rounds
          </p>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }} barGap={3}>
                <CartesianGrid strokeDasharray="0" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="rounds" tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
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

        {/* Success rate line */}
        <div className="card animate-fade-in-up stagger-2">
          <p className="section-title">Success Rate by Round Count</p>
          <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 20 }}>
            Higher rounds generally correlate with better outcomes
          </p>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="0" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="rounds" tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
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
                  activeDot={{ r: 6, fill: '#111111' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card animate-fade-in-up stagger-3">
        <p className="section-title" style={{ marginBottom: 16 }}>Round-by-Round Breakdown</p>
        <table className="table-base">
          <thead>
            <tr>
              <th>Rounds</th>
              <th>Total Startups</th>
              <th>Successful</th>
              <th>Success Rate</th>
              <th>Share of Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.rounds}>
                <td style={{ fontWeight: 700, color: '#111111', fontSize: 15 }}>{item.rounds}</td>
                <td>{formatCount(item.startups)}</td>
                <td>{formatCount(item.successful)}</td>
                <td>
                  <span style={{
                    padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600,
                    background: item.success_rate_pct >= 30 ? '#DCFCE7' : item.success_rate_pct >= 15 ? '#FEF3C7' : '#F3F4F6',
                    color: item.success_rate_pct >= 30 ? '#16A34A' : item.success_rate_pct >= 15 ? '#D97706' : '#6B7280',
                  }}>
                    {formatPct(item.success_rate_pct)}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 100, height: 4, background: '#F3F4F6', borderRadius: 999 }}>
                      <div style={{
                        height: '100%', borderRadius: 999, background: '#111111',
                        width: `${(item.startups / Math.max(...items.map(i => i.startups))) * 100}%`,
                      }} />
                    </div>
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
