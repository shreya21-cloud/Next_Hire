import { Link } from 'react-router-dom';
import heroPoster from '../assets/hero_poster.png';

const Home = () => {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 0' }}>
      <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', fontWeight: '700' }}>
        Show your skills. <br/> <span style={{ color: 'var(--accent-green)' }}>Get the gig.</span>
      </h1>
      <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 2rem' }}>
        NextHire: Proof Over Promises. Stop sending resumes and start doing real-world micro-internships for startups.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '4rem' }}>
        <Link to="/register" className="btn btn-primary" style={{ fontSize: '1.1rem' }}>Start Proving</Link>
        <Link to="/login" className="btn btn-outline" style={{ fontSize: '1.1rem' }}>Post a Task</Link>
      </div>
      
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1rem' }}>
        <img 
          src={heroPoster} 
          alt="NextHire Hero Poster" 
          style={{ 
            width: '100%', 
            height: 'auto', 
            borderRadius: '16px', 
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            border: '8px solid white'
          }} 
        />
      </div>
    </div>
  );
};

export default Home;

