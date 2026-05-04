import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import CreateTaskForm from '../components/CreateTaskForm';
import { Link } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');

  // Extract all unique skills from tasks for the filter dropdown
  const allSkills = [...new Set(tasks.flatMap(task => task.skillsRequired))].sort();

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    let result = tasks;
    if (searchQuery) {
      result = result.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        task.recruiterId?.companyName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedSkill) {
      result = result.filter(task => task.skillsRequired.includes(selectedSkill));
    }
    setFilteredTasks(result);
  }, [searchQuery, selectedSkill, tasks]);

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/tasks');
      const data = await response.json();
      if (response.ok) {
        setTasks(data);
        setFilteredTasks(data);
      }
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

      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
          <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Search by title or company..." 
            className="input-field"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '3rem' }}
          />
        </div>
        <div style={{ minWidth: '200px', position: 'relative' }}>
          <Filter size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <select 
            className="input-field" 
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            style={{ paddingLeft: '3rem', appearance: 'none' }}
          >
            <option value="">All Skills</option>
            {allSkills.map(skill => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h3 style={{ color: 'var(--text-secondary)' }}>Open Opportunities</h3>
        
        {loading ? (
          <p>Loading tasks...</p>
        ) : filteredTasks.length === 0 ? (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)' }}>No tasks found matching your criteria.</p>
            {(searchQuery || selectedSkill) && (
              <button 
                className="btn btn-outline" 
                style={{ marginTop: '1rem' }}
                onClick={() => { setSearchQuery(''); setSelectedSkill(''); }}
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          filteredTasks.map(task => (
            <div key={task._id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'transform 0.2s', cursor: 'default' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div>
                <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--accent-green)' }}>{task.title}</h4>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                  Posted by <strong>{task.recruiterId?.companyName || 'Unknown Startup'}</strong>
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
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
