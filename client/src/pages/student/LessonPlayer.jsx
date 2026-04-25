import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';

const LessonPlayer = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get(`/courses/${courseId}/lessons/${lessonId}`),
      api.get(`/courses/${courseId}`),
      api.get(`/enrollments/course/${courseId}`).catch(() => ({ data: null }))
    ]).then(([lessonR, courseR, enrollR]) => {
      setLesson(lessonR.data);
      setCourse(courseR.data);
      setEnrollment(enrollR.data);
    }).finally(() => setLoading(false));
  }, [courseId, lessonId]);

  const markComplete = async () => {
    if (marking || !enrollment) return;
    setMarking(true);
    try {
      const r = await api.put('/enrollments/complete-lesson', { courseId, lessonId });
      setEnrollment(r.data);
    } finally { setMarking(false); }
  };

  const allLessons = course?.modules?.flatMap(m => m.lessons || []) || [];
  const currentIdx = allLessons.findIndex(l => l._id === lessonId);
  const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null;
  const nextLesson = currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;
  const isCompleted = enrollment?.completedLessons?.includes(lessonId);

  if (loading) return <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh' }}><div className="spinner"/></div>;
  if (!lesson) return <div style={{ textAlign:'center', padding:80 }}>Lesson not found.</div>;

  return (
    <div style={{ display:'flex', height:'100vh', background:'#0f1115', overflow:'hidden' }}>
      {/* Sidebar */}
      {sidebarOpen && (
        <div style={{ width:340, background:'rgba(255,255,255,0.04)', backdropFilter:'blur(20px)',
          borderRight:'1px solid rgba(255,255,255,0.08)', display:'flex', flexDirection:'column',
          overflow:'hidden', flexShrink:0 }}>
          {/* Header */}
          <div style={{ padding:'20px 20px', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
            <Link to={`/courses/${courseId}`}
              style={{ display:'flex', alignItems:'center', gap:8, color:'rgba(255,255,255,0.5)',
                fontSize:13, fontWeight:600, marginBottom:12 }}>
              <span className="material-symbols-outlined" style={{ fontSize:16 }}>arrow_back</span>
              Back to Course
            </Link>
            <h2 style={{ color:'white', fontSize:15, fontWeight:700, lineHeight:1.4 }}>{course?.title}</h2>
            {enrollment && (
              <div style={{ marginTop:12 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                  <span style={{ fontSize:11, color:'rgba(255,255,255,0.4)', fontWeight:600 }}>Progress</span>
                  <span style={{ fontSize:11, color:'var(--primary-container)', fontWeight:800 }}>{enrollment.progress}%</span>
                </div>
                <div style={{ height:4, background:'rgba(255,255,255,0.1)', borderRadius:9999 }}>
                  <div style={{ height:'100%', background:'var(--primary-container)', borderRadius:9999, width:`${enrollment.progress}%`, transition:'width 1s' }} />
                </div>
              </div>
            )}
          </div>

          {/* Curriculum */}
          <div style={{ flex:1, overflowY:'auto', padding:'12px 0' }}>
            {course?.modules?.map((mod, mi) => (
              <div key={mod._id}>
                <div style={{ padding:'10px 20px', fontSize:11, fontWeight:800,
                  color:'rgba(255,255,255,0.35)', textTransform:'uppercase', letterSpacing:'0.1em' }}>
                  {mi + 1}. {mod.title}
                </div>
                {mod.lessons?.map(l => {
                  const isActive = l._id === lessonId;
                  const isDone = enrollment?.completedLessons?.includes(l._id);
                  return (
                    <button key={l._id} onClick={() => navigate(`/learn/${courseId}/${l._id}`)}
                      style={{ width:'100%', padding:'12px 20px', display:'flex', alignItems:'center', gap:12,
                        cursor:'pointer', background: isActive ? 'rgba(152,219,198,0.12)' : 'transparent',
                        borderLeft: isActive ? '3px solid var(--primary-container)' : '3px solid transparent',
                        textAlign:'left', transition:'background 0.2s' }}
                      onMouseEnter={e=>{ if(!isActive) e.currentTarget.style.background='rgba(255,255,255,0.04)'; }}
                      onMouseLeave={e=>{ if(!isActive) e.currentTarget.style.background='transparent'; }}>
                      <span className="material-symbols-outlined" style={{ fontSize:18, flexShrink:0,
                        color: isDone ? 'var(--primary-container)' : isActive ? 'white' : 'rgba(255,255,255,0.3)' }}>
                        {isDone ? 'check_circle' : 'play_circle'}
                      </span>
                      <div style={{ flex:1, overflow:'hidden' }}>
                        <p style={{ fontSize:13, fontWeight: isActive ? 700 : 500,
                          color: isActive ? 'white' : 'rgba(255,255,255,0.6)',
                          whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{l.title}</p>
                        {l.duration > 0 && <p style={{ fontSize:11, color:'rgba(255,255,255,0.3)' }}>{l.duration} min</p>}
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main content */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        {/* Top bar */}
        <div style={{ padding:'14px 24px', background:'rgba(255,255,255,0.03)',
          borderBottom:'1px solid rgba(255,255,255,0.08)',
          display:'flex', alignItems:'center', gap:16, flexShrink:0 }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ background:'rgba(255,255,255,0.08)', border:'none', borderRadius:8,
              padding:'8px', cursor:'pointer', color:'rgba(255,255,255,0.6)', display:'flex' }}>
            <span className="material-symbols-outlined" style={{ fontSize:20 }}>menu</span>
          </button>
          <div style={{ flex:1 }}>
            <p style={{ color:'rgba(255,255,255,0.4)', fontSize:12, fontWeight:600 }}>{course?.title}</p>
            <p style={{ color:'white', fontSize:15, fontWeight:700 }}>{lesson.title}</p>
          </div>
          <div style={{ display:'flex', gap:12 }}>
            {prevLesson && (
              <Link to={`/learn/${courseId}/${prevLesson._id}`}
                style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 16px', borderRadius:10,
                  background:'rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.7)', fontSize:13, fontWeight:600 }}>
                <span className="material-symbols-outlined" style={{ fontSize:16 }}>arrow_back</span> Prev
              </Link>
            )}
            {nextLesson && (
              <Link to={`/learn/${courseId}/${nextLesson._id}`}
                style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 16px', borderRadius:10,
                  background:'var(--primary)', color:'white', fontSize:13, fontWeight:700 }}>
                Next <span className="material-symbols-outlined" style={{ fontSize:16 }}>arrow_forward</span>
              </Link>
            )}
          </div>
        </div>

        {/* Video / Content */}
        <div style={{ flex:1, overflowY:'auto', padding:'32px' }}>
          {lesson.videoUrl ? (
            <div className="video-player-wrap" style={{ maxWidth:900, margin:'0 auto 32px' }}>
              <video ref={videoRef} controls style={{ width:'100%', height:'100%' }}
                src={lesson.videoUrl} onEnded={markComplete}>
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <div style={{ maxWidth:900, margin:'0 auto 32px', aspectRatio:'16/9',
              background:'rgba(255,255,255,0.04)', borderRadius:20, display:'flex',
              alignItems:'center', justifyContent:'center', border:'2px dashed rgba(255,255,255,0.1)' }}>
              <div style={{ textAlign:'center', color:'rgba(255,255,255,0.3)' }}>
                <span className="material-symbols-outlined" style={{ fontSize:64, display:'block', marginBottom:12 }}>videocam_off</span>
                <p style={{ fontSize:16, fontWeight:600 }}>No video for this lesson</p>
              </div>
            </div>
          )}

          {/* Lesson content */}
          <div style={{ maxWidth:900, margin:'0 auto' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
              <h1 style={{ color:'white', fontSize:24, fontWeight:700 }}>{lesson.title}</h1>
              <button onClick={markComplete} disabled={isCompleted || marking || !enrollment}
                style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 20px',
                  borderRadius:12, fontWeight:700, fontSize:14, cursor: isCompleted ? 'default' : 'pointer',
                  background: isCompleted ? 'rgba(152,219,198,0.2)' : 'var(--primary)',
                  color: isCompleted ? 'var(--primary-container)' : 'white',
                  opacity: (marking || (!enrollment && !isCompleted)) ? 0.6 : 1 }}>
                <span className="material-symbols-outlined" style={{ fontSize:18 }}>
                  {isCompleted ? 'check_circle' : 'radio_button_unchecked'}
                </span>
                {isCompleted ? 'Completed' : marking ? 'Saving...' : 'Mark Complete'}
              </button>
            </div>

            {lesson.content && (
              <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:16, padding:'28px 32px',
                color:'rgba(255,255,255,0.8)', fontSize:16, lineHeight:1.8,
                whiteSpace:'pre-wrap', fontFamily:'Manrope, sans-serif' }}>
                {lesson.content}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPlayer;
