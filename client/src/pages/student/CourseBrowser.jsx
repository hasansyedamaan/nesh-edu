import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import CourseCard from '../../components/CourseCard';
import api from '../../api/axios';

const categories = ['All','Core Logic','Neural Nets','System Integrity','Synthesis','Programming','Data Science','AI/ML','Web Development'];
const levels = ['All','Beginner','Intermediate','Advanced'];

const CourseBrowser = () => {
  const [courses, setCourses]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [category, setCategory] = useState('All');
  const [level, setLevel]       = useState('All');
  const [page, setPage]         = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit:12 });
      if (search) params.set('search', search);
      if (category !== 'All') params.set('category', category);
      if (level !== 'All') params.set('level', level);
      const r = await api.get(`/courses?${params}`);
      setCourses(r.data.courses);
      setTotalPages(r.data.pages);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchCourses(); }, [page, category, level]);
  useEffect(() => { const t = setTimeout(fetchCourses, 400); return ()=>clearTimeout(t); }, [search]);

  return (
    <div style={{ background:'var(--background)', minHeight:'100vh' }}>
      <Navbar />
      {/* Hero band */}
      <div style={{ background:'var(--primary)', padding:'120px 48px 60px', textAlign:'center', marginBottom:0 }}>
        <h1 style={{ color:'white', fontSize:'clamp(2rem,4vw,3rem)', fontWeight:800, marginBottom:16 }}>Curriculum Library</h1>
        <p style={{ color:'rgba(255,255,255,0.75)', fontSize:18, marginBottom:36 }}>Explore our curated knowledge ecosystem</p>
        <div style={{ maxWidth:560, margin:'0 auto', position:'relative' }}>
          <span className="material-symbols-outlined" style={{ position:'absolute', left:18, top:'50%',
            transform:'translateY(-50%)', color:'var(--outline)', fontSize:22 }}>search</span>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            style={{ width:'100%', padding:'16px 16px 16px 52px', borderRadius:14,
              border:'none', fontSize:16, fontFamily:'Manrope', outline:'none',
              boxShadow:'0 8px 32px rgba(0,0,0,0.12)' }}
            placeholder="Search courses..." />
        </div>
      </div>

      <div style={{ maxWidth:1400, margin:'0 auto', padding:'48px 48px 80px' }}>
        {/* Filters */}
        <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:40 }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => { setCategory(cat); setPage(1); }}
              style={{ padding:'8px 20px', borderRadius:9999, fontSize:13, fontWeight:700,
                cursor:'pointer', transition:'all 0.25s',
                background: category===cat ? 'var(--primary)' : 'white',
                color: category===cat ? 'white' : 'var(--on-surface-variant)',
                border: category===cat ? '2px solid var(--primary)' : '2px solid var(--outline-variant)' }}>
              {cat}
            </button>
          ))}
          <div style={{ width:1, background:'var(--outline-variant)', margin:'0 4px' }} />
          {levels.map(l => (
            <button key={l} onClick={() => { setLevel(l); setPage(1); }}
              style={{ padding:'8px 20px', borderRadius:9999, fontSize:13, fontWeight:700,
                cursor:'pointer', transition:'all 0.25s',
                background: level===l ? 'var(--secondary)' : 'white',
                color: level===l ? 'white' : 'var(--on-surface-variant)',
                border: level===l ? '2px solid var(--secondary)' : '2px solid var(--outline-variant)' }}>
              {l}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', padding:80 }}><div className="spinner" /></div>
        ) : courses.length === 0 ? (
          <div style={{ textAlign:'center', padding:80 }}>
            <span className="material-symbols-outlined" style={{ fontSize:64, color:'var(--outline)', marginBottom:16, display:'block' }}>search_off</span>
            <h3 style={{ fontSize:20, fontWeight:700, marginBottom:8 }}>No courses found</h3>
            <p style={{ color:'var(--outline)' }}>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:28 }}>
              {courses.map(c => <CourseCard key={c._id} course={c} />)}
            </div>
            {totalPages > 1 && (
              <div style={{ display:'flex', justifyContent:'center', gap:12, marginTop:48 }}>
                {Array.from({ length:totalPages }, (_,i) => i+1).map(p => (
                  <button key={p} onClick={() => setPage(p)}
                    style={{ width:40, height:40, borderRadius:10, fontWeight:700, fontSize:14, cursor:'pointer',
                      background: page===p ? 'var(--primary)' : 'white',
                      color: page===p ? 'white' : 'var(--on-surface)',
                      border: page===p ? '2px solid var(--primary)' : '2px solid var(--outline-variant)' }}>
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CourseBrowser;
