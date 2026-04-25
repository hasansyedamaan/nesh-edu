import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const GOOGLE_FORM_LINK = 'https://docs.google.com/forms/d/e/1FAIpQLScgqu3_f10FERP0zew8QCreSQK_d39y4Pkj_9LM4c7oj_GTJw/viewform?usp=publish-editor';

const DEMO_COURSE = {
  title: 'Artificial Intelligence & Machine Learning - FREE Demo',
  description: 'Join our FREE demo session on AI/ML! We will dive deep into our comprehensive curriculum architecture, discussing predictive analytics, neural network implementations, and the future of cognitive computing. Discover how NESHEDU empowers you to master these high-impact technologies.',
  category: 'AI/ML',
  level: 'Beginner',
  price: 0,
  instructor: {
    name: 'Dr. Alan Turing',
  },
  rating: { average: 5.0 },
  enrollmentCount: 1420,
  modules: [
    {
      _id: 'm1',
      title: 'Introduction to Artificial Intelligence',
      lessons: [
        { _id: 'l1', title: 'What is AI and Machine Learning?', duration: 15, isFree: true },
        { _id: 'l2', title: 'The Future of Cognitive Computing', duration: 20, isFree: true },
        { _id: 'l3', title: 'NESHEDU Learning Ecosystem', duration: 10, isFree: true }
      ]
    },
    {
      _id: 'm2',
      title: 'Core Concepts in Neural Networks',
      lessons: [
        { _id: 'l4', title: 'Understanding Perceptrons', duration: 25, isFree: false },
        { _id: 'l5', title: 'Backpropagation Simplified', duration: 30, isFree: false }
      ]
    },
    {
      _id: 'm3',
      title: 'Real-world Applications',
      lessons: [
        { _id: 'l6', title: 'Predictive Analytics in Industry', duration: 20, isFree: false },
        { _id: 'l7', title: 'Generative AI Overview', duration: 35, isFree: false }
      ]
    }
  ]
};

const DemoCoursePage = () => {
  const [activeModule, setActiveModule] = useState(0);

  const totalLessons = DEMO_COURSE.modules.reduce((a, m) => a + m.lessons.length, 0);
  const totalDuration = DEMO_COURSE.modules.reduce((a, m) =>
    a + m.lessons.reduce((b, l) => b + l.duration, 0), 0);

  const chipColors = {
    'AI/ML': { bg:'rgba(152,219,198,0.2)', color:'#1c6251' }
  };
  const chip = chipColors[DEMO_COURSE.category] || chipColors['AI/ML'];

  return (
    <div style={{ background:'var(--background)', minHeight:'100vh' }}>
      <Navbar />
      {/* Hero */}
      <div style={{ background:'linear-gradient(135deg, var(--primary) 0%, #191c1e 100%)',
        padding:'120px 48px 60px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 400px', gap:48, alignItems:'start' }}>
          <div>
            <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:20 }}>
              <span style={{ ...chip, padding:'6px 14px', borderRadius:9999, fontSize:12, fontWeight:700 }}>{DEMO_COURSE.category}</span>
              <span style={{ background:'rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.9)',
                padding:'6px 14px', borderRadius:9999, fontSize:12, fontWeight:700 }}>{DEMO_COURSE.level}</span>
            </div>
            <h1 style={{ color:'white', fontSize:'clamp(1.8rem,3.5vw,2.6rem)', fontWeight:800,
              lineHeight:1.2, marginBottom:20 }}>{DEMO_COURSE.title}</h1>
            <p style={{ color:'rgba(255,255,255,0.75)', fontSize:17, lineHeight:1.7, marginBottom:28, maxWidth:680 }}>
              {DEMO_COURSE.description}
            </p>
            <div style={{ display:'flex', gap:28, flexWrap:'wrap' }}>
              {[
                ['star', `${DEMO_COURSE.rating.average.toFixed(1)} rating`],
                ['people', `${DEMO_COURSE.enrollmentCount} students`],
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
                {DEMO_COURSE.instructor.name.charAt(0)}
              </div>
              <div>
                <p style={{ color:'rgba(255,255,255,0.6)', fontSize:12, fontWeight:600 }}>Instructor</p>
                <p style={{ color:'white', fontSize:15, fontWeight:700 }}>{DEMO_COURSE.instructor.name}</p>
              </div>
            </div>
          </div>

          {/* Enrollment card */}
          <div className="glass-card" style={{ borderRadius:24, overflow:'hidden', position:'sticky', top:100 }}>
            <div style={{ width:'100%', aspectRatio:'16/9', background:'linear-gradient(135deg, var(--primary) 0%, #191c1e 100%)',
                display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 60, color: 'white', opacity: 0.8 }}>psychology</span>
                <span style={{ position: 'absolute', top: 12, right: 12, background: 'var(--error)', color: 'white', fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 9999, letterSpacing: '0.05em' }}>FREE DEMO</span>
            </div>
            
            <div style={{ padding:28 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
                <span style={{ fontSize:32, fontWeight:900, color: 'var(--primary)' }}>
                  Free
                </span>
              </div>
              
              <a href={GOOGLE_FORM_LINK} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <button style={{ width:'100%', padding:'16px', background:'var(--primary)', color:'white',
                  borderRadius:14, fontWeight:700, fontSize:15, cursor: 'pointer', transition:'all 0.3s' }}
                  onMouseEnter={e => e.currentTarget.style.filter='brightness(1.1)'}
                  onMouseLeave={e => e.currentTarget.style.filter='brightness(1)'}>
                  Register for Demo
                </button>
              </a>

              <p style={{ display:'block', textAlign:'center', marginTop:12,
                color:'var(--outline)', fontWeight:600, fontSize:13 }}>
                Redirects to Google Form Registration
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum */}
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'60px 48px 80px' }}>
        <h2 style={{ fontSize:22, fontWeight:700, marginBottom:28 }}>Course Curriculum Preview</h2>
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {DEMO_COURSE.modules.map((mod, mi) => (
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
                    {mod.lessons.length} lessons
                  </span>
                </div>
                <span className="material-symbols-outlined" style={{ color:'var(--outline)', transition:'transform 0.3s',
                  transform: activeModule===mi ? 'rotate(180deg)' : 'rotate(0)' }}>expand_more</span>
              </button>
              {activeModule === mi && (
                <div style={{ borderTop:'1px solid var(--surface-container)' }}>
                  {mod.lessons.map((lesson) => {
                    return (
                      <div key={lesson._id}
                        style={{ padding:'14px 24px', display:'flex', alignItems:'center', gap:14,
                          borderBottom:'1px solid var(--surface-container-low)',
                          background: 'transparent' }}>
                        <span className="material-symbols-outlined" style={{ fontSize:20, color: 'var(--outline)' }}>
                          {lesson.isFree ? 'play_circle' : 'lock'}
                        </span>
                        <div style={{ flex:1 }}>
                          <p style={{ fontSize:14, fontWeight:600 }}>{lesson.title}</p>
                          {lesson.duration > 0 && (
                            <p style={{ fontSize:12, color:'var(--outline)' }}>{lesson.duration} min</p>
                          )}
                        </div>
                        {lesson.isFree && (
                          <span style={{ fontSize:12, fontWeight:700, color:'var(--primary)', padding:'6px 14px',
                            border:'1px solid var(--primary)', borderRadius:9999 }}>
                            Preview
                          </span>
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

export default DemoCoursePage;
