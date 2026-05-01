import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import CreateTaskForm from '../components/CreateTaskForm';
import { Link } from 'react-router-dom';

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/tasks');
      const data = await response.json();
      if (response.ok) setTasks(data);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Task Marketplace</h2>
      </div>

      {user?.role === 'RECRUITER' && (
        <CreateTaskForm onTaskCreated={(newTask) => setTasks([newTask, ...tasks])} />
      )}

      <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h3 style={{ color: 'var(--text-secondary)' }}>Open Opportunities</h3>
        
        {loading ? (
          <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)' }}>No tasks available right now. Check back later!</p>
          </div>
        ) : (
          tasks.map(task => (
            <div key={task._id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--accent-green)' }}>{task.title}</h4>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                  Posted by <strong>{task.recruiterId?.companyName || 'Unknown Startup'}</strong>
                </p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {task.skillsRequired.map((skill, i) => (
                    <span key={i} style={{ padding: '0.25rem 0.75rem', borderRadius: '50px', backgroundColor: 'var(--border-color)', fontSize: '0.8rem' }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '1rem' }}>
                  ${task.bountyAmount}
                </div>
                <Link to={`/tasks/${task._id}`} className="btn btn-outline">
                  View Details
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskBoard;
