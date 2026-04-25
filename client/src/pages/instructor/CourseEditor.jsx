import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../api/axios';

const CATEGORIES = ['Core Logic','Neural Nets','System Integrity','Synthesis','Programming','Data Science','AI/ML','Web Development','Other'];
const LEVELS = ['Beginner','Intermediate','Advanced'];

const CourseEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(null);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [addingModule, setAddingModule] = useState(false);
  const [lessonForms, setLessonForms] = useState({});
  const [uploadingLesson, setUploadingLesson] = useState({});
  const [activeTab, setActiveTab] = useState('details');
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const load = async () => {
    const r = await api.get(`/courses/${id}`);
    setCourse(r.data);
    setModules(r.data.modules || []);
    setPreview(r.data.thumbnail || null);
    setLoading(false);
  };
  useEffect(() => { load(); }, [id]);

  const handleCourseChange = e => setCourse(p => ({ ...p, [e.target.name]: e.target.value }));
  const handleFile = (e) => { const f = e.target.files[0]; if(f){ setThumbnail(f); setPreview(URL.createObjectURL(f)); } };

  const saveCourse = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      ['title','description','shortDescription','category','level','price','tags'].forEach(k => {
        if (course[k] !== undefined) fd.append(k, course[k]);
      });
      if (thumbnail) fd.append('thumbnail', thumbnail);
      await api.put(`/courses/${id}`, fd, { headers:{ 'Content-Type':'multipart/form-data' } });
      showToast('✅ Course saved!');
    } catch { showToast('❌ Failed to save.'); }
    finally { setSaving(false); }
  };

  const addModule = async () => {
    if (!newModuleTitle.trim()) return;
    setAddingModule(true);
    try {
      const r = await api.post(`/courses/${id}/modules`, { title: newModuleTitle });
      setModules(p => [...p, { ...r.data, lessons:[] }]);
      setNewModuleTitle('');
      showToast('✅ Module added!');
    } finally { setAddingModule(false); }
  };

  const addLesson = async (moduleId) => {
    const lf = lessonForms[moduleId] || {};
    if (!lf.title) return;
    setUploadingLesson(p => ({ ...p, [moduleId]: true }));
    try {
      const fd = new FormData();
      fd.append('title', lf.title);
      if (lf.content) fd.append('content', lf.content);
      if (lf.duration) fd.append('duration', lf.duration);
      if (lf.isFree) fd.append('isFree', 'true');
      if (lf.video) fd.append('video', lf.video);
      const r = await api.post(`/courses/${id}/modules/${moduleId}/lessons`, fd, { headers:{ 'Content-Type':'multipart/form-data' } });
      setModules(p => p.map(m => m._id === moduleId ? { ...m, lessons:[...(m.lessons||[]), r.data] } : m));
      setLessonForms(p => ({ ...p, [moduleId]: {} }));
      showToast('✅ Lesson added!');
    } catch { showToast('❌ Failed to add lesson.'); }
    finally { setUploadingLesson(p => ({ ...p, [moduleId]: false })); }
  };

  const deleteLesson = async (moduleId, lessonId) => {
    if (!window.confirm('Delete this lesson?')) return;
    await api.delete(`/courses/${id}/lessons/${lessonId}`);
    setModules(p => p.map(m => m._id === moduleId ? { ...m, lessons: m.lessons.filter(l => l._id !== lessonId) } : m));
    showToast('🗑️ Lesson deleted.');
  };

  const togglePublish = async () => {
    const r = await api.put(`/courses/${id}/publish`);
    setCourse(p => ({ ...p, isPublished: r.data.isPublished }));
    showToast(r.data.isPublished ? '✅ Course published!' : 'Course unpublished.');
  };

  if (loading) return <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh' }}><div className="spinner"/></div>;

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        {/* Toast */}
        {toast && <div className="toast success" style={{ bottom:24, right:24 }}>{toast}</div>}

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:32 }}>
          <button onClick={() => navigate('/instructor/courses')}
            style={{ display:'flex', alignItems:'center', gap:6, padding:'10px 16px', borderRadius:10,
              background:'var(--surface-container-low)', border:'1px solid var(--outline-variant)',
              fontSize:14, fontWeight:600, cursor:'pointer', color:'var(--on-surface-variant)' }}>
            <span className="material-symbols-outlined" style={{ fontSize:18 }}>arrow_back</span>Back
          </button>
          <div style={{ flex:1 }}>
            <h1 style={{ fontSize:22, fontWeight:800 }}>{course.title}</h1>
            <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:9999,
              background: course.isPublished ? 'rgba(152,219,198,0.2)' : 'var(--surface-container-high)',
              color: course.isPublished ? 'var(--primary)' : 'var(--outline)',
              textTransform:'uppercase', letterSpacing:'0.06em' }}>
              {course.isPublished ? '● Live' : '○ Draft'}
            </span>
          </div>
          <button onClick={togglePublish}
            style={{ padding:'12px 22px', borderRadius:12, fontWeight:700, fontSize:14, cursor:'pointer',
              background: course.isPublished ? 'var(--error-container)' : 'var(--primary)',
              color: course.isPublished ? 'var(--on-error-container)' : 'white' }}>
            {course.isPublished ? 'Unpublish' : 'Publish Course'}
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:4, marginBottom:32, background:'var(--surface-container-low)',
          padding:6, borderRadius:14, width:'fit-content' }}>
          {[['details','Details'],['curriculum','Curriculum']].map(([tab,label]) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ padding:'10px 24px', borderRadius:10, fontWeight:700, fontSize:14, cursor:'pointer',
                background: activeTab===tab ? 'white' : 'transparent',
                color: activeTab===tab ? 'var(--primary)' : 'var(--outline)',
                boxShadow: activeTab===tab ? '0 2px 8px rgba(0,0,0,0.08)' : 'none' }}>
              {label}
            </button>
          ))}
        </div>

        {activeTab === 'details' && (
          <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:28 }}>
            <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
              <div className="glass-card" style={{ borderRadius:20, padding:28 }}>
                <h3 style={{ fontWeight:700, marginBottom:20 }}>Course Information</h3>
                {[
                  { name:'title', label:'Title', type:'text' },
                  { name:'shortDescription', label:'Short Description', type:'text' },
                ].map(({ name, label, type }) => (
                  <div key={name} style={{ marginBottom:18 }}>
                    <label style={{ fontSize:13, fontWeight:700, color:'var(--on-surface-variant)', display:'block', marginBottom:8 }}>{label}</label>
                    <input name={name} type={type} value={course[name]||''} onChange={handleCourseChange} className="input-field" />
                  </div>
                ))}
                <div>
                  <label style={{ fontSize:13, fontWeight:700, color:'var(--on-surface-variant)', display:'block', marginBottom:8 }}>Description</label>
                  <textarea name="description" value={course.description||''} onChange={handleCourseChange}
                    className="input-field" rows={5} style={{ resize:'vertical' }} />
                </div>
              </div>
              <div className="glass-card" style={{ borderRadius:20, padding:28 }}>
                <h3 style={{ fontWeight:700, marginBottom:20 }}>Details</h3>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:18 }}>
                  {[
                    { name:'category', label:'Category', type:'select', options:CATEGORIES },
                    { name:'level', label:'Level', type:'select', options:LEVELS },
                    { name:'price', label:'Price ($)', type:'number' },
                    { name:'tags', label:'Tags', type:'text' },
                  ].map(({ name, label, type, options }) => (
                    <div key={name}>
                      <label style={{ fontSize:13, fontWeight:700, color:'var(--on-surface-variant)', display:'block', marginBottom:8 }}>{label}</label>
                      {type === 'select'
                        ? <select name={name} value={course[name]||''} onChange={handleCourseChange} className="input-field">
                            {options.map(o => <option key={o}>{o}</option>)}
                          </select>
                        : <input name={name} type={type} value={course[name]||''} onChange={handleCourseChange} className="input-field" />}
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={saveCourse} disabled={saving}
                style={{ padding:'16px', background:'var(--primary)', color:'white',
                  borderRadius:14, fontWeight:700, fontSize:15, cursor:saving?'not-allowed':'pointer', opacity:saving?0.7:1 }}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

            <div className="glass-card" style={{ borderRadius:20, padding:24, height:'fit-content' }}>
              <h3 style={{ fontWeight:700, marginBottom:16 }}>Thumbnail</h3>
              <label style={{ cursor:'pointer', display:'block' }}>
                <div style={{ aspectRatio:'16/9', borderRadius:12, overflow:'hidden', background:'var(--surface-container)',
                  border:'2px dashed var(--outline-variant)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  {preview
                    ? <img src={preview} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                    : <div style={{ textAlign:'center', color:'var(--outline)' }}>
                        <span className="material-symbols-outlined" style={{ fontSize:36, display:'block' }}>add_photo_alternate</span>
                        <p style={{ fontSize:13, fontWeight:600 }}>Upload thumbnail</p>
                      </div>}
                </div>
                <input type="file" accept="image/*" onChange={handleFile} style={{ display:'none' }} />
              </label>
            </div>
          </div>
        )}

        {activeTab === 'curriculum' && (
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            {modules.map((mod) => (
              <div key={mod._id} className="glass-card" style={{ borderRadius:20, overflow:'hidden' }}>
                <div style={{ padding:'18px 24px', background:'var(--surface-container-low)',
                  borderBottom:'1px solid var(--surface-container)', display:'flex', alignItems:'center', gap:12 }}>
                  <span className="material-symbols-outlined" style={{ color:'var(--primary)' }}>folder</span>
                  <h3 style={{ fontWeight:700, fontSize:16, flex:1 }}>{mod.title}</h3>
                  <span style={{ fontSize:13, color:'var(--outline)' }}>{mod.lessons?.length || 0} lessons</span>
                </div>

                {/* Lessons */}
                <div>
                  {mod.lessons?.map(l => (
                    <div key={l._id} style={{ padding:'14px 24px', display:'flex', alignItems:'center', gap:12,
                      borderBottom:'1px solid var(--surface-container-low)' }}>
                      <span className="material-symbols-outlined" style={{ fontSize:18, color: l.videoUrl ? 'var(--primary)' : 'var(--outline)' }}>
                        {l.videoUrl ? 'play_circle' : 'article'}
                      </span>
                      <div style={{ flex:1 }}>
                        <p style={{ fontSize:14, fontWeight:600 }}>{l.title}</p>
                        <div style={{ display:'flex', gap:10 }}>
                          {l.duration > 0 && <span style={{ fontSize:11, color:'var(--outline)' }}>{l.duration} min</span>}
                          {l.isFree && <span style={{ fontSize:11, fontWeight:700, color:'var(--primary)', background:'rgba(152,219,198,0.15)', padding:'1px 8px', borderRadius:9999 }}>FREE</span>}
                          {l.videoUrl && <span style={{ fontSize:11, color:'var(--secondary)' }}>Has video</span>}
                        </div>
                      </div>
                      <button onClick={() => deleteLesson(mod._id, l._id)}
                        style={{ padding:'6px 12px', borderRadius:8, background:'var(--error-container)',
                          color:'var(--on-error-container)', fontSize:12, fontWeight:700, cursor:'pointer' }}>
                        Delete
                      </button>
                    </div>
                  ))}

                  {/* Add lesson form */}
                  <div style={{ padding:'20px 24px', background:'rgba(152,219,198,0.04)' }}>
                    <p style={{ fontSize:13, fontWeight:700, marginBottom:14, color:'var(--outline)' }}>Add Lesson</p>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
                      <input placeholder="Lesson title *" value={lessonForms[mod._id]?.title||''} className="input-field"
                        onChange={e => setLessonForms(p => ({ ...p, [mod._id]:{ ...(p[mod._id]||{}), title:e.target.value } }))}
                        style={{ fontSize:13, padding:'10px 14px' }} />
                      <input type="number" placeholder="Duration (min)" value={lessonForms[mod._id]?.duration||''} className="input-field"
                        onChange={e => setLessonForms(p => ({ ...p, [mod._id]:{ ...(p[mod._id]||{}), duration:e.target.value } }))}
                        style={{ fontSize:13, padding:'10px 14px' }} />
                    </div>
                    <textarea placeholder="Lesson content / notes" value={lessonForms[mod._id]?.content||''} className="input-field"
                      rows={3} style={{ fontSize:13, padding:'10px 14px', resize:'vertical', marginBottom:12, width:'100%' }}
                      onChange={e => setLessonForms(p => ({ ...p, [mod._id]:{ ...(p[mod._id]||{}), content:e.target.value } }))} />
                    <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                      <label style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, fontWeight:700, cursor:'pointer',
                        padding:'9px 16px', borderRadius:10, background:'var(--surface-container-low)', border:'1px solid var(--outline-variant)' }}>
                        <span className="material-symbols-outlined" style={{ fontSize:18, color:'var(--secondary)' }}>video_file</span>
                        {lessonForms[mod._id]?.videoName || 'Upload Video'}
                        <input type="file" accept="video/*" style={{ display:'none' }}
                          onChange={e => { const f=e.target.files[0]; if(f) setLessonForms(p=>({...p,[mod._id]:{...(p[mod._id]||{}),video:f,videoName:f.name}})); }} />
                      </label>
                      <label style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, fontWeight:700, cursor:'pointer' }}>
                        <input type="checkbox" checked={lessonForms[mod._id]?.isFree||false}
                          onChange={e => setLessonForms(p => ({ ...p, [mod._id]:{ ...(p[mod._id]||{}), isFree:e.target.checked } }))} />
                        Free preview
                      </label>
                      <button onClick={() => addLesson(mod._id)} disabled={uploadingLesson[mod._id]}
                        style={{ padding:'9px 20px', borderRadius:10, background:'var(--primary)', color:'white',
                          fontWeight:700, fontSize:13, cursor:'pointer', opacity:uploadingLesson[mod._id]?0.7:1 }}>
                        {uploadingLesson[mod._id] ? 'Uploading...' : '+ Add Lesson'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Add module */}
            <div className="glass-card" style={{ borderRadius:20, padding:24 }}>
              <h3 style={{ fontWeight:700, marginBottom:16 }}>Add New Module</h3>
              <div style={{ display:'flex', gap:12 }}>
                <input value={newModuleTitle} onChange={e=>setNewModuleTitle(e.target.value)}
                  className="input-field" placeholder="Module title, e.g. Introduction to Algorithms" style={{ flex:1 }} />
                <button onClick={addModule} disabled={addingModule}
                  style={{ padding:'0 24px', background:'var(--primary)', color:'white',
                    borderRadius:12, fontWeight:700, fontSize:14, cursor:'pointer', whiteSpace:'nowrap' }}>
                  {addingModule ? '...' : '+ Add Module'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CourseEditor;
