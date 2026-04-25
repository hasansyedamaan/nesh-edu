import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../api/axios';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const load = () => {
    setLoading(true);
    const params = search ? `?search=${search}&limit=50` : '?limit=50';
    api.get(`/courses${params}`).then(r => setCourses(r.data.courses)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);
  useEffect(() => { const t = setTimeout(load, 400); return ()=>clearTimeout(t); }, [search]);

  const togglePublish = async (id) => {
    const r = await api.put(`/courses/${id}/publish`);
    setCourses(p => p.map(c => c._id === id ? { ...c, isPublished:r.data.isPublished } : c));
    showToast(r.data.isPublished ? '✅ Course published' : 'Course unpublished');
  };

  const deleteCourse = async (id) => {
    if (!window.confirm('Delete this course permanently?')) return;
    await api.delete(`/courses/${id}`);
    setCourses(p => p.filter(c => c._id !== id));
    showToast('🗑️ Course deleted');
  };

  const categoryColors = {
    'Core Logic':{ bg:'rgba(152,219,198,0.2)', color:'#1c6251' },
    'Neural Nets':{ bg:'rgba(206,201,255,0.2)', color:'#565381' },
    'System Integrity':{ bg:'rgba(245,195,179,0.2)', color:'#744e42' },
    'Synthesis':{ bg:'rgba(179,229,252,0.2)', color:'#01579b' },
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        {toast && <div className="toast success">{toast}</div>}

        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:32 }}>
          <div>
            <h1 style={{ fontSize:28, fontWeight:800, marginBottom:6 }}>Course Management</h1>
            <p style={{ color:'var(--on-surface-variant)' }}>{courses.length} courses on platform</p>
          </div>
        </div>

        <div style={{ position:'relative', maxWidth:400, marginBottom:28 }}>
          <span className="material-symbols-outlined" style={{ position:'absolute', left:14, top:'50%',
            transform:'translateY(-50%)', color:'var(--outline)', fontSize:20, pointerEvents:'none' }}>search</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} className="input-field"
            placeholder="Search courses..." style={{ paddingLeft:46 }} />
        </div>

        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', padding:60 }}><div className="spinner"/></div>
        ) : (
          <div className="glass-card" style={{ borderRadius:24, overflow:'hidden' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:14 }}>
              <thead>
                <tr style={{ background:'var(--surface-container-low)' }}>
                  {['Course','Instructor','Category','Students','Status','Actions'].map(h => (
                    <th key={h} style={{ padding:'14px 20px', textAlign:'left', fontSize:12,
                      fontWeight:800, color:'var(--outline)', letterSpacing:'0.06em', textTransform:'uppercase',
                      borderBottom:'1px solid var(--surface-container)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {courses.map((c, i) => {
                  const chip = categoryColors[c.category] || { bg:'var(--surface-container)', color:'var(--outline)' };
                  return (
                    <tr key={c._id} style={{ background: i%2===0?'transparent':'rgba(247,249,251,0.5)' }}
                      onMouseEnter={e=>e.currentTarget.style.background='rgba(152,219,198,0.05)'}
                      onMouseLeave={e=>e.currentTarget.style.background=i%2===0?'transparent':'rgba(247,249,251,0.5)'}>
                      <td style={{ padding:'14px 20px', maxWidth:280 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                          <div style={{ width:48, height:32, borderRadius:8, overflow:'hidden', flexShrink:0,
                            background:'var(--primary-container)' }}>
                            {c.thumbnail
                              ? <img src={c.thumbnail} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                              : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center' }}>
                                  <span className="material-symbols-outlined" style={{ fontSize:16, color:'var(--on-primary-container)', opacity:0.5 }}>school</span>
                                </div>}
                          </div>
                          <span style={{ fontWeight:700, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:200 }}>{c.title}</span>
                        </div>
                      </td>
                      <td style={{ padding:'14px 20px', color:'var(--outline)', fontSize:13 }}>{c.instructor?.name}</td>
                      <td style={{ padding:'14px 20px' }}>
                        <span style={{ ...chip, padding:'4px 10px', borderRadius:9999, fontSize:11, fontWeight:700 }}>{c.category}</span>
                      </td>
                      <td style={{ padding:'14px 20px', fontWeight:700 }}>{c.enrollmentCount}</td>
                      <td style={{ padding:'14px 20px' }}>
                        <span style={{ fontSize:11, fontWeight:800, padding:'4px 12px', borderRadius:9999,
                          textTransform:'uppercase', letterSpacing:'0.06em',
                          background: c.isPublished ? 'rgba(152,219,198,0.2)' : 'var(--surface-container-high)',
                          color: c.isPublished ? 'var(--primary)' : 'var(--outline)' }}>
                          {c.isPublished ? 'Live' : 'Draft'}
                        </span>
                      </td>
                      <td style={{ padding:'14px 20px' }}>
                        <div style={{ display:'flex', gap:8 }}>
                          <Link to={`/courses/${c._id}`}
                            style={{ padding:'6px 12px', borderRadius:8, background:'var(--surface-container-low)',
                              border:'1px solid var(--outline-variant)', fontSize:12, fontWeight:700, color:'var(--on-surface-variant)' }}>
                            View
                          </Link>
                          <button onClick={() => togglePublish(c._id)}
                            style={{ padding:'6px 12px', borderRadius:8, fontSize:12, fontWeight:700, cursor:'pointer',
                              background: c.isPublished ? 'rgba(186,26,26,0.1)' : 'rgba(152,219,198,0.2)',
                              color: c.isPublished ? 'var(--error)' : 'var(--primary)',
                              border: 'none' }}>
                            {c.isPublished ? 'Unpublish' : 'Publish'}
                          </button>
                          <button onClick={() => deleteCourse(c._id)}
                            style={{ padding:'6px 12px', borderRadius:8, background:'var(--error-container)',
                              color:'var(--on-error-container)', fontSize:12, fontWeight:700, cursor:'pointer', border:'none' }}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {courses.length === 0 && (
              <div style={{ textAlign:'center', padding:48, color:'var(--outline)' }}>
                <span className="material-symbols-outlined" style={{ fontSize:48, display:'block', marginBottom:12 }}>search_off</span>
                No courses found.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminCourses;
