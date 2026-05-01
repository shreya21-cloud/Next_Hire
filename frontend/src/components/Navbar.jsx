import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-purple)' }}>
        NextHire
      </Link>
      
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {user ? (
          <>
            <Link to="/tasks" style={{ marginRight: '1rem', color: 'var(--text-secondary)' }}>Task Board</Link>
            <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={20} />
              <span>{user.name}</span>
            </Link>
            <button onClick={logout} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
              <LogOut size={16} /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-outline">Login</Link>
            <Link to="/register" className="btn btn-primary">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
