import type { DashboardData } from '../types/dashboard';
import { formatCount, formatDecimal } from '../utils/format';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

interface TimeToFundingProps { data: DashboardData; }

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
      <p className="value">{formatDecimal(payload[0]?.value ?? 0, 2)} years</p>
      {payload[1] && (
        <p style={{ margin: '2px 0 0', fontSize: 12, color: '#6B7280' }}>
          {formatCount(payload[1]?.value)} startups
        </p>
      )}
    </div>
  );
}

export default function TimeToFunding({ data }: TimeToFundingProps) {
  const items = data.time_to_first_funding;

  const chartData = items.map(i => ({
    name: i.status.charAt(0).toUpperCase() + i.status.slice(1),
    'Avg Years to Funding': i.avg_years,
    'Count': i.count,
    color: STATUS_COLORS[i.status.toLowerCase()] ?? '#E5E7EB',
  }));

  const maxYears = Math.max(...items.map(i => i.avg_years));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Chart */}
      <div className="card animate-fade-in-up">
        <p className="section-title">Time to First Funding by Status</p>
        <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 20 }}>
          Average years from founding to first funding round
        </p>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="0" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis
                tickFormatter={(v) => `${v}y`}
                tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
              <Bar dataKey="Avg Years to Funding" radius={[6, 6, 0, 0]} maxBarSize={72}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detail cards */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${items.length}, 1fr)`, gap: 16 }}>
        {items.map((item, i) => {
          const pct = (item.avg_years / maxYears) * 100;
          return (
            <div
              key={item.status}
              className={`animate-fade-in-up stagger-${i + 2}`}
              style={{
                background: i === 0 ? '#111111' : '#FFFFFF',
                borderRadius: 16, padding: '20px',
                border: '1px solid #F3F4F6',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              }}
            >
              <p style={{
                fontSize: 11, fontWeight: 500, textTransform: 'capitalize',
                color: i === 0 ? 'rgba(255,255,255,0.6)' : '#9CA3AF',
                margin: '0 0 8px',
              }}>
                {item.status}
              </p>
              <p style={{
                fontSize: 28, fontWeight: 800, margin: '0 0 2px',
                color: i === 0 ? '#FFFFFF' : '#111111',
              }}>
                {formatDecimal(item.avg_years, 1)}
                <span style={{ fontSize: 14, fontWeight: 400, marginLeft: 2, opacity: 0.6 }}>yrs</span>
              </p>
              <p style={{
                fontSize: 11, color: i === 0 ? 'rgba(255,255,255,0.5)' : '#9CA3AF', margin: '0 0 14px',
              }}>
                {formatCount(item.count)} startups
              </p>
              <div style={{ height: 4, background: i === 0 ? 'rgba(255,255,255,0.2)' : '#F3F4F6', borderRadius: 999 }}>
                <div style={{
                  height: '100%', borderRadius: 999,
                  background: i === 0 ? 'rgba(255,255,255,0.8)' : '#111111',
                  width: `${pct}%`,
                  transition: 'width 0.6s ease',
                }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Note */}
      <div className="card-sm animate-fade-in-up">
        <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0, lineHeight: 1.7 }}>
          <strong style={{ color: '#374151' }}>Note:</strong> This metric only includes startups with at least one
          disclosed funding event. Startups with no funding data are excluded from this analysis.
          "Time to funding" is measured from the founded year to the first recorded investment round.
        </p>
      </div>
    </div>
  );
}
