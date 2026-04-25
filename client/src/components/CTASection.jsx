import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const CTASection = () => {
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) ref.current?.querySelectorAll('.reveal-element').forEach(el => el.classList.add('active'));
    }, { threshold:0.15 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} style={{ maxWidth:1400, margin:'0 auto', padding:'80px 48px 120px' }}>
      <div className="glass-card reveal-element" style={{ borderRadius:56, overflow:'hidden',
        display:'grid', gridTemplateColumns:'1fr 1fr', boxShadow:'0 30px 80px rgba(28,98,81,0.10)' }}>
        <div style={{ padding:'80px 80px', display:'flex', flexDirection:'column', gap:36 }}>
          <h2 style={{ fontSize:'clamp(2.5rem,4vw,3.5rem)', fontWeight:800, letterSpacing:'-0.03em', lineHeight:1.1 }}>
            Ready to <br /><span style={{ color:'var(--primary)', fontStyle:'italic' }}>evolve?</span>
          </h2>
          <p style={{ color:'var(--on-surface-variant)', fontSize:18, lineHeight:1.7 }}>
            Join 40,000+ active learners currently navigating the NESHEDU ecosystem. Your educational journey starts here.
          </p>
          <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
            <Link to="/register" style={{ background:'var(--primary)', color:'white',
              padding:'18px 32px', borderRadius:20, fontWeight:700, fontSize:14, transition:'all 0.3s' }}
              onMouseEnter={e=>{ e.currentTarget.style.transform='scale(1.04)'; e.currentTarget.style.boxShadow='0 12px 32px rgba(37,105,88,0.35)'; }}
              onMouseLeave={e=>{ e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.boxShadow='none'; }}>
              Initialize Connection
            </Link>
            <button style={{ border:'1px solid var(--outline)', padding:'18px 32px',
              borderRadius:20, fontWeight:700, fontSize:14, transition:'all 0.3s' }}
              onMouseEnter={e=>{ e.currentTarget.style.background='var(--surface-variant)'; e.currentTarget.style.transform='scale(1.04)'; }}
              onMouseLeave={e=>{ e.currentTarget.style.background='transparent'; e.currentTarget.style.transform='scale(1)'; }}>
              Speak to an Advisor
            </button>
          </div>
        </div>
        <div style={{ background:'var(--primary-fixed)', position:'relative', overflow:'hidden', minHeight:480 }}>
          <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
            {/* Abstract decorative element */}
            <div style={{ width:320, height:320, borderRadius:'50%',
              background:'linear-gradient(135deg, var(--primary-container), var(--secondary-container))',
              opacity:0.5, filter:'blur(40px)' }} />
          </div>
          <div style={{ position:'absolute', top:40, right:40, background:'rgba(255,255,255,0.9)',
            backdropFilter:'blur(20px)', borderRadius:20, padding:'20px 24px', boxShadow:'0 8px 32px rgba(28,98,81,0.1)' }}>
            <p style={{ fontSize:12, fontWeight:700, color:'var(--outline)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:4 }}>Active Learners</p>
            <p style={{ fontSize:28, fontWeight:800, color:'var(--primary)' }}>40,000+</p>
          </div>
          <div style={{ position:'absolute', bottom:40, left:40, background:'rgba(255,255,255,0.9)',
            backdropFilter:'blur(20px)', borderRadius:20, padding:'20px 24px', boxShadow:'0 8px 32px rgba(28,98,81,0.1)' }}>
            <p style={{ fontSize:12, fontWeight:700, color:'var(--outline)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:4 }}>Completion Rate</p>
            <p style={{ fontSize:28, fontWeight:800, color:'var(--secondary)' }}>94.7%</p>
          </div>
          <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)' }}>
            <span className="material-symbols-outlined" style={{ fontSize:120, color:'rgba(37,105,88,0.12)' }}>school</span>
          </div>
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to right, rgba(255,255,255,0.35), transparent)' }} />
        </div>
      </div>
    </section>
  );
};

export default CTASection;
