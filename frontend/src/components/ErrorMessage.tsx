import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', paddingTop: 80, gap: 16,
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: '50%',
        background: '#FEE2E2',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <AlertCircle size={24} color="#DC2626" />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 15, fontWeight: 600, color: '#111111', margin: '0 0 6px' }}>
          Failed to load data
        </p>
        <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0, maxWidth: 340 }}>{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            padding: '8px 20px',
            background: '#111111', color: '#FFFFFF',
            border: 'none', borderRadius: 10,
            fontSize: 13, fontWeight: 500, cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Try again
        </button>
      )}
    </div>
  );
}
