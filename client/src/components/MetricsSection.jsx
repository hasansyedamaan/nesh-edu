import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const MetricsSection = () => {
  const sectionRef = useRef(null);
  const chartRef = useRef(null);
  const peakRef = useRef(null);
  const syncRef = useRef(null);
  const xpRef = useRef(null);
  const bar1Ref = useRef(null);
  const bar2Ref = useRef(null);
  const revealed = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !revealed.current) {
        revealed.current = true;
        chartRef.current?.classList.add('draw');
        if (peakRef.current) gsap.to(peakRef.current, { innerText:92.4, duration:2.5, snap:{innerText:0.1}, ease:'power4.out' });
        if (syncRef.current) gsap.to(syncRef.current, { innerText:1.2, duration:2.5, snap:{innerText:0.1}, ease:'power4.out' });
        if (xpRef.current) gsap.to(xpRef.current, { innerText:1420, duration:2.5, snap:{innerText:1}, ease:'power4.out' });
        if (bar1Ref.current) { bar1Ref.current.style.transition='width 2s cubic-bezier(0.16,1,0.3,1)'; bar1Ref.current.style.width='75%'; }
        if (bar2Ref.current) { bar2Ref.current.style.transition='width 2s cubic-bezier(0.16,1,0.3,1) 0.2s'; bar2Ref.current.style.width='50%'; }
        sectionRef.current?.querySelectorAll('.reveal-element').forEach(el => el.classList.add('active'));
      }
    }, { threshold:0.15 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const tiltCard = (e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientY - r.top - r.height/2) / 25;
    const y = -(e.clientX - r.left - r.width/2) / 25;
    el.style.transform = `perspective(1200px) rotateX(${x}deg) rotateY(${y}deg) scale3d(1.02,1.02,1.02)`;
  };
  const resetCard = (e) => { e.currentTarget.style.transform = 'perspective(1200px) rotateX(0) rotateY(0) scale3d(1,1,1)'; };

  return (
    <section ref={sectionRef} className="section-separator" style={{ maxWidth:1400, margin:'0 auto', padding:'120px 48px' }}>
      <div className="metrics-header">
        <div className="reveal-element">
          <h2 className="text-headline-lg" style={{ marginBottom:16 }}>Performance Metrics</h2>
          <p style={{ color:'var(--on-surface-variant)', fontSize:17, maxWidth:480, lineHeight:1.6 }}>
            Real-time analytical feedback on your cognitive progression and curriculum mastery.
          </p>
        </div>
        <div className="reveal-element" style={{ display:'flex', gap:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 24px',
            borderRadius:9999, background:'white', border:'1px solid var(--outline-variant)',
            cursor:'pointer', fontWeight:700, fontSize:14 }}>
            <span className="material-symbols-outlined" style={{ color:'var(--primary)', fontSize:20 }}>analytics</span>
            Live Stream
          </div>
        </div>
      </div>

      <div className="metrics-grid">
        {/* Chart Card */}
        <div className="glass-card tilt-card reveal-element" style={{ borderRadius:28, padding:40, position:'relative', overflow:'hidden' }}
          onMouseMove={tiltCard} onMouseLeave={resetCard}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:36 }}>
            <h3 style={{ fontSize:20, fontWeight:600 }}>Learning Progress</h3>
            <div style={{ display:'flex', gap:4, background:'var(--surface-container-low)', padding:6, borderRadius:9999 }}>
              <span style={{ padding:'6px 20px', borderRadius:9999, background:'white', boxShadow:'0 2px 8px rgba(0,0,0,0.06)',
                color:'var(--primary)', fontWeight:700, fontSize:13, cursor:'pointer' }}>Day</span>
              <span style={{ padding:'6px 20px', borderRadius:9999, color:'var(--outline)',
                fontWeight:700, fontSize:13, cursor:'pointer' }}>Week</span>
            </div>
          </div>
          <div style={{ height:260, position:'relative' }}>
            <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', justifyContent:'space-between', opacity:0.07, pointerEvents:'none' }}>
              {[0,1,2,3].map(i => <div key={i} style={{ borderTop:'1px solid var(--on-surface)' }} />)}
            </div>
            <svg style={{ width:'100%', height:'100%' }} viewBox="0 0 400 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="grad1" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor:'#98DBC6', stopOpacity:1 }} />
                  <stop offset="100%" style={{ stopColor:'#98DBC6', stopOpacity:0 }} />
                </linearGradient>
              </defs>
              <path d="M0,80 Q50,70 100,40 T200,30 T300,10 T400,20 L400,100 L0,100 Z" fill="url(#grad1)" opacity="0.12" />
              <path ref={chartRef} id="chart-path" d="M0,80 Q50,70 100,40 T200,30 T300,10 T400,20"
                fill="none" stroke="#256958" strokeLinecap="round" strokeWidth="3.5" />
            </svg>
          </div>
          <div className="metrics-stats-grid" style={{
            marginTop:36, borderTop:'1px solid var(--surface-variant)', paddingTop:28 }}>
            {[
              ['Peak Focus', peakRef, '0', '%'],
              ['Knowledge Sync', syncRef, '0', 'ms'],
              ['Session XP', xpRef, '0', '', '+']
            ].map(([label, ref, init, suffix, prefix='']) => (
              <div key={label}>
                <span style={{ display:'block', fontSize:11, fontWeight:700, color:'var(--outline)',
                  textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:8 }}>{label}</span>
                <span style={{ fontSize:28, fontWeight:800 }}>{prefix}<span ref={ref}>{init}</span>{suffix}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Side Cards */}
        <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
          {[
            { title:'Mental Endurance', sub:'Tier 3 Master', icon:'psychology', color:'var(--secondary-container)', iconColor:'var(--on-secondary-container)', ref:bar1Ref, barColor:'var(--secondary)' },
            { title:'Skill Synthesis', sub:'48 Nodes Active', icon:'model_training', color:'var(--tertiary-container)', iconColor:'var(--on-tertiary-container)', ref:bar2Ref, barColor:'var(--tertiary)' }
          ].map(({ title, sub, icon, color, iconColor, ref, barColor }) => (
            <div key={title} className="glass-card tilt-card reveal-element" style={{ borderRadius:28, padding:28 }}
              onMouseMove={tiltCard} onMouseLeave={resetCard}>
              <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:20 }}>
                <div style={{ width:52, height:52, borderRadius:16, background:color,
                  display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <span className="material-symbols-outlined" style={{ color:iconColor, fontSize:26 }}>{icon}</span>
                </div>
                <div>
                  <h4 style={{ fontWeight:700, fontSize:16 }}>{title}</h4>
                  <p style={{ fontSize:12, color:'var(--outline)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em', marginTop:2 }}>{sub}</p>
                </div>
              </div>
              <div className="progress-track">
                <div ref={ref} className="progress-fill" style={{ background:barColor, width:'0%' }} />
              </div>
            </div>
          ))}

          {/* Upgrade card */}
          <div className="reveal-element" style={{ background:'var(--primary)', borderRadius:28, padding:32,
            position:'relative', overflow:'hidden', cursor:'pointer' }}
            onMouseEnter={e=>e.currentTarget.style.boxShadow='0 20px 50px rgba(37,105,88,0.4)'}
            onMouseLeave={e=>e.currentTarget.style.boxShadow='none'}>
            <span className="material-symbols-outlined" style={{ position:'absolute', bottom:-20, right:-20,
              fontSize:160, color:'rgba(255,255,255,0.07)', transform:'rotate(12deg)', transition:'transform 0.8s' }}>
              rocket_launch
            </span>
            <div style={{ position:'relative', zIndex:2 }}>
              <h4 style={{ color:'white', fontSize:22, fontWeight:700, marginBottom:12 }}>Upgrade to Pro</h4>
              <p style={{ color:'rgba(255,255,255,0.75)', fontSize:15, lineHeight:1.6, marginBottom:24 }}>
                Unlock the full cognitive potential suite with advanced neural mapping.
              </p>
              <button style={{ width:'100%', padding:'16px', background:'white',
                color:'var(--primary)', borderRadius:14, fontWeight:700, fontSize:14,
                transition:'background 0.3s' }}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.9)'}
                onMouseLeave={e=>e.currentTarget.style.background='white'}>
                Get Started Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MetricsSection;
