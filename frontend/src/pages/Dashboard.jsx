import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Dashboard</h1>
      
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ color: 'var(--accent-blue)', marginBottom: '1rem' }}>Welcome back, {user?.name}!</h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Role: <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{user?.role}</span>
        </p>
        {user?.role === 'STUDENT' && (
          <div style={{ marginTop: '1rem', display: 'flex', gap: '2rem' }}>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-green)' }}>{user?.completedTasks || 0}</div>
              <div style={{ color: 'var(--text-secondary)' }}>Completed Tasks</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-purple)' }}>{user?.averageRating ? user.averageRating.toFixed(1) : 'N/A'}</div>
              <div style={{ color: 'var(--text-secondary)' }}>Avg Rating</div>
            </div>
          </div>
        )}
      </div>

      <div>
        <h3>{user?.role === 'STUDENT' ? 'Available Tasks' : 'Your Posted Tasks'}</h3>
        <div style={{ marginTop: '1rem', padding: '2rem', textAlign: 'center', border: '1px dashed var(--border-color)', borderRadius: '12px' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Coming Soon (Task Module)</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
