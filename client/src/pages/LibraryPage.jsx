import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const LibraryPage = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesRes = await api.get('/courses');
        setCourses(coursesRes.data.courses || []);
        if (user) {
          const enrollRes = await api.get('/enrollments/my');
          setEnrollments(enrollRes.data);
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [user]);

  const enrolledIds = enrollments.map(e => e.course?._id);
  const publishedCourses = courses.filter(c => c.isPublished);

  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ padding: '120px 48px 60px', background: 'linear-gradient(135deg, var(--tertiary) 0%, #191c1e 100%)' }}>
        <h1 style={{ color: 'white', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 800, marginBottom: 16 }}>Library</h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 18, maxWidth: 600 }}>Your personal learning library and resources.</p>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '48px 48px 80px' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" /></div>
        ) : (
          <>
            {user && enrolledIds.length > 0 && (
              <section style={{ marginBottom: 48 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>My Learning</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
                  {enrollments.map(e => (
                    <Link key={e._id} to={`/courses/${e.course?._id}`} style={{ textDecoration: 'none' }}>
                      <div className="glass-card" style={{ borderRadius: 16, padding: 20, display: 'flex', gap: 16, alignItems: 'center' }}>
                        <div style={{ width: 60, height: 60, borderRadius: 12, background: 'var(--primary-container)', overflow: 'hidden', flexShrink: 0 }}>
                          {e.course?.thumbnail ? <img src={e.course.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> :
                            <span className="material-symbols-outlined" style={{ fontSize: 28, color: 'var(--on-primary-container)', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>school</span>}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.course?.title}</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div className="progress-track" style={{ flex: 1, height: 4 }}><div className="progress-fill" style={{ width: `${e.progress}%` }} /></div>
                            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--primary)' }}>{e.progress}%</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <section style={{ marginBottom: 48 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>All Courses</h2>
              {publishedCourses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--outline)' }}>No courses available</div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                  {publishedCourses.map(c => {
                    const isEnrolled = enrolledIds.includes(c._id);
                    return (
                      <div key={c._id} className="glass-card" style={{ borderRadius: 16, overflow: 'hidden' }}>
                        <div style={{ aspectRatio: '16/9', background: 'var(--surface-container)' }}>
                          {c.thumbnail ? <img src={c.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> :
                            <span className="material-symbols-outlined" style={{ fontSize: 36, color: 'var(--outline)', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>school</span>}
                        </div>
                        <div style={{ padding: 16 }}>
                          <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>{c.title}</p>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 13, color: 'var(--outline)' }}>{c.enrollmentCount} students</span>
                            <span style={{ fontSize: 13, fontWeight: 700, color: isEnrolled ? 'var(--primary)' : c.price === 0 ? 'var(--primary)' : 'var(--on-surface)' }}>
                              {isEnrolled ? 'Enrolled' : c.price === 0 ? 'Free' : `$${c.price}`}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {!user && (
              <div style={{ textAlign: 'center', padding: 40, background: 'var(--surface-container)', borderRadius: 20 }}>
                <p style={{ fontSize: 16, marginBottom: 16 }}>Sign in to track your learning progress</p>
                <Link to="/login" style={{ display: 'inline-block', padding: '12px 28px', background: 'var(--primary)', color: 'white', borderRadius: 12, fontWeight: 700 }}>Sign In</Link>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default LibraryPage;