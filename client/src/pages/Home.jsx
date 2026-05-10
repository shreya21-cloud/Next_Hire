import { Link } from 'react-router-dom';
import heroPoster from '../assets/hero_poster.png';
import { Rocket, ShieldCheck, Zap, TrendingUp } from 'lucide-react';

const Home = () => {
  return (
    <div style={{ padding: '2rem 0' }}>
      {/* Hero Section */}
      <div style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h1 style={{ fontSize: '4.5rem', marginBottom: '1.5rem', fontWeight: '800', letterSpacing: '-0.02em', lineHeight: '1.1' }}>
          Stop Sending <span style={{ color: 'var(--accent-purple)' }}>Resumes.</span> <br/>
          Start Sending <span style={{ color: 'var(--accent-green)' }}>Proof.</span>
        </h1>
        <p style={{ fontSize: '1.3rem', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto 2.5rem', lineHeight: '1.6' }}>
          NextHire is the platform where Gen-Z talent proves their worth through real-world micro-tasks for high-growth startups. No fluff, just results.
        </p>
        <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', marginBottom: '5rem' }}>
          <Link to="/register" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2.5rem' }}>Get Started</Link>
          <Link to="/tasks" className="btn btn-outline" style={{ fontSize: '1.1rem', padding: '1rem 2.5rem' }}>Explore Tasks</Link>
        </div>
        
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 1rem', position: 'relative' }}>
          <div style={{ 
            position: 'absolute', 
            top: '-20px', 
            left: '-20px', 
            right: '-20px', 
            bottom: '-20px', 
            background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))', 
            borderRadius: '24px', 
            filter: 'blur(40px)', 
            opacity: 0.15,
            zIndex: -1 
          }}></div>
          <img 
            src={heroPoster} 
            alt="NextHire Hero Poster" 
            style={{ 
              width: '100%', 
              height: 'auto', 
              borderRadius: '20px', 
              boxShadow: '0 30px 60px rgba(0,0,0,0.12)',
              border: '4px solid white'
            }} 
          />
        </div>
      </div>

      {/* Features Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', padding: '5rem 0' }}>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <Zap color="var(--accent-purple)" size={32} style={{ marginBottom: '1rem' }} />
          <h3 style={{ marginBottom: '0.75rem' }}>Instant Gigs</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Find micro-internships that fit your schedule. Complete them in hours, not months.</p>
        </div>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <ShieldCheck color="var(--accent-green)" size={32} style={{ marginBottom: '1rem' }} />
          <h3 style={{ marginBottom: '0.75rem' }}>Skill Proof</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Build a verifiable portfolio of real-world work that recruiters actually care about.</p>
        </div>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <Rocket color="var(--accent-blue)" size={32} style={{ marginBottom: '1rem' }} />
          <h3 style={{ marginBottom: '0.75rem' }}>Direct Hire</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Top performers get noticed and recruited for full-time roles by the hottest startups.</p>
        </div>
      </div>

      {/* Top Performers Teaser */}
      <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', background: 'linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url("https://www.transparenttextures.com/patterns/cubes.png")' }}>
        <TrendingUp color="var(--accent-purple)" size={40} style={{ marginBottom: '1.5rem' }} />
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Ready to climb the Leaderboard?</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
          Our top students have earned over $10k in collective bounties this month. Join the elite and start your journey today.
        </p>
        <Link to="/leaderboard" className="btn btn-primary" style={{ padding: '0.8rem 2rem' }}>View Leaderboard</Link>
      </div>
    </div>
  );
};

export default Home;

