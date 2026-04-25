import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const modules = [
  { icon:'data_object', title:'Core Logic', desc:'Fundamental structures for advanced data processing and algorithmic thinking.', category:'Core Logic' },
  { icon:'hub', title:'Neural Nets', desc:'Master the architecture of interconnected learning systems and AI integrations.', category:'Neural Nets' },
  { icon:'security', title:'System Integrity', desc:'Advanced protocols for maintaining secure, high-integrity educational nodes.', category:'System Integrity' },
  { icon:'auto_graph', title:'Synthesis', desc:'The final layer where all disciplines converge into mastery of digital realms.', category:'Synthesis' }
];

const CurriculumGrid = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        sectionRef.current?.querySelectorAll('.reveal-element').forEach((el, i) => {
          setTimeout(() => el.classList.add('active'), i * 100);
        });
      }
    }, { threshold:0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const tiltCard = (e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientY - r.top - r.height/2)/25;
    const y = -(e.clientX - r.left - r.width/2)/25;
    el.style.transform = `perspective(1200px) rotateX(${x}deg) rotateY(${y}deg) scale3d(1.02,1.02,1.02)`;
  };
  const resetCard = (e) => { e.currentTarget.style.transform='perspective(1200px) rotateX(0) rotateY(0) scale3d(1,1,1)'; };

  return (
    <section ref={sectionRef} style={{ background:'var(--surface-container-lowest)', padding:'120px 0', position:'relative', overflow:'hidden', marginTop:40 }}>
      {/* Circuit decorations */}
      <div className="circuit-line-pulse" style={{ position:'absolute', top:0, left:'25%', height:'100%', width:1,
        background:'linear-gradient(to bottom, transparent, rgba(152,219,198,0.4), transparent)' }} />
      <div className="circuit-line-pulse" style={{ position:'absolute', top:'50%', left:0, width:'100%', height:1,
        background:'linear-gradient(to right, transparent, rgba(152,219,198,0.4), transparent)' }} />

      <div style={{ maxWidth:1400, margin:'0 auto', padding:'0 48px', position:'relative', zIndex:2 }}>
        <div className="reveal-element" style={{ textAlign:'center', marginBottom:96 }}>
          <span style={{ fontSize:12, fontWeight:800, letterSpacing:'0.3em', color:'var(--primary)',
            textTransform:'uppercase', display:'block', marginBottom:20 }}>The Ecosystem</span>
          <h2 style={{ fontSize:'clamp(2rem,4vw,3rem)', fontWeight:800, letterSpacing:'-0.02em' }}>Curriculum Architecture</h2>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:32 }}>
          {modules.map(({ icon, title, desc, category }, i) => (
            <div key={title} className="glass-card tilt-card reveal-element"
              style={{ padding:40, borderRadius:40, cursor:'pointer', transition:'all 0.4s var(--reveal-ease)',
                transitionDelay:`${(i+1)*0.1}s` }}
              onMouseMove={tiltCard} onMouseLeave={resetCard}>
              <div style={{ width:64, height:64, borderRadius:16, background:'white',
                display:'flex', alignItems:'center', justifyContent:'center',
                border:'1px solid var(--outline-variant)', marginBottom:28, transition:'transform 0.3s' }}>
                <span className="material-symbols-outlined" style={{ color:'var(--primary)', fontSize:32 }}>{icon}</span>
              </div>
              <h3 style={{ fontSize:22, fontWeight:700, marginBottom:16 }}>{title}</h3>
              <p style={{ color:'var(--on-surface-variant)', fontSize:15, lineHeight:1.65, marginBottom:28 }}>{desc}</p>
              <Link to={`/courses?category=${encodeURIComponent(category)}`}
                style={{ display:'flex', alignItems:'center', gap:8, color:'var(--primary)', fontWeight:700, fontSize:14,
                  transition:'gap 0.3s' }}
                onMouseEnter={e=>e.currentTarget.style.gap='14px'}
                onMouseLeave={e=>e.currentTarget.style.gap='8px'}>
                Explore Module
                <span className="material-symbols-outlined" style={{ fontSize:16, fontWeight:900 }}>arrow_forward</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CurriculumGrid;
