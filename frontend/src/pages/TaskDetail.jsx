import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TaskDetail = () => {
  const { id } = useParams();
  const { user, token } = useAuth();
  const [task, setTask] = down => useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Student submission state
  const [subUrl, setSubUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTaskDetails();
  }, [id]);

  const fetchTaskDetails = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${id}`);
      if (res.ok) setTask(await res.json());

      if (user?.role === 'RECRUITER') {
        const subRes = await fetch(`http://localhost:5000/api/submissions/task/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (subRes.ok) setSubmissions(await subRes.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('http://localhost:5000/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ taskId: id, submissionUrl: subUrl, notes })
      });
      if (res.ok) {
        alert('Work submitted successfully!');
        setSubUrl('');
        setNotes('');
      } else {
        const err = await res.json();
        alert(err.message);
      }
    } catch (err) {
      alert('Error submitting work');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEvaluate = async (subId, status, rating) => {
    const feedback = prompt('Provide short feedback for the student:');
    if (!feedback) return;

    try {
      const res = await fetch(`http://localhost:5000/api/submissions/${subId}/evaluate`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status, rating, feedback })
      });
      if (res.ok) {
        fetchTaskDetails(); // Refresh list
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!task) return <div>Task not found.</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ color: 'var(--accent-green)', marginBottom: '1rem' }}>{task.title}</h2>
        <div style={{ display: 'flex', gap: '2rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          <span><strong>Company:</strong> {task.recruiterId?.companyName}</span>
          <span><strong>Bounty:</strong> ${task.bountyAmount}</span>
          <span><strong>Status:</strong> {task.status}</span>
        </div>
        <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{task.description}</p>
      </div>

      {user?.role === 'STUDENT' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--accent-purple)' }}>Submit Your Work</h3>
          <form onSubmit={handleStudentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Proof of Work URL (GitHub, Figma, etc)</label>
              <input type="url" required className="input-field" value={subUrl} onChange={e => setSubUrl(e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Notes for Recruiter</label>
              <textarea className="input-field" rows="3" value={notes} onChange={e => setNotes(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting} style={{ alignSelf: 'flex-start' }}>
              {submitting ? 'Submitting...' : 'Submit Work'}
            </button>
          </form>
        </div>
      )}

      {user?.role === 'RECRUITER' && (
        <div>
          <h3 style={{ marginBottom: '1rem' }}>Submissions ({submissions.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {submissions.map(sub => (
              <div key={sub._id} className="glass-panel" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div>
                    <h4 style={{ color: 'var(--accent-blue)' }}>{sub.studentId.name}</h4>
                    <a href={sub.submissionUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-purple)', textDecoration: 'underline' }}>View Work Link</a>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ padding: '0.25rem 0.5rem', backgroundColor: sub.status === 'PENDING' ? '#555' : sub.status === 'APPROVED' ? 'var(--accent-green)' : '#ff4444', color: '#fff', borderRadius: '4px', fontSize: '0.8rem' }}>
                      {sub.status}
                    </span>
                  </div>
                </div>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontStyle: 'italic' }}>"{sub.notes}"</p>
                
                {sub.status === 'PENDING' && (
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => handleEvaluate(sub._id, 'APPROVED', 5)} className="btn btn-success" style={{ padding: '0.5rem 1rem' }}>Approve (5 Stars)</button>
                    <button onClick={() => handleEvaluate(sub._id, 'REJECTED', 1)} className="btn btn-outline" style={{ padding: '0.5rem 1rem', color: '#ff4444', borderColor: '#ff4444' }}>Reject</button>
                  </div>
                )}
                {sub.status !== 'PENDING' && (
                  <p><strong>Rating given:</strong> {sub.rating}/5 <br/> <strong>Feedback:</strong> {sub.feedback}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetail;
