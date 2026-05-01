import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'STUDENT', companyName: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setToken } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        setToken(data.token); // this will trigger AuthContext to fetch user and redirect
        navigate('/dashboard');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Server Error');
    }
  };

  return (
    <div className="glass-panel" style={{ maxWidth: '500px', margin: '4rem auto', padding: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Create an Account</h2>
      {error && <div style={{ color: '#ff4444', marginBottom: '1rem' }}>{error}</div>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Full Name</label>
          <input type="text" className="input-field" required 
            value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Email</label>
          <input type="email" className="input-field" required 
            value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Password</label>
          <input type="password" className="input-field" required 
            value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>I am a...</label>
          <select 
            className="input-field" 
            value={formData.role} 
            onChange={(e) => setFormData({...formData, role: e.target.value})}
            style={{ backgroundColor: 'var(--bg-color)' }}
          >
            <option value="STUDENT">Student (Looking for tasks)</option>
            <option value="RECRUITER">Startup/Recruiter (Posting tasks)</option>
          </select>
        </div>
        
        {formData.role === 'RECRUITER' && (
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Company Name</label>
            <input type="text" className="input-field" required={formData.role === 'RECRUITER'}
              value={formData.companyName} onChange={(e) => setFormData({...formData, companyName: e.target.value})} />
          </div>
        )}

        <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Sign Up</button>
      </form>
      <div style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Already have an account? <Link to="/login" style={{ color: 'var(--accent-purple)' }}>Login</Link>
      </div>
    </div>
  );
};

export default Register;
