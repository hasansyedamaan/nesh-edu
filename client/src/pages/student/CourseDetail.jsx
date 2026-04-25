import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const CourseDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [activeModule, setActiveModule] = useState(0);

  useEffect(() => {
    api.get(`/courses/${id}`).then(r => setCourse(r.data)).finally(() => setLoading(false));
    if (user?.role === 'student') {
      api.get(`/enrollments/course/${id}`).then(r => setEnrollment(r.data)).catch(() => {});
    }
  }, [id, user]);

  const enroll = async () => {
    if (!user) return navigate('/login');
    setEnrolling(true);
    try {
      await api.post('/enrollments', { courseId: id });
      const r = await api.get(`/enrollments/course/${id}`);
      setEnrollment(r.data);
    } catch(e) { alert(e.response?.data?.message || 'Enrollment failed.'); }
    finally { setEnrolling(false); }
  };

  const firstLesson = course?.modules?.[0]?.lessons?.[0];
  const resumeLesson = enrollment?.lastAccessedLesson;

  if (loading) return <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh' }}><div className="spinner"/></div>;
  if (!course) return <div style={{ textAlign:'center', padding:80 }}>Course not found.</div>;

  const totalLessons = course.modules?.reduce((a, m) => a + (m.lessons?.length || 0), 0) || 0;
  const totalDuration = course.modules?.reduce((a, m) =>
    a + m.lessons?.reduce((b, l) => b + (l.duration || 0), 0), 0) || 0;

  const chipColors = {
    'Core Logic':{ bg:'rgba(152,219,198,0.2)', color:'#1c6251' },
    'Neural Nets':{ bg:'rgba(206,201,255,0.25)', color:'#565381' },
    'System Integrity':{ bg:'rgba(245,195,179,0.25)', color:'#744e42' },
    'Synthesis':{ bg:'rgba(179,229,252,0.25)', color:'#01579b' },
  };
  const chip = chipColors[course.category] || chipColors['Core Logic'];

  return (
    <div style={{ background:'var(--background)', minHeight:'100vh' }}>
      <Navbar />
      {/* Hero */}
      <div style={{ background:'linear-gradient(135deg, var(--primary) 0%, #191c1e 100%)',
        padding:'120px 48px 60px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 400px', gap:48, alignItems:'start' }}>
          <div>
            <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:20 }}>
              <span style={{ ...chip, padding:'6px 14px', borderRadius:9999, fontSize:12, fontWeight:700 }}>{course.category}</span>
              <span style={{ background:'rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.9)',
                padding:'6px 14px', borderRadius:9999, fontSize:12, fontWeight:700 }}>{course.level}</span>
            </div>
            <h1 style={{ color:'white', fontSize:'clamp(1.8rem,3.5vw,2.6rem)', fontWeight:800,
              lineHeight:1.2, marginBottom:20 }}>{course.title}</h1>
            <p style={{ color:'rgba(255,255,255,0.75)', fontSize:17, lineHeight:1.7, marginBottom:28, maxWidth:680 }}>
              {course.description}
            </p>
            <div style={{ display:'flex', gap:28, flexWrap:'wrap' }}>
              {[
                ['star', `${course.rating?.average?.toFixed(1) || '—'} rating`],
                ['people', `${course.enrollmentCount} students`],
                ['play_lesson', `${totalLessons} lessons`],
                ['schedule', `${Math.round(totalDuration/60)}h ${totalDuration%60}m`],
              ].map(([icon, text]) => (
                <div key={text} style={{ display:'flex', alignItems:'center', gap:8, color:'rgba(255,255,255,0.8)', fontSize:14, fontWeight:600 }}>
                  <span className="material-symbols-outlined" style={{ fontSize:18, color:'var(--primary-container)' }}>{icon}</span>
                  {text}
                </div>
              ))}
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginTop:24 }}>
              <div style={{ width:40, height:40, borderRadius:'50%', background:'var(--primary-container)',
                display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:15,
                color:'var(--on-primary-container)', overflow:'hidden' }}>
                {course.instructor?.avatar
                  ? <img src={course.instructor.avatar} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  : course.instructor?.name?.charAt(0)}
              </div>
              <div>
                <p style={{ color:'rgba(255,255,255,0.6)', fontSize:12, fontWeight:600 }}>Instructor</p>
                <p style={{ color:'white', fontSize:15, fontWeight:700 }}>{course.instructor?.name}</p>
              </div>
            </div>
          </div>

          {/* Enrollment card */}
          <div className="glass-card" style={{ borderRadius:24, overflow:'hidden', position:'sticky', top:100 }}>
            {course.thumbnail
              ? <img src={course.thumbnail} alt={course.title} style={{ width:'100%', aspectRatio:'16/9', objectFit:'cover' }} />
              : <div style={{ width:'100%', aspectRatio:'16/9', background:'var(--primary-container)',
                  display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize:60, color:'var(--on-primary-container)', opacity:0.4 }}>school</span>
                </div>
            }
            <div style={{ padding:28 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
                <span style={{ fontSize:32, fontWeight:900, color: course.price===0 ? 'var(--primary)' : 'var(--on-surface)' }}>
                  {course.price === 0 ? 'Free' : `$${course.price}`}
                </span>
              </div>

              {enrollment ? (
                <>
                  <div style={{ marginBottom:16 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                      <span style={{ fontSize:13, fontWeight:700, color:'var(--outline)' }}>Your progress</span>
                      <span style={{ fontSize:13, fontWeight:800, color:'var(--primary)' }}>{enrollment.progress}%</span>
                    </div>
                    <div className="progress-track"><div className="progress-fill" style={{ width:`${enrollment.progress}%` }} /></div>
                  </div>
                  <Link to={`/learn/${id}/${resumeLesson || firstLesson?._id}`}
                    style={{ display:'block', textAlign:'center', background:'var(--primary)', color:'white',
                      padding:'16px', borderRadius:14, fontWeight:700, fontSize:15 }}>
                    {enrollment.progress > 0 ? 'Continue Learning' : 'Start Learning'}
                  </Link>
                  {enrollment.certificateIssued && (
                    <div style={{ marginTop:12, background:'var(--primary-container)',
                      borderRadius:10, padding:'10px 14px', display:'flex', gap:8,
                      alignItems:'center', color:'var(--on-primary-container)', fontSize:13, fontWeight:700 }}>
                      <span className="material-symbols-outlined" style={{ fontSize:18 }}>verified</span>
                      Certificate Earned!
                    </div>
                  )}
                </>
              ) : (
                <button onClick={enroll} disabled={enrolling || user?.role !== 'student'}
                  style={{ width:'100%', padding:'16px', background:'var(--primary)', color:'white',
                    borderRadius:14, fontWeight:700, fontSize:15, cursor: user?.role !== 'student' ? 'not-allowed' : 'pointer',
                    opacity: enrolling ? 0.7 : 1, transition:'all 0.3s' }}>
                  {enrolling ? 'Enrolling...' : user?.role === 'student' ? 'Enroll Now' : user ? 'Students Only' : 'Login to Enroll'}
                </button>
              )}
              {!user && (
                <Link to="/login" style={{ display:'block', textAlign:'center', marginTop:12,
                  color:'var(--primary)', fontWeight:700, fontSize:14 }}>
                  Sign in to enroll
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum */}
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'60px 48px 80px' }}>
        <h2 style={{ fontSize:22, fontWeight:700, marginBottom:28 }}>Course Curriculum</h2>
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {course.modules?.map((mod, mi) => (
            <div key={mod._id} className="glass-card" style={{ borderRadius:20, overflow:'hidden' }}>
              <button onClick={() => setActiveModule(activeModule === mi ? -1 : mi)}
                style={{ width:'100%', padding:'20px 24px', display:'flex', justifyContent:'space-between',
                  alignItems:'center', cursor:'pointer', background:'none', textAlign:'left' }}>
                <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:'var(--primary-container)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:15, fontWeight:800, color:'var(--on-primary-container)' }}>{mi+1}</div>
                  <span style={{ fontWeight:700, fontSize:16 }}>{mod.title}</span>
                  <span style={{ fontSize:12, color:'var(--outline)', fontWeight:600 }}>
                    {mod.lessons?.length || 0} lessons
                  </span>
                </div>
                <span className="material-symbols-outlined" style={{ color:'var(--outline)', transition:'transform 0.3s',
                  transform: activeModule===mi ? 'rotate(180deg)' : 'rotate(0)' }}>expand_more</span>
              </button>
              {activeModule === mi && (
                <div style={{ borderTop:'1px solid var(--surface-container)' }}>
                  {mod.lessons?.map((lesson) => {
                    const isCompleted = enrollment?.completedLessons?.includes(lesson._id);
                    return (
                      <div key={lesson._id}
                        style={{ padding:'14px 24px', display:'flex', alignItems:'center', gap:14,
                          borderBottom:'1px solid var(--surface-container-low)',
                          background: isCompleted ? 'rgba(152,219,198,0.06)' : 'transparent' }}>
                        <span className="material-symbols-outlined" style={{ fontSize:20,
                          color: isCompleted ? 'var(--primary)' : 'var(--outline)' }}>
                          {isCompleted ? 'check_circle' : lesson.isFree ? 'play_circle' : 'lock'}
                        </span>
                        <div style={{ flex:1 }}>
                          <p style={{ fontSize:14, fontWeight:600 }}>{lesson.title}</p>
                          {lesson.duration > 0 && (
                            <p style={{ fontSize:12, color:'var(--outline)' }}>{lesson.duration} min</p>
                          )}
                        </div>
                        {(lesson.isFree || enrollment) && (
                          <Link to={`/learn/${id}/${lesson._id}`}
                            style={{ fontSize:12, fontWeight:700, color:'var(--primary)', padding:'6px 14px',
                              border:'1px solid var(--primary)', borderRadius:9999, transition:'all 0.2s' }}
                            onMouseEnter={e=>{ e.currentTarget.style.background='var(--primary)'; e.currentTarget.style.color='white'; }}
                            onMouseLeave={e=>{ e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--primary)'; }}>
                            {lesson.isFree ? 'Preview' : 'Watch'}
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CourseDetail;
