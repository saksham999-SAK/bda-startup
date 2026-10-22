import type { ReactNode } from 'react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  featured?: boolean;
  delay?: number;
}

export default function KPICard({
  title,
  value,
  subtitle,
  icon,
  featured = false,
  delay = 0,
}: KPICardProps) {
  const cardClass = featured ? 'stat-card-featured' : 'stat-card';

  return (
    <div
      className={`${cardClass} animate-fade-in-up`}
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Icon */}
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: featured ? 'rgba(255,255,255,0.12)' : '#F3F4F6',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 14, color: featured ? '#FFFFFF' : '#6B7280',
      }}>
        {icon}
      </div>

      {/* Value */}
      <p style={{
        fontSize: 22, fontWeight: 700, margin: 0, marginBottom: 4,
        color: featured ? '#FFFFFF' : '#111111', lineHeight: 1.2,
      }}>
        {value}
      </p>

      {/* Title */}
      <p style={{
        fontSize: 12, fontWeight: 500, margin: 0,
        color: featured ? 'rgba(255,255,255,0.7)' : '#6B7280',
        lineHeight: 1.4,
      }}>
        {title}
      </p>

      {/* Subtitle */}
      {subtitle && (
        <p style={{
          fontSize: 11, margin: '4px 0 0', lineHeight: 1.4,
          color: featured ? 'rgba(255,255,255,0.5)' : '#9CA3AF',
        }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
