import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import CourseCard from '../../components/CourseCard';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/enrollments/my').then(r => setEnrollments(r.data)).finally(() => setLoading(false));
  }, []);

  const inProgress = enrollments.filter(e => e.progress < 100);
  const completed  = enrollments.filter(e => e.progress === 100);
  const avgProgress = enrollments.length
    ? Math.round(enrollments.reduce((a, e) => a + e.progress, 0) / enrollments.length)
    : 0;

  const stats = [
    { icon:'menu_book', label:'Enrolled',    value:enrollments.length, color:'var(--primary)',   bg:'var(--primary-container)' },
    { icon:'pending',   label:'In Progress', value:inProgress.length,  color:'var(--secondary)', bg:'var(--secondary-container)' },
    { icon:'verified',  label:'Completed',   value:completed.length,   color:'var(--tertiary)',  bg:'var(--tertiary-container)' },
    { icon:'trending_up', label:'Avg Progress', value:`${avgProgress}%`, color:'var(--primary)', bg:'rgba(152,219,198,0.2)' },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        {/* Header */}
        <div style={{ marginBottom:40 }}>
          <h1 style={{ fontSize:28, fontWeight:800, marginBottom:6 }}>
            Hello, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p style={{ color:'var(--on-surface-variant)', fontSize:16 }}>
            Continue your cognitive journey. You're doing great!
          </p>
        </div>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20, marginBottom:48 }}>
          {stats.map(({ icon, label, value, color, bg }) => (
            <div key={label} className="stat-card" style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div style={{ width:48, height:48, borderRadius:14, background:bg,
                display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span className="material-symbols-outlined" style={{ color, fontSize:24 }}>{icon}</span>
              </div>
              <div>
                <p style={{ fontSize:28, fontWeight:800, lineHeight:1 }}>{value}</p>
                <p style={{ fontSize:13, color:'var(--outline)', fontWeight:600, marginTop:4 }}>{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* In Progress */}
        {inProgress.length > 0 && (
          <div style={{ marginBottom:48 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
              <h2 style={{ fontSize:20, fontWeight:700 }}>Continue Learning</h2>
              <Link to="/courses" style={{ fontSize:14, fontWeight:700, color:'var(--primary)' }}>Browse all →</Link>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:24 }}>
              {inProgress.map(e => (
                <CourseCard key={e._id} course={e.course} enrollment={e} />
              ))}
            </div>
          </div>
        )}

        {/* Completed */}
        {completed.length > 0 && (
          <div style={{ marginBottom:48 }}>
            <h2 style={{ fontSize:20, fontWeight:700, marginBottom:24 }}>Completed Courses</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:24 }}>
              {completed.map(e => (
                <div key={e._id} style={{ position:'relative' }}>
                  <CourseCard course={e.course} enrollment={e} />
                  <div style={{ position:'absolute', top:12, left:12,
                    background:'var(--primary)', color:'white',
                    borderRadius:9999, padding:'4px 12px', fontSize:11, fontWeight:800,
                    display:'flex', alignItems:'center', gap:6 }}>
                    <span className="material-symbols-outlined" style={{ fontSize:14 }}>verified</span>
                    Completed
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {enrollments.length === 0 && !loading && (
          <div className="glass-card" style={{ borderRadius:28, padding:64, textAlign:'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize:80, color:'var(--primary-container)', marginBottom:20, display:'block' }}>school</span>
            <h3 style={{ fontSize:22, fontWeight:700, marginBottom:12 }}>Start your journey</h3>
            <p style={{ color:'var(--outline)', marginBottom:28, fontSize:16 }}>Browse our curriculum and enroll in your first course.</p>
            <Link to="/courses" style={{ background:'var(--primary)', color:'white',
              padding:'14px 32px', borderRadius:14, fontWeight:700, fontSize:14, display:'inline-block' }}>
              Browse Courses
            </Link>
          </div>
        )}

        {loading && (
          <div style={{ display:'flex', justifyContent:'center', padding:60 }}>
            <div className="spinner" />
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;
