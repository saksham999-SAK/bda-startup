import type { DashboardData } from '../types/dashboard';
import { formatUSD } from '../utils/format';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

interface FundingByStatusProps { data: DashboardData; }

interface TooltipProps {
  active?: boolean;
  payload?: { value: number; name: string; color: string }[];
  label?: string;
}

const STATUS_COLORS: Record<string, string> = {
  'operating': '#111111',
  'acquired':  '#374151',
  'closed':    '#D1D5DB',
  'ipo':       '#6B7280',
};

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <p className="label">{label}</p>
      <p className="value">{formatUSD(payload[0]?.value ?? 0, true)}</p>
    </div>
  );
}

export default function FundingByStatus({ data }: FundingByStatusProps) {
  const items = data.average_funding_by_status;

  const chartData = items.map(i => ({
    name: i.status.charAt(0).toUpperCase() + i.status.slice(1),
    'Avg Funding': i.avg_funding_usd,
    color: STATUS_COLORS[i.status.toLowerCase()] ?? '#E5E7EB',
  }));

  const maxVal = Math.max(...items.map(i => i.avg_funding_usd));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Chart */}
      <div className="card animate-fade-in-up">
        <p className="section-title">Average Funding by Startup Status</p>
        <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 20 }}>
          Mean total funding raised (USD) across all startups in each category
        </p>
        <div style={{ height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: 20 }}>
              <CartesianGrid strokeDasharray="0" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis
                tickFormatter={(v) => `$${(v / 1_000_000).toFixed(0)}M`}
                tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
              <Bar dataKey="Avg Funding" radius={[6, 6, 0, 0]} maxBarSize={64}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cards row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {items.map((item, i) => {
          const pct = (item.avg_funding_usd / maxVal) * 100;
          const isTop = i === [...items].sort((a, b) => b.avg_funding_usd - a.avg_funding_usd)[0].avg_funding_usd === item.avg_funding_usd;
          return (
            <div
              key={item.status}
              className={`animate-fade-in-up stagger-${i + 2}`}
              style={{
                background: isTop ? '#111111' : '#FFFFFF',
                borderRadius: 16, padding: 20,
                border: '1px solid #F3F4F6',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              }}
            >
              <p style={{ fontSize: 11, color: isTop ? 'rgba(255,255,255,0.6)' : '#9CA3AF', fontWeight: 500, margin: '0 0 8px', textTransform: 'capitalize' }}>
                {item.status}
              </p>
              <p style={{ fontSize: 20, fontWeight: 700, color: isTop ? '#FFFFFF' : '#111111', margin: '0 0 12px' }}>
                {formatUSD(item.avg_funding_usd, true)}
              </p>
              <div style={{ height: 4, background: isTop ? 'rgba(255,255,255,0.2)' : '#F3F4F6', borderRadius: 999 }}>
                <div style={{
                  height: '100%', borderRadius: 999,
                  background: isTop ? 'rgba(255,255,255,0.8)' : '#111111',
                  width: `${pct}%`,
                  transition: 'width 0.6s ease',
                }} />
              </div>
              <p style={{ fontSize: 11, color: isTop ? 'rgba(255,255,255,0.5)' : '#9CA3AF', margin: '6px 0 0' }}>
                {pct.toFixed(0)}% of max
              </p>
            </div>
          );
        })}
      </div>

      {/* Note */}
      <div className="card-sm animate-fade-in-up stagger-5">
        <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0, lineHeight: 1.7 }}>
          <strong style={{ color: '#374151' }}>Interpretation:</strong> IPO and acquired startups tend to raise
          significantly more capital. Closed startups still raised meaningful funding on average — suggesting
          that raising capital alone doesn't guarantee success.
        </p>
      </div>
    </div>
  );
}
