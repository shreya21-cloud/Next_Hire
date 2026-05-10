import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ position: 'sticky', top: '1rem', zIndex: 1000, padding: '0 1rem', marginBottom: '2rem' }}>
      <nav className="glass-panel" style={{ 
        padding: '1rem 2rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
        borderRadius: '16px'
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/logo.png" alt="NextHire Logo" style={{ height: '40px', width: 'auto' }} />
        </Link>
        
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          {user ? (
            <>
              <Link to="/tasks" style={{ fontWeight: '500', color: 'var(--text-secondary)', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'var(--accent-purple)'} onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}>Task Board</Link>
              <Link to="/dashboard" style={{ fontWeight: '500', color: 'var(--text-secondary)', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'var(--accent-purple)'} onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}>Dashboard</Link>
              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500', color: 'var(--text-primary)' }}>
                <div style={{ background: 'var(--accent-purple)', color: 'white', padding: '0.4rem', borderRadius: '50%', display: 'flex' }}>
                  <User size={16} />
                </div>
                <span>{user.name}</span>
              </Link>
              <button onClick={logout} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '8px' }}>
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ fontWeight: '600', color: 'var(--text-secondary)' }} onMouseOver={(e) => e.target.style.color = 'var(--accent-purple)'} onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ borderRadius: '24px', padding: '0.6rem 1.5rem' }}>Sign Up</Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
