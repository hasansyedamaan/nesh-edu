import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../api/axios';

const InstructorCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => api.get('/courses/mine').then(r => setCourses(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const togglePublish = async (id) => {
    await api.put(`/courses/${id}/publish`);
    load();
  };

  const deleteCourse = async (id) => {
    if (!window.confirm('Delete this course? This cannot be undone.')) return;
    await api.delete(`/courses/${id}`);
    load();
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:40 }}>
          <h1 style={{ fontSize:28, fontWeight:800 }}>My Courses</h1>
          <Link to="/instructor/courses/create"
            style={{ display:'flex', alignItems:'center', gap:8, background:'var(--primary)', color:'white',
              padding:'14px 24px', borderRadius:14, fontWeight:700, fontSize:14 }}>
            <span className="material-symbols-outlined" style={{ fontSize:20 }}>add</span>Create Course
          </Link>
        </div>

        {loading ? <div style={{ display:'flex', justifyContent:'center', padding:60 }}><div className="spinner"/></div> : (
          courses.length === 0 ? (
            <div className="glass-card" style={{ borderRadius:24, padding:60, textAlign:'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize:64, color:'var(--primary-container)', display:'block', marginBottom:16 }}>library_books</span>
              <h3 style={{ fontSize:20, fontWeight:700, marginBottom:10 }}>No courses yet</h3>
              <Link to="/instructor/courses/create"
                style={{ background:'var(--primary)', color:'white', padding:'14px 28px', borderRadius:12, fontWeight:700, display:'inline-block' }}>
                Create your first course
              </Link>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:24 }}>
              {courses.map(c => (
                <div key={c._id} className="glass-card" style={{ borderRadius:22, overflow:'hidden' }}>
                  <div style={{ aspectRatio:'16/9', background:'var(--primary-container)', overflow:'hidden', position:'relative' }}>
                    {c.thumbnail
                      ? <img src={c.thumbnail} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                      : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center' }}>
                          <span className="material-symbols-outlined" style={{ fontSize:52, color:'var(--on-primary-container)', opacity:0.35 }}>school</span>
                        </div>}
                    <span style={{ position:'absolute', top:10, right:10, fontSize:11, fontWeight:800,
                      padding:'4px 12px', borderRadius:9999, letterSpacing:'0.06em',
                      background: c.isPublished ? 'rgba(37,105,88,0.9)' : 'rgba(0,0,0,0.6)',
                      color:'white', textTransform:'uppercase' }}>
                      {c.isPublished ? 'Live' : 'Draft'}
                    </span>
                  </div>
                  <div style={{ padding:20 }}>
                    <h3 style={{ fontWeight:700, fontSize:15, marginBottom:6, lineHeight:1.4 }}>{c.title}</h3>
                    <div style={{ display:'flex', gap:12, marginBottom:16 }}>
                      <span style={{ fontSize:12, color:'var(--outline)' }}>{c.category}</span>
                      <span style={{ fontSize:12, color:'var(--outline)' }}>•</span>
                      <span style={{ fontSize:12, color:'var(--outline)' }}>{c.level}</span>
                      <span style={{ fontSize:12, color:'var(--outline)' }}>•</span>
                      <span style={{ fontSize:12, color:'var(--outline)', display:'flex', alignItems:'center', gap:3 }}>
                        <span className="material-symbols-outlined" style={{ fontSize:13 }}>people</span>{c.enrollmentCount}
                      </span>
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
                      <Link to={`/instructor/courses/${c._id}/edit`}
                        style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:4,
                          padding:'9px', borderRadius:10, background:'var(--surface-container-low)',
                          border:'1px solid var(--outline-variant)', fontSize:12, fontWeight:700, color:'var(--on-surface-variant)' }}>
                        <span className="material-symbols-outlined" style={{ fontSize:15 }}>edit</span>Edit
                      </Link>
                      <button onClick={() => togglePublish(c._id)}
                        style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:4,
                          padding:'9px', borderRadius:10, cursor:'pointer', fontSize:12, fontWeight:700,
                          background: c.isPublished ? 'var(--error-container)' : 'rgba(152,219,198,0.2)',
                          color: c.isPublished ? 'var(--on-error-container)' : 'var(--primary)',
                          border: c.isPublished ? '1px solid var(--error-container)' : '1px solid rgba(152,219,198,0.4)' }}>
                        <span className="material-symbols-outlined" style={{ fontSize:15 }}>
                          {c.isPublished ? 'unpublished' : 'publish'}
                        </span>
                        {c.isPublished ? 'Unpublish' : 'Publish'}
                      </button>
                      <button onClick={() => deleteCourse(c._id)}
                        style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:4,
                          padding:'9px', borderRadius:10, cursor:'pointer', fontSize:12, fontWeight:700,
                          background:'var(--error-container)', color:'var(--on-error-container)',
                          border:'1px solid var(--error-container)' }}>
                        <span className="material-symbols-outlined" style={{ fontSize:15 }}>delete</span>Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </main>
    </div>
  );
};

export default InstructorCourses;
