import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './WelcomePage.css';

const WelcomePage = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 1000),
      setTimeout(() => setStep(2), 3000),
      setTimeout(() => setStep(3), 5200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="welcome-page">
      <Link to="/" style={{ position: 'absolute', top: 32, left: 32, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--on-surface)', fontWeight: 700, fontSize: 14, textDecoration: 'none', background: 'rgba(255,255,255,0.6)', padding: '10px 16px', borderRadius: 9999, backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)', transition: 'all 0.3s', zIndex: 100 }} onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.9)'} onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.6)'}>
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>home</span>
        Back to Home
      </Link>
      <div className="welcome-content">
        <div className={`welcome-step ${step === 1 ? 'active' : ''}`}>
          <div className="welcome-icon">
            <span className="material-symbols-outlined">auto_awesome</span>
          </div>
          <h1>Welcome to NESHEDU</h1>
          <p>We would love to onboard you to the society</p>
        </div>

        <div className={`welcome-step ${step === 2 ? 'active' : ''}`}>
          <div className="welcome-icon loading">
            <span className="material-symbols-outlined">hourglass_empty</span>
          </div>
          <h2>Please await further instructions</h2>
          <p>from the team</p>
        </div>

        <div className={`welcome-step ${step === 3 ? 'active' : ''}`}>
          <div className="welcome-icon success">
            <span className="material-symbols-outlined">celebration</span>
          </div>
          <h2>Thank you for your interest</h2>
          <p className="highlight">Happy Learning!</p>
        </div>
      </div>

      <div className="welcome-particles">
        {[...Array(12)].map((_, i) => (
          <span key={i} style={{ '--i': i }} />
        ))}
      </div>
    </div>
  );
};

export default WelcomePage;