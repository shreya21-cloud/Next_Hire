import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User, Mail, Briefcase, Award, Save, Edit2 } from 'lucide-react';

const Profile = () => {
  const { user, token, login } = useAuth();
  const { addToast } = useToast();
  
  const [profile, setProfile] = useState({
    name: '',
    bio: '',
    skills: [],
    companyName: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setProfile({
            name: data.name,
            bio: data.bio || '',
            skills: data.skills || [],
            companyName: data.companyName || ''
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchProfile();
  }, [token]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profile)
      });
      
      if (res.ok) {
        const updatedUser = await res.json();
        addToast('Profile updated successfully!', 'success');
        setIsEditing(false);
        // Optionally update the local user context if name changed
      } else {
        addToast('Failed to update profile', 'error');
      }
    } catch (err) {
      addToast('Error saving profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (newSkill && !profile.skills.includes(newSkill)) {
      setProfile({ ...profile, skills: [...profile.skills, newSkill] });
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setProfile({ ...profile, skills: profile.skills.filter(s => s !== skillToRemove) });
  };

  if (loading) return <div className="container">Loading profile...</div>;

  return (
    <div className="container" style={{ maxWidth: '800px', padding: '2rem 0' }}>
      <div className="glass-panel" style={{ padding: '3rem', position: 'relative' }}>
        <button 
          onClick={() => setIsEditing(!isEditing)} 
          className="btn btn-outline"
          style={{ position: 'absolute', top: '2rem', right: '2rem', padding: '0.5rem 1rem' }}
        >
          {isEditing ? 'Cancel' : <><Edit2 size={16} style={{ marginRight: '0.5rem' }} /> Edit Profile</>}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%', 
            backgroundColor: 'var(--accent-purple)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'white'
          }}>
            <User size={40} />
          </div>
          <div>
            {isEditing ? (
              <input 
                type="text" 
                className="input-field" 
                value={profile.name} 
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                style={{ fontSize: '1.5rem', fontWeight: 'bold', width: 'auto' }}
              />
            ) : (
              <h1 style={{ fontSize: '2rem' }}>{profile.name}</h1>
            )}
            <p style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={16} /> {user?.email}
            </p>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={20} color="var(--accent-purple)" /> Bio
          </h3>
          {isEditing ? (
            <textarea 
              className="input-field" 
              rows="4" 
              value={profile.bio} 
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              placeholder="Tell us about yourself..."
            />
          ) : (
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
              {profile.bio || 'No bio yet. Add one to stand out!'}
            </p>
          )}
        </div>

        {user?.role === 'STUDENT' && (
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Briefcase size={20} color="var(--accent-green)" /> Skills
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
              {profile.skills.map(skill => (
                <span key={skill} style={{ 
                  padding: '0.4rem 1rem', 
                  backgroundColor: 'var(--border-color)', 
                  borderRadius: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.9rem'
                }}>
                  {skill}
                  {isEditing && (
                    <button 
                      onClick={() => removeSkill(skill)}
                      style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ff4444' }}
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>
            {isEditing && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Add a skill..." 
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                />
                <button onClick={addSkill} className="btn btn-outline">Add</button>
              </div>
            )}
          </div>
        )}

        {user?.role === 'RECRUITER' && (
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Company</h3>
            {isEditing ? (
              <input 
                type="text" 
                className="input-field" 
                value={profile.companyName} 
                onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
              />
            ) : (
              <p style={{ color: 'var(--text-secondary)' }}>{profile.companyName}</p>
            )}
          </div>
        )}

        {isEditing && (
          <button 
            onClick={handleSave} 
            className="btn btn-primary" 
            disabled={saving}
            style={{ marginTop: '1rem' }}
          >
            <Save size={18} style={{ marginRight: '0.5rem' }} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
