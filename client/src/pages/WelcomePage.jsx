import { useState, useEffect } from 'react';
import './WelcomePage.css';

const WelcomePage = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 800),
      setTimeout(() => setStep(2), 2400),
      setTimeout(() => setStep(3), 4400),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="welcome-page">
      <div className="welcome-content">
        <div className={`welcome-step ${step >= 1 ? 'active' : ''}`}>
          <div className="welcome-icon">
            <span className="material-symbols-outlined">auto_awesome</span>
          </div>
          <h1>Welcome to NESHEDU</h1>
          <p>We would love to onboard you to the society</p>
        </div>

        <div className={`welcome-step ${step >= 2 ? 'active' : ''}`}>
          <div className="welcome-icon">
            <span className="material-symbols-outlined">hourglass_empty</span>
          </div>
          <h2>Please await further instructions from the team</h2>
          <div className="loading-dots">
            <span></span><span></span><span></span>
          </div>
        </div>

        <div className={`welcome-step ${step >= 3 ? 'active' : ''}`}>
          <div className="welcome-icon success">
            <span className="material-symbols-outlined">school</span>
          </div>
          <h2>Thank you for your interest</h2>
          <p className="highlight">Happy Learning!</p>
        </div>
      </div>

      <div className="welcome-bg">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="floating-shape" style={{
            '--delay': `${Math.random() * 5}s`,
            '--x': `${Math.random() * 100}%`,
            '--duration': `${8 + Math.random() * 8}s`,
            '--size': `${20 + Math.random() * 60}px`
          }} />
        ))}
      </div>
    </div>
  );
};

export default WelcomePage;