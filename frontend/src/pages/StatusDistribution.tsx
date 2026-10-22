import type { DashboardData } from '../types/dashboard';
import { formatCount, formatPct } from '../utils/format';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';

interface StatusDistributionProps { data: DashboardData; }

interface TooltipProps {
  active?: boolean;
  payload?: { value: number; name: string; payload: { color: string } }[];
  label?: string;
}

const STATUS_COLORS: Record<string, string> = {
  'operating': '#111111',
  'acquired':  '#374151',
  'closed':    '#D1D5DB',
  'ipo':       '#6B7280',
};

const STATUS_BADGE: Record<string, string> = {
  'operating': 'badge-operating',
  'acquired':  'badge-acquired',
  'closed':    'badge-closed',
  'ipo':       'badge-ipo',
};

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <p className="label">{label || payload[0]?.name}</p>
      <p className="value">{formatCount(payload[0]?.value ?? 0)}</p>
    </div>
  );
}

export default function StatusDistribution({ data }: StatusDistributionProps) {
  const items = data.status_distribution;
  const total = items.reduce((s, i) => s + i.count, 0);

  const pieData = items.map(i => ({
    name: i.status.charAt(0).toUpperCase() + i.status.slice(1),
    value: i.count,
    color: STATUS_COLORS[i.status.toLowerCase()] ?? '#E5E7EB',
  }));

  const barData = items.map(i => ({
    name: i.status.charAt(0).toUpperCase() + i.status.slice(1),
    count: i.count,
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* Donut chart */}
        <div className="card animate-fade-in-up">
          <p className="section-title">Status Breakdown</p>
          <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 20 }}>
            Distribution of {formatCount(total)} startups by outcome
          </p>
          <div style={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={75}
                  outerRadius={115}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 8 }}>
            {pieData.map((d) => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#374151' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: d.color, display: 'inline-block', flexShrink: 0 }} />
                {d.name}
              </div>
            ))}
          </div>
        </div>

        {/* Bar chart */}
        <div className="card animate-fade-in-up stagger-2">
          <p className="section-title">Count by Status</p>
          <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 20 }}>
            Absolute number of startups per category
          </p>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="0" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis
                  tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v}
                  tick={{ fill: '#9CA3AF', fontSize: 11 }}
                  axisLine={false} tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={52}>
                  {barData.map((_, i) => (
                    <Cell key={i} fill={Object.values(STATUS_COLORS)[i] ?? '#E5E7EB'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card animate-fade-in-up stagger-3">
        <p className="section-title" style={{ marginBottom: 16 }}>Detailed Breakdown</p>
        <table className="table-base">
          <thead>
            <tr>
              <th>Status</th>
              <th>Count</th>
              <th>Percentage</th>
              <th>Share of Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const key = item.status.toLowerCase();
              const badgeClass = STATUS_BADGE[key] ?? 'badge-gray';
              return (
                <tr key={item.status}>
                  <td>
                    <span className={`badge ${badgeClass}`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, color: '#111111' }}>{formatCount(item.count)}</td>
                  <td style={{ fontWeight: 500 }}>{formatPct(item.percentage)}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 120, height: 4, background: '#F3F4F6', borderRadius: 999 }}>
                        <div style={{
                          height: '100%', borderRadius: 999,
                          background: STATUS_COLORS[key] ?? '#D1D5DB',
                          width: `${item.percentage}%`,
                        }} />
                      </div>
                      <span style={{ fontSize: 12, color: '#9CA3AF' }}>{formatPct(item.percentage)}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
