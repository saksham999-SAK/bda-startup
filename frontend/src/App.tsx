import { useState } from 'react';
import type { ActivePage } from './types/dashboard';
import { useDashboardData } from './hooks/useDashboardData';
import Sidebar from './components/Sidebar';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import Overview from './pages/Overview';
import StatusDistribution from './pages/StatusDistribution';
import CountryAnalysis from './pages/CountryAnalysis';
import IndustryAnalysis from './pages/IndustryAnalysis';
import FundingRounds from './pages/FundingRounds';
import FundingAmount from './pages/FundingAmount';
import YearlyTrends from './pages/YearlyTrends';
import FundingByStatus from './pages/FundingByStatus';
import TimeToFunding from './pages/TimeToFunding';
import { RefreshCw, Bell, Search, Menu } from 'lucide-react';

const PAGE_TITLES: Record<ActivePage, string> = {
  'overview':          'Dashboard',
  'status':            'Status Distribution',
  'countries':         'Country Analysis',
  'industries':        'Industry Analysis',
  'funding-rounds':    'Funding Rounds',
  'funding-amount':    'Funding Amount',
  'yearly-trends':     'Yearly Trends',
  'funding-by-status': 'Avg Funding by Status',
  'time-to-funding':   'Time to First Funding',
};

const PAGE_SUBTITLES: Record<ActivePage, string> = {
  'overview':          'Your statistics for the full 1990–2015 period.',
  'status':            'Breakdown of startup outcomes across the dataset.',
  'countries':         'Geographic distribution of startup success.',
  'industries':        'Success rates by vertical and sector.',
  'funding-rounds':    'How funding round count correlates with success.',
  'funding-amount':    'Impact of total capital raised on outcomes.',
  'yearly-trends':     'Founding volume and success rates over time.',
  'funding-by-status': 'Average capital raised per outcome category.',
  'time-to-funding':   'How quickly startups secured their first funding.',
};

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { data, loading, error, refetch } = useDashboardData();

  function renderPage() {
    if (!data) return null;
    switch (activePage) {
      case 'overview':          return <Overview data={data} />;
      case 'status':            return <StatusDistribution data={data} />;
      case 'countries':         return <CountryAnalysis data={data} />;
      case 'industries':        return <IndustryAnalysis data={data} />;
      case 'funding-rounds':    return <FundingRounds data={data} />;
      case 'funding-amount':    return <FundingAmount data={data} />;
      case 'yearly-trends':     return <YearlyTrends data={data} />;
      case 'funding-by-status': return <FundingByStatus data={data} />;
      case 'time-to-funding':   return <TimeToFunding data={data} />;
      default:                  return null;
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F0F2F5' }}>
      {/* Sidebar */}
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((v) => !v)}
      />

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>

        {/* Top header */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 10,
          background: 'rgba(240, 242, 245, 0.9)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #EBEBEB',
          padding: '0 28px',
          height: 64,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 16,
        }}>
          {/* Left: mobile toggle + page title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button
              onClick={() => setSidebarCollapsed((v) => !v)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#6B7280', display: 'flex', alignItems: 'center', padding: 4, borderRadius: 8,
              }}
              title="Toggle sidebar"
            >
              <Menu size={18} />
            </button>
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111111', margin: 0 }}>
                {PAGE_TITLES[activePage]}
              </h2>
              <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>
                {PAGE_SUBTITLES[activePage]}
              </p>
            </div>
          </div>

          {/* Right: search + bell + refresh + avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Search bar */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: '#FFFFFF', border: '1px solid #E5E7EB',
              borderRadius: 10, padding: '7px 12px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}>
              <Search size={13} color="#9CA3AF" />
              <input
                placeholder="Search…"
                style={{
                  border: 'none', outline: 'none', background: 'transparent',
                  fontSize: 13, color: '#374151', width: 140,
                  fontFamily: 'Inter, sans-serif',
                }}
              />
            </div>

            {/* Bell */}
            <button style={{
              width: 36, height: 36, borderRadius: 10,
              background: '#FFFFFF', border: '1px solid #E5E7EB',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#6B7280',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}>
              <Bell size={15} />
            </button>

            {/* Refresh */}
            <button
              onClick={refetch}
              disabled={loading}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 14px',
                background: '#111111', color: '#FFFFFF',
                border: 'none', borderRadius: 10,
                fontSize: 12, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                fontFamily: 'Inter, sans-serif',
                transition: 'background 0.15s',
              }}
              title="Refresh data"
            >
              <RefreshCw size={12} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
              Refresh
            </button>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '28px', overflowY: 'auto' }}>
          {loading && <LoadingSpinner />}
          {!loading && error && <ErrorMessage message={error} onRetry={refetch} />}
          {!loading && !error && data && renderPage()}
          {!loading && !error && !data && (
            <div style={{ textAlign: 'center', color: '#9CA3AF', paddingTop: 80 }}>No data available.</div>
          )}
        </main>

        {/* Footer */}
        <footer style={{
          padding: '12px 28px',
          borderTop: '1px solid #EBEBEB',
          background: '#FFFFFF',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>
            Startup Success Analytics · PySpark Analysis of Crunchbase Data
          </p>
          <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>
            {data ? `${(66368).toLocaleString()} startups · 1990–2015` : ''}
          </p>
        </footer>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
