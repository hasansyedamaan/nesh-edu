import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/axios';

const DEMO_COURSE = {
  title: 'Artificial Intelligence & Machine Learning - FREE Demo',
  shortDescription: 'Join our FREE demo session on AI/ML this Sunday! Get insights into course structure, learning approach, and real-world applications.',
  category: 'AI/ML',
  level: 'Beginner',
  price: 0,
  thumbnail: null,
  isDemo: true
};

const GOOGLE_FORM_LINK = 'https://docs.google.com/forms/d/e/1FAIpQLScgqu3_f10FERP0zew8QCreSQK_d39y4Pkj_9LM4c7oj_GTJw/viewform?usp=publish-editor';

const CurriculumPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');

  const fetchCourses = () => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (level) params.append('level', level);
    api.get(`/courses?${params}`)
      .then(r => setCourses(r.data.courses))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCourses(); }, [category, level]);

  const categories = ['Core Logic', 'Neural Nets', 'System Integrity', 'Synthesis', 'Programming', 'Data Science', 'AI/ML', 'Web Development'];
  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ padding: '120px 48px 60px', background: 'linear-gradient(135deg, var(--primary) 0%, #191c1e 100%)' }}>
        <h1 style={{ color: 'white', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 800, marginBottom: 16 }}>Curriculum</h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 18, maxWidth: 600 }}>Explore our comprehensive course catalog designed for the next generation of cognitive leaders.</p>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '48px 48px 80px' }}>
        <div style={{ display: 'flex', gap: 16, marginBottom: 40, flexWrap: 'wrap' }}>
          <select className="input-field" style={{ width: 'auto', minWidth: 160 }} value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="input-field" style={{ width: 'auto', minWidth: 160 }} value={level} onChange={e => setLevel(e.target.value)}>
            <option value="">All Levels</option>
            {levels.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" /></div>
        ) : courses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--outline)' }}>No courses found</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
            {/* Demo Course - AI/ML */}
            <a href={GOOGLE_FORM_LINK} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <div className="glass-card" style={{ borderRadius: 20, overflow: 'hidden', transition: 'transform 0.3s', cursor: 'pointer', border: '2px solid var(--primary)' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ aspectRatio: '16/9', background: 'linear-gradient(135deg, var(--primary) 0%, #191c1e 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'white', opacity: 0.8 }}>psychology</span>
                  <span style={{ position: 'absolute', top: 12, right: 12, background: 'var(--error)', color: 'white', fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 9999, letterSpacing: '0.05em' }}>FREE DEMO</span>
                </div>
                <div style={{ padding: 20 }}>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, background: 'var(--primary-container)', color: 'var(--on-primary-container)', padding: '4px 10px', borderRadius: 9999 }}>{DEMO_COURSE.category}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, background: 'var(--error-container)', color: 'var(--on-error-container)', padding: '4px 10px', borderRadius: 9999 }}>LIVE DEMO</span>
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: 'var(--on-surface)' }}>{DEMO_COURSE.title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--outline)', marginBottom: 12, lineHeight: 1.5 }}>{DEMO_COURSE.shortDescription}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary)' }}>FREE</span>
                    <span style={{ padding: '8px 16px', background: 'var(--primary)', color: 'white', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>Register Now →</span>
                  </div>
                </div>
              </div>
            </a>
            
            {/* Regular Courses */}
            {courses.map(course => (
              <a key={course._id} href={`/courses/${course._id}`} style={{ textDecoration: 'none' }}>
                <div className="glass-card" style={{ borderRadius: 20, overflow: 'hidden', transition: 'transform 0.3s', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ aspectRatio: '16/9', background: 'var(--primary-container)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {course.thumbnail ? <img src={course.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> :
                      <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--on-primary-container)', opacity: 0.4 }}>school</span>}
                  </div>
                  <div style={{ padding: 20 }}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, background: 'var(--primary-container)', color: 'var(--on-primary-container)', padding: '4px 10px', borderRadius: 9999 }}>{course.category}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, background: 'var(--surface-container)', color: 'var(--on-surface-variant)', padding: '4px 10px', borderRadius: 9999 }}>{course.level}</span>
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: 'var(--on-surface)' }}>{course.title}</h3>
                    <p style={{ fontSize: 13, color: 'var(--outline)', marginBottom: 12, lineHeight: 1.5 }}>{course.shortDescription}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary)' }}>{course.price === 0 ? 'Free' : `$${course.price}`}</span>
                      <span style={{ fontSize: 12, color: 'var(--outline)' }}>{course.enrollmentCount} students</span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CurriculumPage;