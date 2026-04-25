import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';

const AnalyticsPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'admin') {
      Promise.all([
        api.get('/users/admin/stats'),
        api.get('/courses')
      ]).then(([s, c]) => {
        setStats(s.data);
        setCourses(c.data.courses || []);
      }).finally(() => setLoading(false));
    } else if (user?.role === 'instructor') {
      Promise.all([
        api.get('/users/instructor/stats'),
        api.get('/courses/mine')
      ]).then(([s, c]) => {
        setStats(s.data);
        setCourses(c.data || []);
      }).finally(() => setLoading(false));
    } else {
      api.get('/enrollments/my').then(r => {
        const enrollments = r.data;
        const totalProgress = enrollments.reduce((a, e) => a + (e.progress || 0), 0);
        const avgProgress = enrollments.length ? Math.round(totalProgress / enrollments.length) : 0;
        const completed = enrollments.filter(e => e.certificateIssued).length;
        setStats({
          totalEnrollments: enrollments.length,
          avgProgress,
          completedCourses: completed,
          inProgress: enrollments.length - completed
        });
      }).finally(() => setLoading(false));
    }
  }, [user]);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><div className="spinner" /></div>;

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Analytics</h1>
        <p style={{ color: 'var(--on-surface-variant)', marginBottom: 40 }}>Track your performance and progress</p>

        {user?.role === 'admin' && stats && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 40 }}>
              {[
                { label: 'Total Users', value: stats.totalUsers, icon: 'group', color: 'var(--primary)' },
                { label: 'Total Courses', value: stats.totalCourses, icon: 'school', color: 'var(--secondary)' },
                { label: 'Published', value: stats.publishedCourses, icon: 'check_circle', color: 'var(--primary)' },
                { label: 'Enrollments', value: stats.totalEnrollments, icon: 'person_add', color: 'var(--tertiary)' },
              ].map(s => (
                <div key={s.label} className="stat-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--outline)', marginBottom: 8 }}>{s.label}</p>
                      <p style={{ fontSize: 32, fontWeight: 900, color: 'var(--on-surface)' }}>{s.value?.toLocaleString()}</p>
                    </div>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span className="material-symbols-outlined" style={{ color: s.color, fontSize: 22 }}>{s.icon}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="glass-card" style={{ borderRadius: 24, padding: 28 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Course Performance</h2>
              <div style={{ display: 'grid', gap: 16 }}>
                {courses.slice(0, 5).map(c => (
                  <div key={c._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--surface-container-low)' }}>
                    <div>
                      <p style={{ fontWeight: 600 }}>{c.title}</p>
                      <p style={{ fontSize: 12, color: 'var(--outline)' }}>{c.category}</p>
                    </div>
                    <div style={{ display: 'flex', gap: 24 }}>
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ fontWeight: 700, color: 'var(--primary)' }}>{c.enrollmentCount}</p>
                        <p style={{ fontSize: 11, color: 'var(--outline)' }}>Students</p>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ fontWeight: 700, color: 'var(--secondary)' }}>{c.rating?.average?.toFixed(1) || '—'}</p>
                        <p style={{ fontSize: 11, color: 'var(--outline)' }}>Rating</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {user?.role === 'instructor' && stats && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 40 }}>
              {[
                { label: 'My Courses', value: stats.totalCourses, icon: 'school', color: 'var(--primary)' },
                { label: 'Published', value: stats.publishedCourses, icon: 'check_circle', color: 'var(--secondary)' },
                { label: 'Total Students', value: stats.totalStudents, icon: 'people', color: 'var(--tertiary)' },
              ].map(s => (
                <div key={s.label} className="stat-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--outline)', marginBottom: 8 }}>{s.label}</p>
                      <p style={{ fontSize: 32, fontWeight: 900, color: 'var(--on-surface)' }}>{s.value}</p>
                    </div>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span className="material-symbols-outlined" style={{ color: s.color, fontSize: 22 }}>{s.icon}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="glass-card" style={{ borderRadius: 24, padding: 28 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>My Courses</h2>
              <div style={{ display: 'grid', gap: 16 }}>
                {courses.map(c => (
                  <div key={c._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--surface-container-low)' }}>
                    <div>
                      <p style={{ fontWeight: 600 }}>{c.title}</p>
                      <p style={{ fontSize: 12, color: 'var(--outline)' }}>{c.isPublished ? 'Published' : 'Draft'}</p>
                    </div>
                    <span style={{ padding: '4px 12px', borderRadius: 9999, fontSize: 12, fontWeight: 700, background: c.isPublished ? 'var(--primary-container)' : 'var(--surface-container)', color: c.isPublished ? 'var(--on-primary-container)' : 'var(--on-surface-variant)' }}>
                      {c.enrollmentCount} students
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {user?.role === 'student' && stats && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 40 }}>
              {[
                { label: 'Enrolled Courses', value: stats.totalEnrollments, icon: 'menu_book', color: 'var(--primary)' },
                { label: 'Average Progress', value: `${stats.avgProgress}%`, icon: 'trending_up', color: 'var(--secondary)' },
                { label: 'Completed', value: stats.completedCourses, icon: 'emoji_events', color: 'var(--tertiary)' },
              ].map(s => (
                <div key={s.label} className="stat-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--outline)', marginBottom: 8 }}>{s.label}</p>
                      <p style={{ fontSize: 32, fontWeight: 900, color: 'var(--on-surface)' }}>{s.value}</p>
                    </div>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span className="material-symbols-outlined" style={{ color: s.color, fontSize: 22 }}>{s.icon}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="glass-card" style={{ borderRadius: 24, padding: 28 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Learning Progress</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ flex: 1 }}>
                  <div className="progress-track" style={{ height: 12 }}>
                    <div className="progress-fill" style={{ width: `${stats.avgProgress}%`, background: 'var(--primary)' }} />
                  </div>
                </div>
                <span style={{ fontSize: 24, fontWeight: 900, color: 'var(--primary)' }}>{stats.avgProgress}%</span>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AnalyticsPage;