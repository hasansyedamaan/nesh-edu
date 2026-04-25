import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../api/axios';

const CATEGORIES = ['Core Logic','Neural Nets','System Integrity','Synthesis','Programming','Data Science','AI/ML','Web Development','Other'];
const LEVELS = ['Beginner','Intermediate','Advanced'];

const CourseCreator = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title:'', description:'', shortDescription:'', category:'Core Logic', level:'Beginner', price:0, tags:'' });
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) { setThumbnail(f); setPreview(URL.createObjectURL(f)); }
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => fd.append(k, v));
      if (thumbnail) fd.append('thumbnail', thumbnail);
      const r = await api.post('/courses', fd, { headers:{ 'Content-Type':'multipart/form-data' } });
      navigate(`/instructor/courses/${r.data._id}/edit`);
    } catch(e) { setError(e.response?.data?.message || 'Failed to create course.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:40 }}>
          <button onClick={() => navigate(-1)}
            style={{ display:'flex', alignItems:'center', gap:6, padding:'10px 16px', borderRadius:10,
              background:'var(--surface-container-low)', border:'1px solid var(--outline-variant)',
              fontSize:14, fontWeight:600, cursor:'pointer', color:'var(--on-surface-variant)' }}>
            <span className="material-symbols-outlined" style={{ fontSize:18 }}>arrow_back</span>Back
          </button>
          <h1 style={{ fontSize:26, fontWeight:800 }}>Create New Course</h1>
        </div>

        {error && <div style={{ background:'var(--error-container)', color:'var(--on-error-container)',
          padding:'14px 18px', borderRadius:12, marginBottom:24, fontSize:14, fontWeight:600 }}>{error}</div>}

        <form onSubmit={submit}>
          <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:28, alignItems:'start' }}>
            <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
              {/* Title */}
              <div className="glass-card" style={{ borderRadius:20, padding:28 }}>
                <h3 style={{ fontWeight:700, fontSize:16, marginBottom:20 }}>Course Information</h3>
                {[
                  { name:'title', label:'Course Title', type:'text', placeholder:'e.g. Core Logic: Data Structures & Algorithms', required:true },
                  { name:'shortDescription', label:'Short Description', type:'text', placeholder:'One-line summary (max 300 chars)' },
                ].map(({ name, label, type, placeholder, required }) => (
                  <div key={name} style={{ marginBottom:20 }}>
                    <label style={{ fontSize:13, fontWeight:700, color:'var(--on-surface-variant)', display:'block', marginBottom:8 }}>{label}</label>
                    <input name={name} type={type} value={form[name]} onChange={handle}
                      className="input-field" placeholder={placeholder} required={required} />
                  </div>
                ))}
                <div>
                  <label style={{ fontSize:13, fontWeight:700, color:'var(--on-surface-variant)', display:'block', marginBottom:8 }}>Full Description</label>
                  <textarea name="description" value={form.description} onChange={handle}
                    className="input-field" placeholder="Describe what students will learn..." required rows={5}
                    style={{ resize:'vertical', minHeight:120 }} />
                </div>
              </div>

              {/* Meta */}
              <div className="glass-card" style={{ borderRadius:20, padding:28 }}>
                <h3 style={{ fontWeight:700, fontSize:16, marginBottom:20 }}>Course Details</h3>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20 }}>
                  <div>
                    <label style={{ fontSize:13, fontWeight:700, color:'var(--on-surface-variant)', display:'block', marginBottom:8 }}>Category</label>
                    <select name="category" value={form.category} onChange={handle} className="input-field">
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize:13, fontWeight:700, color:'var(--on-surface-variant)', display:'block', marginBottom:8 }}>Level</label>
                    <select name="level" value={form.level} onChange={handle} className="input-field">
                      {LEVELS.map(l => <option key={l}>{l}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
                  <div>
                    <label style={{ fontSize:13, fontWeight:700, color:'var(--on-surface-variant)', display:'block', marginBottom:8 }}>Price (USD)</label>
                    <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handle}
                      className="input-field" placeholder="0 for free" />
                  </div>
                  <div>
                    <label style={{ fontSize:13, fontWeight:700, color:'var(--on-surface-variant)', display:'block', marginBottom:8 }}>Tags (comma separated)</label>
                    <input name="tags" type="text" value={form.tags} onChange={handle}
                      className="input-field" placeholder="react, javascript, web" />
                  </div>
                </div>
              </div>
            </div>

            {/* Thumbnail + Submit */}
            <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
              <div className="glass-card" style={{ borderRadius:20, padding:24 }}>
                <h3 style={{ fontWeight:700, fontSize:15, marginBottom:16 }}>Thumbnail</h3>
                <label style={{ display:'block', cursor:'pointer' }}>
                  <div style={{ aspectRatio:'16/9', borderRadius:14, overflow:'hidden', background:'var(--surface-container)',
                    border:'2px dashed var(--outline-variant)', display:'flex', alignItems:'center',
                    justifyContent:'center', marginBottom:12, position:'relative' }}>
                    {preview
                      ? <img src={preview} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                      : <div style={{ textAlign:'center', color:'var(--outline)' }}>
                          <span className="material-symbols-outlined" style={{ fontSize:40, display:'block', marginBottom:8 }}>add_photo_alternate</span>
                          <p style={{ fontSize:13, fontWeight:600 }}>Click to upload image</p>
                          <p style={{ fontSize:11 }}>PNG, JPG, WEBP</p>
                        </div>}
                  </div>
                  <input type="file" accept="image/*" onChange={handleFile} style={{ display:'none' }} />
                </label>
              </div>

              <div className="glass-card" style={{ borderRadius:20, padding:24 }}>
                <button type="submit" disabled={loading}
                  style={{ width:'100%', padding:'16px', background:'var(--primary)', color:'white',
                    borderRadius:14, fontWeight:700, fontSize:15, cursor:loading?'not-allowed':'pointer',
                    opacity:loading?0.7:1, marginBottom:12 }}>
                  {loading ? 'Creating...' : 'Create Course'}
                </button>
                <p style={{ fontSize:12, color:'var(--outline)', textAlign:'center', lineHeight:1.5 }}>
                  You can add modules and lessons after creation.
                </p>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CourseCreator;
