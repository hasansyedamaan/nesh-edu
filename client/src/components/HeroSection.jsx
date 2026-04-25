import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';

const HeroSection = () => {
  const bubbleRef = useRef(null);
  const bookRef = useRef(null);
  const armPathRef = useRef(null);
  const handRef = useRef(null);
  const wavingArmRef = useRef(null);
  const c0 = useRef(null), c1 = useRef(null), c2 = useRef(null);

  useEffect(() => {
    setTimeout(() => bubbleRef.current?.classList.add('active'), 1000);
    setTimeout(() => {
      bubbleRef.current?.classList.remove('active');
      if (armPathRef.current) gsap.to(armPathRef.current, { attr: { d: 'M320 250 Q340 300 320 340' }, duration:1.8, ease:'power3.inOut' });
      if (handRef.current) gsap.to(handRef.current, { attr: { cx:315, cy:340 }, duration:1.8, ease:'power3.inOut' });
      if (wavingArmRef.current) wavingArmRef.current.style.animation = 'none';
      bookRef.current?.classList.add('active');
    }, 5000);

    [c0,c1,c2].forEach(ref => {
      if (!ref.current) return;
      const t = parseFloat(ref.current.getAttribute('data-target'));
      gsap.to(ref.current, { innerText:t, duration:2, snap:{innerText:0.1}, ease:'power4.out', delay:0.8 });
    });

    const onMove = (e) => {
      document.querySelectorAll('.parallax-layer[data-speed]').forEach(el => {
        const s = parseFloat(el.getAttribute('data-speed'));
        el.style.transform = `translate(${(e.clientX - window.innerWidth/2)*s}px, ${(e.clientY - window.innerHeight/2)*s}px)`;
      });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <section className="hero-gradient" style={{ minHeight:'100vh', display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden', padding:'0 48px 160px' }}>
      <div className="parallax-layer" data-speed="0.04" style={{
        position:'absolute', inset:0, opacity:0.12, pointerEvents:'none',
        backgroundImage:'radial-gradient(#98DBC6 1px, transparent 1px)', backgroundSize:'50px 50px' }} />

      <div style={{ maxWidth:1400, width:'100%', display:'grid', gridTemplateColumns:'1fr 1fr',
        alignItems:'center', gap:96, position:'relative', zIndex:10, paddingTop:100 }}>

        <div className="reveal-element active" style={{ transitionDelay:'0.2s', display:'flex', flexDirection:'column', gap:36 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:12, padding:'10px 20px',
            borderRadius:9999, background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)',
            backdropFilter:'blur(12px)', width:'fit-content' }}>
            <span style={{ width:10, height:10, borderRadius:'50%', background:'var(--primary-container)', animation:'pulse-node 2s infinite' }} />
            <span style={{ color:'rgba(255,255,255,0.9)', fontSize:11, fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase' }}>Educational Society v2.4</span>
          </div>
          <h1 style={{ fontSize:'clamp(2.8rem,5vw,4rem)', fontWeight:800, lineHeight:1.1, letterSpacing:'-0.03em', color:'white' }}>
            Master the Digital <br /><span style={{ color:'var(--primary-container)' }}>Ether.</span>
          </h1>
          <p style={{ color:'rgba(255,255,255,0.7)', fontSize:18, lineHeight:1.7, maxWidth:520 }}>
            A high-performance educational environment built for the next generation of intellectual leaders.
          </p>
          <div style={{ display:'flex', gap:20, paddingTop:12, flexWrap:'wrap' }}>
            <Link to="/register" style={{ background:'var(--primary-container)', color:'var(--on-primary-container)',
              padding:'18px 36px', borderRadius:16, fontWeight:700, fontSize:14, transition:'all 0.3s' }}
              onMouseEnter={e=>{ e.currentTarget.style.transform='scale(1.05)'; e.currentTarget.style.boxShadow='0 16px 40px rgba(152,219,198,0.4)'; }}
              onMouseLeave={e=>{ e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.boxShadow='none'; }}>
              Launch Hub
            </Link>
            <Link to="/courses" style={{ border:'1px solid rgba(255,255,255,0.3)', color:'white',
              padding:'18px 36px', borderRadius:16, fontWeight:700, fontSize:14, backdropFilter:'blur(8px)', transition:'all 0.3s' }}
              onMouseEnter={e=>{ e.currentTarget.style.background='rgba(255,255,255,0.1)'; e.currentTarget.style.transform='scale(1.05)'; }}
              onMouseLeave={e=>{ e.currentTarget.style.background='transparent'; e.currentTarget.style.transform='scale(1)'; }}>
              View Roadmap
            </Link>
          </div>
        </div>

        <div style={{ position:'relative', height:600, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div className="parallax-layer glass-card" data-speed="0.12"
            style={{ position:'absolute', top:20, left:40, padding:'16px 20px', borderRadius:16, zIndex:5 }}>
            <span style={{ fontSize:11, display:'block', color:'#64748b', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:4 }}>Retention</span>
            <span style={{ fontSize:22, fontWeight:800, color:'var(--primary)' }}><span ref={c0} data-target="100">0</span>%</span>
          </div>
          <div className="parallax-layer glass-card" data-speed="0.22"
            style={{ position:'absolute', bottom:100, right:20, padding:'16px 20px', borderRadius:16, zIndex:5 }}>
            <span style={{ fontSize:11, display:'block', color:'#64748b', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:4 }}>IQ Delta</span>
            <span style={{ fontSize:22, fontWeight:800, color:'var(--secondary)' }}>+<span ref={c1} data-target="100">0</span>pts</span>
          </div>
          <div className="parallax-layer glass-card" data-speed="0.18"
            style={{ position:'absolute', top:'50%', left:0, padding:'16px 20px', borderRadius:16, zIndex:5 }}>
            <span style={{ fontSize:11, display:'block', color:'#64748b', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:4 }}>Focus</span>
            <span style={{ fontSize:22, fontWeight:800, color:'var(--tertiary)' }}><span ref={c2} data-target="100">0</span>%</span>
          </div>

          <div className="parallax-layer reveal-element active" data-speed="0.08"
            style={{ width:'100%', maxWidth:480, height:'100%', display:'flex', alignItems:'center', justifyContent:'center', transitionDelay:'0.5s' }}>
            <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" style={{ width:'100%', height:'100%', overflow:'visible' }}>
              <path d="M150 400 Q150 350 250 350 T350 400 L350 450 Q250 470 150 450 Z" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2" />
              <g>
                <path className="character-pants" d="M200 350 L200 450 Q225 460 245 450 L245 380 L255 380 L255 450 Q275 460 300 450 L300 350 Z" />
                <path className="character-hoodie" d="M180 250 Q180 360 250 370 Q320 360 320 250 Z" />
                <path d="M230 270 L245 300 M270 270 L255 300" stroke="#1e293b" strokeLinecap="round" strokeWidth="2" />
                <path className="character-hoodie" d="M180 250 Q140 300 160 340" fill="none" />
                <g className="arm-wave" ref={wavingArmRef}>
                  <path className="character-hoodie" d="M320 250 Q360 220 380 180" fill="none" ref={armPathRef} />
                  <circle className="character-skin" cx="385" cy="170" r="15" ref={handRef} />
                </g>
                <g className="head-reading">
                  <circle className="character-skin" cx="250" cy="180" r="70" />
                  <path className="character-hair" d="M180 180 Q180 110 250 110 Q320 110 320 180 L320 190 Q250 160 180 190 Z" />
                  <circle className="character-glasses" cx="220" cy="190" r="18" />
                  <circle className="character-glasses" cx="280" cy="190" r="18" />
                  <line className="character-glasses" x1="238" x2="262" y1="190" y2="190" />
                  <circle className="eye" cx="220" cy="190" fill="#1e293b" r="3" />
                  <circle className="eye" cx="280" cy="190" fill="#1e293b" r="3" />
                  <path d="M240 220 Q250 230 260 220" fill="none" stroke="#1e293b" strokeLinecap="round" strokeWidth="2" />
                </g>
                <g className="book" ref={bookRef}>
                  <path d="M180 340 L250 360 L320 340 L320 280 L250 300 L180 280 Z" fill="#ffffff" stroke="#1e293b" strokeWidth="2" />
                  <line stroke="#cbd5e1" strokeWidth="1" x1="250" x2="250" y1="300" y2="360" />
                  <path d="M190 295 H240 M190 305 H240 M190 315 H230" stroke="#94a3b8" strokeWidth="1" />
                  <path d="M260 295 H310 M260 305 H310 M260 315 H300" stroke="#94a3b8" strokeWidth="1" />
                </g>
              </g>
              <g className="speech-bubble" ref={bubbleRef}>
                <rect fill="white" height="60" rx="20" stroke="#98DBC6" strokeWidth="2" width="140" x="330" y="80" />
                <path d="M360 140 L350 160 L380 140" fill="white" stroke="#98DBC6" strokeWidth="2" />
                <text fill="#1c6251" fontFamily="Manrope" fontSize="16" fontWeight="800" textAnchor="middle" x="400" y="115">Hello there!</text>
              </g>
            </svg>
          </div>
        </div>
      </div>
      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:180,
        background:'linear-gradient(to top, var(--background), transparent)', zIndex:5 }} />
    </section>
  );
};

export default HeroSection;
