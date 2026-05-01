import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const CreateTaskForm = ({ onTaskCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    bountyAmount: '',
    skillsRequired: ''
  });
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        bountyAmount: Number(formData.bountyAmount),
        skillsRequired: formData.skillsRequired.split(',').map(s => s.trim())
      };

      const response = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const newTask = await response.json();
        setFormData({ title: '', description: '', bountyAmount: '', skillsRequired: '' });
        if (onTaskCreated) onTaskCreated(newTask);
      } else {
        const errData = await response.json();
        setError(errData.message || 'Failed to create task');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', marginTop: '2rem' }}>
      <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-purple)' }}>Post a New Micro-Internship</h3>
      {error && <div style={{ color: '#ff4444', marginBottom: '1rem' }}>{error}</div>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Task Title</label>
          <input type="text" className="input-field" required 
            value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} 
            placeholder="e.g. Design a Landing Page for our SaaS" />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Description</label>
          <textarea className="input-field" required rows="4"
            value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} 
            placeholder="Describe the task, requirements, and deliverables..." />
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Bounty ($)</label>
            <input type="number" className="input-field" required min="1"
              value={formData.bountyAmount} onChange={(e) => setFormData({...formData, bountyAmount: e.target.value})} />
          </div>
          <div style={{ flex: 2 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Skills (comma separated)</label>
            <input type="text" className="input-field" required 
              value={formData.skillsRequired} onChange={(e) => setFormData({...formData, skillsRequired: e.target.value})} 
              placeholder="e.g. React, Figma, Copywriting" />
          </div>
        </div>
        
        <button type="submit" className="btn btn-primary" disabled={loading} style={{ alignSelf: 'flex-start', marginTop: '1rem' }}>
          {loading ? 'Posting...' : 'Post Task'}
        </button>
      </form>
    </div>
  );
};

export default CreateTaskForm;
