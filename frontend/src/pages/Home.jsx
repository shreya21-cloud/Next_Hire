import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 0' }}>
      <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
        Show your skills. <br/> <span style={{ color: 'var(--accent-green)' }}>Get the gig.</span>
      </h1>
      <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 2rem' }}>
        NextHire: Proof Over Promises. Stop sending resumes and start doing real-world micro-internships for startups.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Link to="/register" className="btn btn-primary" style={{ fontSize: '1.1rem' }}>Start Proving</Link>
        <Link to="/login" className="btn btn-outline" style={{ fontSize: '1.1rem' }}>Post a Task</Link>
      </div>
    </div>
  );
};

export default Home;
