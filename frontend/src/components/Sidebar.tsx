import type { ActivePage } from '../types/dashboard';
import {
  LayoutDashboard,
  PieChart,
  Globe,
  Briefcase,
  TrendingUp,
  DollarSign,
  BarChart2,
  Activity,
  Clock,
  ChevronRight,
  Zap,
} from 'lucide-react';

interface NavItem {
  id: ActivePage;
  label: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'overview',          label: 'Dashboard',         icon: <LayoutDashboard size={16} /> },
  { id: 'status',            label: 'Status',            icon: <PieChart size={16} /> },
  { id: 'countries',         label: 'Countries',         icon: <Globe size={16} /> },
  { id: 'industries',        label: 'Industries',        icon: <Briefcase size={16} /> },
  { id: 'funding-rounds',    label: 'Funding Rounds',    icon: <TrendingUp size={16} /> },
  { id: 'funding-amount',    label: 'Funding Amount',    icon: <DollarSign size={16} /> },
  { id: 'yearly-trends',     label: 'Yearly Trends',     icon: <BarChart2 size={16} /> },
  { id: 'funding-by-status', label: 'Avg by Status',     icon: <Activity size={16} /> },
  { id: 'time-to-funding',   label: 'Time to Funding',   icon: <Clock size={16} /> },
];

interface SidebarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ activePage, onNavigate, collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      style={{
        width: collapsed ? 72 : 220,
        minHeight: '100vh',
        background: '#FFFFFF',
        borderRight: '1px solid #F3F4F6',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        transition: 'width 0.2s ease',
        boxShadow: '2px 0 12px rgba(0,0,0,0.04)',
        position: 'sticky',
        top: 0,
        overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        padding: collapsed ? '22px 0' : '22px 20px',
        borderBottom: '1px solid #F3F4F6',
      }}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: '#111111',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Zap size={15} color="#FFFFFF" />
            </div>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#111111', whiteSpace: 'nowrap' }}>
              StartupIQ
            </span>
          </div>
        )}

        {collapsed && (
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: '#111111',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Zap size={15} color="#FFFFFF" />
          </div>
        )}

        {!collapsed && (
          <button
            onClick={onToggle}
            title="Collapse sidebar"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#9CA3AF', padding: 4, borderRadius: 6, display: 'flex',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#111111')}
            onMouseLeave={e => (e.currentTarget.style.color = '#9CA3AF')}
          >
            <ChevronRight size={14} style={{ transform: 'rotate(180deg)' }} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '16px 10px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
        {NAV_ITEMS.map((item) => {
          const active = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              title={collapsed ? item.label : undefined}
              className={`nav-item${active ? ' nav-item-active' : ''}`}
              style={{
                justifyContent: collapsed ? 'center' : 'flex-start',
                padding: collapsed ? '10px 0' : '10px 14px',
              }}
            >
              <span style={{ flexShrink: 0, display: 'flex' }}>{item.icon}</span>
              {!collapsed && <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* User profile footer */}
      <div style={{
        borderTop: '1px solid #F3F4F6',
        padding: collapsed ? '16px 0' : '16px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        justifyContent: collapsed ? 'center' : 'flex-start',
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, fontSize: 13, fontWeight: 700, color: '#FFFFFF',
        }}>
          SA
        </div>
        {!collapsed && (
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#111111', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Startup Analytics</p>
            <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0, whiteSpace: 'nowrap' }}>66,368 companies</p>
          </div>
        )}

        {/* Collapsed expand button */}
        {collapsed && (
          <button
            onClick={onToggle}
            title="Expand sidebar"
            style={{
              position: 'absolute', bottom: 66, right: -12,
              width: 24, height: 24, borderRadius: '50%',
              background: '#FFFFFF', border: '1px solid #E5E7EB',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              color: '#6B7280',
            }}
          >
            <ChevronRight size={12} />
          </button>
        )}
      </div>
    </aside>
  );
}
