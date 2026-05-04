import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, token } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoint = user?.role === 'STUDENT' 
          ? 'http://localhost:5000/api/submissions/student/me'
          : 'http://localhost:5000/api/tasks/recruiter/me';
          
        const res = await fetch(endpoint, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
          setData(await res.json());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user && token) {
      fetchData();
    }
  }, [user, token]);

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
        <h3 style={{ marginBottom: '1.5rem' }}>{user?.role === 'STUDENT' ? 'Your Applications' : 'Your Posted Tasks'}</h3>
        
        {loading ? (
          <p>Loading...</p>
        ) : data.length === 0 ? (
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)' }}>
              {user?.role === 'STUDENT' ? "You haven't applied to any tasks yet." : "You haven't posted any tasks yet."}
            </p>
            <Link to="/tasks" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
              {user?.role === 'STUDENT' ? "Browse Tasks" : "Post a Task"}
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {data.map(item => (
              <div key={item._id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {user?.role === 'STUDENT' ? (
                  <>
                    <div>
                      <h4 style={{ color: 'var(--accent-green)', marginBottom: '0.5rem' }}>{item.taskId?.title}</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Company: {item.taskId?.recruiterId?.companyName}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '4px', 
                        fontSize: '0.8rem',
                        marginBottom: '0.5rem',
                        backgroundColor: item.status === 'PENDING' ? '#555' : item.status === 'APPROVED' ? 'var(--accent-green)' : '#ff4444', 
                        color: '#fff' 
                      }}>
                        {item.status}
                      </div>
                      <Link to={`/tasks/${item.taskId?._id}`} style={{ color: 'var(--accent-blue)', fontSize: '0.9rem', textDecoration: 'underline' }}>View Task</Link>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <h4 style={{ color: 'var(--accent-green)', marginBottom: '0.5rem' }}>{item.title}</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Bounty: ${item.bountyAmount}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '4px', 
                        fontSize: '0.8rem',
                        marginBottom: '0.5rem',
                        display: 'inline-block',
                        backgroundColor: item.status === 'OPEN' ? 'var(--accent-blue)' : '#555', 
                        color: '#fff' 
                      }}>
                        {item.status}
                      </span>
                      <br/>
                      <Link to={`/tasks/${item._id}`} className="btn btn-outline" style={{ marginTop: '0.5rem', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                        Manage Submissions
                      </Link>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
