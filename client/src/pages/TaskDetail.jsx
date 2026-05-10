import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const TaskDetail = () => {
  const { id } = useParams();
  const { user, token } = useAuth();
  const { addToast } = useToast();
  const [task, setTask] = useState(null);
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
        addToast('Work submitted successfully!', 'success');
        setSubUrl('');
        setNotes('');
      } else {
        const err = await res.json();
        addToast(err.message, 'error');
      }
    } catch (err) {
      addToast('Error submitting work', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const [evaluatingSub, setEvaluatingSub] = useState(null); // ID of submission being evaluated
  const [evalRating, setEvalRating] = useState(5);
  const [evalFeedback, setEvalFeedback] = useState('');

  const handleEvaluate = async (subId, status) => {
    if (!evalFeedback) {
      addToast('Please provide feedback', 'error');
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/submissions/${subId}/evaluate`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status, rating: evalRating, feedback: evalFeedback })
      });
      if (res.ok) {
        addToast(`Submission ${status.toLowerCase()}`, 'success');
        setEvaluatingSub(null);
        setEvalFeedback('');
        fetchTaskDetails(); // Refresh list
      } else {
        const err = await res.json();
        addToast(err.message, 'error');
      }
    } catch (err) {
      addToast('Error evaluating submission', 'error');
    }
  };

  if (loading) return <div className="container">Loading...</div>;
  if (!task) return <div className="container">Task not found.</div>;

  return (
    <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ color: 'var(--accent-purple)', fontSize: '2rem', marginBottom: '0.5rem' }}>{task.title}</h2>
            <p style={{ color: 'var(--accent-blue)', fontWeight: '600' }}>{task.recruiterId?.companyName}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--accent-green)' }}>${task.bountyAmount}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Bounty Reward</div>
          </div>
        </div>
        
        <div style={{ height: '1px', background: 'var(--border-color)', margin: '1.5rem 0' }}></div>
        
        <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.7', color: 'var(--text-secondary)' }}>{task.description}</p>
        
        <div style={{ marginTop: '2rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {task.skillsRequired?.map((skill, i) => (
            <span key={i} style={{ padding: '0.4rem 1rem', background: 'var(--border-color)', borderRadius: '50px', fontSize: '0.85rem', fontWeight: '500' }}>
              {skill}
            </span>
          ))}
        </div>
      </div>

      {user?.role === 'STUDENT' && (
        <div className="glass-panel" style={{ padding: '2.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Award color="var(--accent-purple)" /> Submit Your Solution
          </h3>
          <form onSubmit={handleStudentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '500' }}>Proof of Work URL (GitHub, Figma, etc)</label>
              <input type="url" required className="input-field" value={subUrl} onChange={e => setSubUrl(e.target.value)} placeholder="https://github.com/..." />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '500' }}>Notes for Recruiter</label>
              <textarea className="input-field" rows="4" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Explain your approach..." />
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting} style={{ alignSelf: 'flex-start', padding: '0.8rem 2.5rem' }}>
              {submitting ? 'Submitting...' : 'Submit Work'}
            </button>
          </form>
        </div>
      )}

      {user?.role === 'RECRUITER' && (
        <div>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Submissions ({submissions.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {submissions.length === 0 ? (
              <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No submissions yet for this task.
              </div>
            ) : submissions.map(sub => (
              <div key={sub._id} className="glass-panel" style={{ padding: '2rem', borderLeft: sub.status === 'APPROVED' ? '4px solid var(--accent-green)' : '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <div>
                    <h4 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{sub.studentId.name}</h4>
                    <a href={sub.submissionUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-blue)', textDecoration: 'underline', fontSize: '0.9rem' }}>View Submission Link</a>
                  </div>
                  <div style={{ 
                    padding: '0.4rem 1rem', 
                    backgroundColor: sub.status === 'PENDING' ? '#555' : sub.status === 'APPROVED' ? 'var(--accent-green)' : '#ff4444', 
                    color: '#fff', 
                    borderRadius: '50px', 
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    height: 'fit-content'
                  }}>
                    {sub.status}
                  </div>
                </div>
                
                <div style={{ background: 'rgba(0,0,0,0.02)', padding: '1.25rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                  <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>"{sub.notes}"</p>
                </div>
                
                {sub.status === 'PENDING' && evaluatingSub !== sub._id && (
                  <button onClick={() => setEvaluatingSub(sub._id)} className="btn btn-primary" style={{ padding: '0.6rem 1.5rem' }}>
                    Review Submission
                  </button>
                )}

                {evaluatingSub === sub._id && (
                  <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.02)', border: '1px dashed var(--accent-purple)' }}>
                    <h5 style={{ marginBottom: '1rem', color: 'var(--accent-purple)' }}>Evaluating {sub.studentId.name}'s work</h5>
                    
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Rating (1-5 stars)</label>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {[1, 2, 3, 4, 5].map(star => (
                          <button 
                            key={star} 
                            onClick={() => setEvalRating(star)}
                            style={{ 
                              border: 'none', 
                              background: star <= evalRating ? 'var(--accent-purple)' : 'var(--border-color)',
                              color: 'white',
                              width: '32px',
                              height: '32px',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            {star}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Feedback for Student</label>
                      <textarea 
                        className="input-field" 
                        rows="3" 
                        value={evalFeedback} 
                        onChange={(e) => setEvalFeedback(e.target.value)}
                        placeholder="Great work on the frontend structure..."
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button onClick={() => handleEvaluate(sub._id, 'APPROVED')} className="btn btn-success" style={{ flex: 1 }}>Approve & Pay</button>
                      <button onClick={() => handleEvaluate(sub._id, 'REJECTED')} className="btn btn-outline" style={{ flex: 1, color: '#ff4444' }}>Reject</button>
                      <button onClick={() => setEvaluatingSub(null)} className="btn btn-outline">Cancel</button>
                    </div>
                  </div>
                )}

                {sub.status !== 'PENDING' && (
                  <div style={{ marginTop: '1rem', padding: '1rem', borderTop: '1px solid var(--border-color)' }}>
                    <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                      <strong>Rating:</strong> {Array(sub.rating).fill('⭐').join('')} ({sub.rating}/5)
                    </p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      <strong>Feedback:</strong> {sub.feedback}
                    </p>
                  </div>
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
