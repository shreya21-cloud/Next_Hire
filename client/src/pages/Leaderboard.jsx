import { useState, useEffect } from 'react';
import { Award, Star, CheckCircle, User as UserIcon } from 'lucide-react';

const Leaderboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/leaderboard');
        if (res.ok) {
          setStudents(await res.json());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) return <div className="container">Loading leaderboard...</div>;

  return (
    <div className="container" style={{ maxWidth: '1000px', padding: '2rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--accent-purple)' }}>Top Talent Leaderboard</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Recognizing our most consistent and high-performing contributors.</p>
      </div>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {students.map((student, index) => (
          <div key={student._id} className="glass-panel" style={{ 
            padding: '1.5rem 2rem', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '2rem',
            transition: 'transform 0.2s ease',
            borderLeft: index < 3 ? `6px solid ${index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32'}` : '1px solid var(--border-color)'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(10px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateX(0)'}
          >
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', width: '40px', color: 'var(--text-secondary)' }}>
              #{index + 1}
            </div>
            
            <div style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '50%', 
              backgroundColor: index < 3 ? (index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32') : 'var(--accent-blue)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'white'
            }}>
              <UserIcon size={30} />
            </div>

            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.25rem' }}>{student.name}</h3>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {student.skills?.slice(0, 3).map(skill => (
                  <span key={skill} style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', background: 'var(--border-color)', borderRadius: '50px' }}>
                    {skill}
                  </span>
                ))}
                {student.skills?.length > 3 && <span style={{ fontSize: '0.75rem' }}>+{student.skills.length - 3} more</span>}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '2rem', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                  <Star size={18} fill="currentColor" /> {student.averageRating.toFixed(1)}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Avg Rating</div>
              </div>
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                  <CheckCircle size={18} /> {student.completedTasks}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Tasks Done</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
