import { X } from 'lucide-react';

const Toast = ({ message, type, onClose }) => {
  const getColors = () => {
    switch (type) {
      case 'success': return { bg: '#10b981', color: 'white' };
      case 'error': return { bg: '#ef4444', color: 'white' };
      case 'warning': return { bg: '#f59e0b', color: 'white' };
      default: return { bg: 'var(--glass-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' };
    }
  };

  const colors = getColors();

  return (
    <div style={{
      backgroundColor: colors.bg,
      color: colors.color,
      border: colors.border,
      padding: '1rem',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      minWidth: '300px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      animation: 'slideIn 0.3s ease-out forwards',
      backdropFilter: type === 'info' ? 'blur(10px)' : 'none'
    }}>
      <span>{message}</span>
      <button 
        onClick={onClose}
        style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: '0 0 0 1rem', display: 'flex' }}
      >
        <X size={18} />
      </button>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Toast;
