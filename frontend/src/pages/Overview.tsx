import { useState } from 'react';
import type { DashboardData } from '../types/dashboard';
import KPICard from '../components/KPICard';
import {
  Building2, DollarSign, TrendingUp, Users,
  BarChart2, Activity, XCircle, ArrowUpRight, FileDown, Loader,
} from 'lucide-react';
import { formatUSD, formatPct, formatCount, formatDecimal } from '../utils/format';
import { generateReport } from '../utils/generateReport';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, LineChart, Line,
} from 'recharts';

interface OverviewProps {
  data: DashboardData;
}

interface TooltipProps {
  active?: boolean;
  payload?: { value: number; name: string; color: string }[];
  label?: string | number;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <p className="label">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color, margin: '3px 0 0', fontSize: 13 }}>
          {p.name}: <strong>{formatCount(p.value)}</strong>
        </p>
      ))}
    </div>
  );
}

export default function Overview({ data }: OverviewProps) {
  const s = data.overall_summary;
  const [generating, setGenerating] = useState(false);

  const handleGenerateReport = async () => {
    setGenerating(true);
    // small delay so the spinner renders before PDF blocks the thread
    await new Promise(r => setTimeout(r, 80));
    try {
      generateReport(data);
    } finally {
      setGenerating(false);
    }
  };

  // Build yearly chart data (last 15 years)
  const chartData = data.yearly_trends
    .filter(y => y.year >= 2000)
    .map(y => ({
      year: `'${String(y.year).slice(2)}`,
      'Founded': y.startups,
      'Successful': y.successful,
    }));

  // Top industries for the right panel
  const topIndustries = data.industry_success_rates.slice(0, 5);

  // Top countries for table
  const topCountries = data.top_countries.slice(0, 7);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Quick Stats Section */}
      <div className="card" style={{ padding: '22px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 32 }}>
          {/* Label + Generate Report button */}
          <div style={{ flexShrink: 0, minWidth: 140 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111111', margin: '0 0 6px' }}>
              Quick Stats
            </h2>
            <p style={{ fontSize: 12, color: '#9CA3AF', margin: '0 0 14px', lineHeight: 1.5 }}>
              Your statistics for the full dataset period.
            </p>
            <button
              onClick={handleGenerateReport}
              disabled={generating}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 22px',
                borderRadius: 10,
                border: 'none',
                background: generating ? '#B8960C' : 'linear-gradient(135deg, #F5C518 0%, #D4A017 100%)',
                color: '#1a1a1a',
                fontSize: 15,
                fontWeight: 700,
                cursor: generating ? 'not-allowed' : 'pointer',
                transition: 'filter 0.2s, transform 0.15s',
                boxShadow: '0 3px 12px rgba(212,160,23,0.45)',
                letterSpacing: '0.01em',
              }}
              onMouseEnter={e => { if (!generating) { (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1.1)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; } }}
              onMouseLeave={e => { if (!generating) { (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; } }}
            >
              {generating
                ? <><Loader size={13} style={{ animation: 'spin 1s linear infinite' }} /> Generating…</>
                : <><FileDown size={13} /> Generate Report</>
              }
            </button>
          </div>

          {/* Stat cards row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: 12, flex: 1,
          }}>
            <KPICard
              title="Total Startups"
              value={formatCount(s.total_startups)}
              icon={<Building2 size={16} />}
              delay={0.05}
            />
<KPICard
              title="Success Rate"
              value={formatPct(s.overall_success_rate_pct)}
              icon={<Activity size={16} />}
              featured={true}
              delay={0.15}
            />
            <KPICard
              title="Total Funding"
              value={formatUSD(s.total_funding_usd, true)}
              icon={<DollarSign size={16} />}
              delay={0.20}
            />
            <KPICard
              title="Avg Funding"
              value={formatUSD(s.avg_funding_usd, true)}
              icon={<TrendingUp size={16} />}
              delay={0.25}
            />
            <KPICard
              title="Closure Rate"
              value={formatPct(s.closed_rate_pct)}
              icon={<XCircle size={16} />}
              delay={0.30}
            />
          </div>
        </div>
      </div>

      {/* Middle row: Chart + Top Industries */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>

        {/* Bar Chart */}
        <div className="card animate-fade-in-up stagger-4">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <p className="section-title">Founding Statistics</p>
              <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>
                Startups founded vs successful exits · 2000–2015
              </p>
            </div>
            <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#6B7280' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#111111', display: 'inline-block' }} />
                Founded
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#D1D5DB', display: 'inline-block' }} />
                Successful
              </span>
            </div>
          </div>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }} barGap={3}>
                <CartesianGrid strokeDasharray="0" stroke="#F3F4F6" vertical={false} />
                <XAxis
                  dataKey="year"
                  tick={{ fill: '#9CA3AF', fontSize: 11 }}
                  axisLine={false} tickLine={false}
                />
                <YAxis
                  tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v}
                  tick={{ fill: '#9CA3AF', fontSize: 11 }}
                  axisLine={false} tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                <Bar dataKey="Founded" fill="#111111" radius={[4, 4, 0, 0]} maxBarSize={18} />
                <Bar dataKey="Successful" fill="#E5E7EB" radius={[4, 4, 0, 0]} maxBarSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Industries Panel */}
        <div className="card animate-fade-in-up stagger-5">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <p className="section-title" style={{ marginBottom: 0 }}>Top Industries</p>
            <button style={{
              width: 28, height: 28, borderRadius: '50%',
              background: '#F3F4F6', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#6B7280',
            }}>
              <ArrowUpRight size={13} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {topIndustries.map((ind, i) => (
              <div key={ind.industry} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {/* Rank circle */}
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: i === 0 ? '#111111' : '#F3F4F6',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <BarChart2 size={14} color={i === 0 ? '#FFFFFF' : '#6B7280'} />
                </div>

                {/* Name + bar */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{
                      fontSize: 12, fontWeight: 600, color: '#111111',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 130,
                    }}>
                      {ind.industry}
                    </span>
                    <span style={{ fontSize: 11, color: '#6B7280', fontWeight: 500, flexShrink: 0, marginLeft: 6 }}>
                      {formatPct(ind.success_rate_pct)}
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div style={{ height: 4, background: '#F3F4F6', borderRadius: 999 }}>
                    <div style={{
                      height: '100%', borderRadius: 999,
                      background: i === 0 ? '#111111' : '#D1D5DB',
                      width: `${Math.min(ind.success_rate_pct * 3, 100)}%`,
                      transition: 'width 0.6s ease',
                    }} />
                  </div>
                </div>

                {/* Badge */}
                <span style={{
                  fontSize: 10, padding: '3px 8px', borderRadius: 999, flexShrink: 0,
                  background: '#F3F4F6', color: '#6B7280', fontWeight: 500,
                }}>
                  {formatCount(ind.startups)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Manage Startups Table */}
      <div className="card animate-fade-in-up stagger-6">
        {/* Table header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <p className="section-title" style={{ marginBottom: 2 }}>Top Countries</p>
            <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>
              Startup concentration and success rates by country
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-outline">
              Status <span style={{ marginLeft: 2, fontSize: 10 }}>▾</span>
            </button>
            <button className="btn-primary">
              Export ↑
            </button>
          </div>
        </div>

        <table className="table-base">
          <thead>
            <tr>
              <th style={{ paddingLeft: 16 }}>#</th>
              <th>Country</th>
              <th>Total Startups</th>
              <th>Successful Exits</th>
              <th>Success Rate</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {topCountries.map((c, i) => {
              const rate = c.success_rate_pct;
              const status = rate >= 20 ? 'High' : rate >= 12 ? 'Medium' : 'Low';
              const badgeClass = rate >= 20 ? 'badge-success' : rate >= 12 ? 'badge-pending' : 'badge-closed';
              return (
                <tr key={c.country}>
                  <td style={{ paddingLeft: 16, color: '#9CA3AF', fontSize: 12 }}>{i + 1}</td>
                  <td>
                    <span style={{ fontWeight: 600, color: '#111111', fontSize: 13 }}>{c.country}</span>
                  </td>
                  <td style={{ fontWeight: 500 }}>{formatCount(c.startups)}</td>
                  <td style={{ color: '#374151' }}>{formatCount(c.successful)}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 60, height: 4, background: '#F3F4F6', borderRadius: 999 }}>
                        <div style={{
                          height: '100%', borderRadius: 999,
                          background: rate >= 20 ? '#111111' : '#D1D5DB',
                          width: `${Math.min(rate * 3, 100)}%`,
                        }} />
                      </div>
                      <span style={{ fontSize: 12, color: '#374151', fontWeight: 500 }}>
                        {formatPct(rate)}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${badgeClass}`}>{status}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Dataset note */}
        <div style={{
          marginTop: 20, paddingTop: 16, borderTop: '1px solid #F3F4F6',
          display: 'flex', alignItems: 'flex-start', gap: 10,
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#111111', marginTop: 5, flexShrink: 0,
          }} />
          <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0, lineHeight: 1.6 }}>
            <strong style={{ color: '#374151' }}>Note:</strong>{' '}
            Success = acquired or IPO. Avg funding includes $0 for startups with no disclosed funding.
            Total funding: <strong style={{ color: '#374151' }}>{formatUSD(s.total_funding_usd, true)}</strong>.
            Avg rounds: <strong style={{ color: '#374151' }}>{formatDecimal(s.avg_funding_rounds, 2)}</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
