import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/axios';

const MentorsPage = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/instructors')
      .then(r => setInstructors(r.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ padding: '120px 48px 60px', background: 'linear-gradient(135deg, var(--secondary) 0%, #191c1e 100%)' }}>
        <h1 style={{ color: 'white', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 800, marginBottom: 16 }}>Our Mentors</h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 18, maxWidth: 600 }}>Learn from industry experts and thought leaders shaping the future of cognitive systems.</p>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '48px 48px 80px' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" /></div>
        ) : instructors.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--outline)' }}>No mentors found</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {instructors.map(inst => (
              <div key={inst._id} className="glass-card" style={{ borderRadius: 24, padding: 28, textAlign: 'center' }}>
                <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'var(--primary-container)', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {inst.avatar ? <img src={inst.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> :
                    <span style={{ fontSize: 36, fontWeight: 800, color: 'var(--on-primary-container)' }}>{inst.name?.charAt(0)}</span>}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{inst.name}</h3>
                <p style={{ fontSize: 13, color: 'var(--outline)', marginBottom: 16 }}>{inst.email}</p>
                {inst.bio && <p style={{ fontSize: 14, color: 'var(--on-surface-variant)', marginBottom: 20, lineHeight: 1.6 }}>{inst.bio}</p>}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 20, paddingTop: 16, borderTop: '1px solid var(--surface-container)' }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--primary)' }}>{inst.totalCourses || 0}</p>
                    <p style={{ fontSize: 11, color: 'var(--outline)' }}>Courses</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--secondary)' }}>{inst.totalStudents || 0}</p>
                    <p style={{ fontSize: 11, color: 'var(--outline)' }}>Students</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MentorsPage;