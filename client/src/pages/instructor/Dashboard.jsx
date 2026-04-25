import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../api/axios';

const InstructorDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/instructor/stats').then(r => setStats(r.data)).finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { icon:'library_books', label:'Total Courses',     value:stats.totalCourses,     color:'var(--primary)',   bg:'var(--primary-container)' },
    { icon:'published_with_changes', label:'Published', value:stats.publishedCourses, color:'var(--secondary)', bg:'var(--secondary-container)' },
    { icon:'people',        label:'Total Students',    value:stats.totalStudents,     color:'var(--tertiary)',  bg:'var(--tertiary-container)' },
    { icon:'pending_actions',label:'Drafts',           value:stats.totalCourses - stats.publishedCourses, color:'var(--outline)', bg:'var(--surface-container-high)' },
  ] : [];

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:40 }}>
          <div>
            <h1 style={{ fontSize:28, fontWeight:800, marginBottom:6 }}>Instructor Hub</h1>
            <p style={{ color:'var(--on-surface-variant)', fontSize:16 }}>Manage your courses and track student progress.</p>
          </div>
          <Link to="/instructor/courses/create"
            style={{ display:'flex', alignItems:'center', gap:8, background:'var(--primary)', color:'white',
              padding:'14px 24px', borderRadius:14, fontWeight:700, fontSize:14 }}
            onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(37,105,88,0.3)'; }}
            onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}>
            <span className="material-symbols-outlined" style={{ fontSize:20 }}>add</span>
            New Course
          </Link>
        </div>

        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', padding:60 }}><div className="spinner"/></div>
        ) : (
          <>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20, marginBottom:48 }}>
              {statCards.map(({ icon, label, value, color, bg }) => (
                <div key={label} className="stat-card">
                  <div style={{ width:48, height:48, borderRadius:14, background:bg,
                    display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16 }}>
                    <span className="material-symbols-outlined" style={{ color, fontSize:24 }}>{icon}</span>
                  </div>
                  <p style={{ fontSize:30, fontWeight:800, lineHeight:1 }}>{value}</p>
                  <p style={{ fontSize:13, color:'var(--outline)', fontWeight:600, marginTop:6 }}>{label}</p>
                </div>
              ))}
            </div>

            <h2 style={{ fontSize:20, fontWeight:700, marginBottom:24 }}>Your Courses</h2>
            {stats.courses?.length === 0 ? (
              <div className="glass-card" style={{ borderRadius:24, padding:60, textAlign:'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize:64, color:'var(--primary-container)', marginBottom:16, display:'block' }}>add_circle</span>
                <h3 style={{ fontSize:20, fontWeight:700, marginBottom:10 }}>No courses yet</h3>
                <p style={{ color:'var(--outline)', marginBottom:24 }}>Create your first course to start teaching.</p>
                <Link to="/instructor/courses/create"
                  style={{ background:'var(--primary)', color:'white', padding:'14px 28px', borderRadius:12, fontWeight:700, fontSize:14, display:'inline-block' }}>
                  Create Course
                </Link>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                {stats.courses.map(course => (
                  <div key={course._id} className="glass-card"
                    style={{ borderRadius:20, padding:'20px 24px', display:'flex', alignItems:'center', gap:20 }}>
                    <div style={{ width:80, height:56, borderRadius:12, overflow:'hidden', flexShrink:0,
                      background:'var(--primary-container)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      {course.thumbnail
                        ? <img src={course.thumbnail} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                        : <span className="material-symbols-outlined" style={{ color:'var(--on-primary-container)', opacity:0.5, fontSize:28 }}>school</span>}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
                        <h3 style={{ fontWeight:700, fontSize:15 }}>{course.title}</h3>
                        <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:9999,
                          background: course.isPublished ? 'rgba(152,219,198,0.2)' : 'var(--surface-container-high)',
                          color: course.isPublished ? 'var(--primary)' : 'var(--outline)',
                          textTransform:'uppercase', letterSpacing:'0.06em' }}>
                          {course.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <div style={{ display:'flex', gap:16 }}>
                        <span style={{ fontSize:12, color:'var(--outline)', display:'flex', alignItems:'center', gap:4 }}>
                          <span className="material-symbols-outlined" style={{ fontSize:14 }}>people</span>
                          {course.enrollmentCount} students
                        </span>
                        <span style={{ fontSize:12, color:'var(--outline)' }}>{course.category}</span>
                        <span style={{ fontSize:12, color:'var(--outline)' }}>{course.level}</span>
                      </div>
                    </div>
                    <div style={{ display:'flex', gap:10 }}>
                      <Link to={`/instructor/courses/${course._id}/edit`}
                        style={{ padding:'8px 16px', borderRadius:10, border:'1px solid var(--outline-variant)',
                          fontSize:13, fontWeight:700, color:'var(--on-surface-variant)',
                          display:'flex', alignItems:'center', gap:6 }}>
                        <span className="material-symbols-outlined" style={{ fontSize:16 }}>edit</span>Edit
                      </Link>
                      <Link to={`/courses/${course._id}`}
                        style={{ padding:'8px 16px', borderRadius:10, background:'var(--primary)',
                          fontSize:13, fontWeight:700, color:'white',
                          display:'flex', alignItems:'center', gap:6 }}>
                        <span className="material-symbols-outlined" style={{ fontSize:16 }}>visibility</span>View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default InstructorDashboard;
