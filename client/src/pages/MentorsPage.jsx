import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MENTOR_PROFILE = {
  name: 'Gaurav Mittal',
  title: 'Founder & Chief Cognitive Architect',
  bio: 'Ex-Google Tech Lead with 15+ years in AI/ML. Built ML systems serving 1B+ users. Focused on making AI education accessible to everyone.',
  avatar: null,
  totalCourses: 8,
  totalStudents: 5200
};

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Alex Rivera',
    role: 'Software Engineer at Google',
    text: 'This AI/ML course completely transformed my career. The hands-on projects and mentorship helped me transition into AI from traditional web development.',
    avatar: null
  },
  {
    id: 2,
    name: 'Priya Patel',
    role: 'Data Scientist at Meta',
    text: 'The curriculum is incredibly well-structured. Dr. Chen explains complex concepts in a way that just clicks. Landed my dream job within 3 months of completion.',
    avatar: null
  },
  {
    id: 3,
    name: 'James Wu',
    role: 'ML Engineer at Anthropic',
    text: 'Best investment in my education. The demo sessions were gold. The focus on practical, real-world applications vs just theory sets this apart.',
    avatar: null
  },
  {
    id: 4,
    name: 'Maria Santos',
    role: 'AI Researcher',
    text: 'Coming from a non-CS background, I was nervous. But the supportive community and clear teaching made it possible. Now I publish at NeurIPS!',
    avatar: null
  },
  {
    id: 5,
    name: 'David Kim',
    role: 'Founder, NeuralStart',
    text: 'The connections I made here led to my startup. The mentorship didn\'t just teach me AI—it helped me build products that matter.',
    avatar: null
  }
];

const MentorsPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
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
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {/* Mentor Profile Card */}
            <div className="glass-card" style={{ borderRadius: 24, padding: 28, textAlign: 'center', border: '2px solid var(--secondary)' }}>
              <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'var(--secondary-container)', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <span style={{ fontSize: 36, fontWeight: 800, color: 'var(--on-secondary-container)' }}>{MENTOR_PROFILE.name.charAt(0)}</span>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{MENTOR_PROFILE.name}</h3>
              <p style={{ fontSize: 13, color: 'var(--secondary)', marginBottom: 16, fontWeight: 600 }}>{MENTOR_PROFILE.title}</p>
              <p style={{ fontSize: 14, color: 'var(--on-surface-variant)', marginBottom: 20, lineHeight: 1.6 }}>{MENTOR_PROFILE.bio}</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 20, paddingTop: 16, borderTop: '1px solid var(--surface-container)' }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--secondary)' }}>{MENTOR_PROFILE.totalCourses}</p>
                  <p style={{ fontSize: 11, color: 'var(--outline)' }}>Courses</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--primary)' }}>{MENTOR_PROFILE.totalStudents}</p>
                  <p style={{ fontSize: 11, color: 'var(--outline)' }}>Students</p>
                </div>
              </div>
            </div>

            {/* Testimonial Cards */}
            {TESTIMONIALS.map(testimonial => (
              <div key={testimonial.id} className="glass-card" style={{ borderRadius: 24, padding: 28, textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--primary-container)', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <span style={{ fontSize: 24, fontWeight: 800, color: 'var(--on-primary-container)' }}>{testimonial.name.charAt(0)}</span>
                </div>
                <p style={{ fontSize: 14, color: 'var(--on-surface)', marginBottom: 16, lineHeight: 1.6, fontStyle: 'italic' }}>"{testimonial.text}"</p>
                <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{testimonial.name}</h4>
                <p style={{ fontSize: 12, color: 'var(--outline)' }}>{testimonial.role}</p>
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