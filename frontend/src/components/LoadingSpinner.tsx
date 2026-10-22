export default function LoadingSpinner() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      paddingTop: 100, gap: 16,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        border: '3px solid #F3F4F6',
        borderTopColor: '#111111',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0 }}>Loading data…</p>
      <style>{`@keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }`}</style>
    </div>
  );
}
