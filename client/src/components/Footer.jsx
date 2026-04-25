import { Link } from 'react-router-dom';

const Footer = () => (
  <footer style={{ background:'rgba(255,255,255,0.55)', borderTop:'1px solid var(--surface-container)', padding:'60px 0' }}>
    <div style={{ maxWidth:1400, margin:'0 auto', padding:'0 48px',
      display:'flex', justifyContent:'space-between', alignItems:'center', gap:40, flexWrap:'wrap' }}>
      <div>
        <span style={{ fontWeight:900, fontSize:28, letterSpacing:'-0.04em' }}>NESH</span>
        <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:'var(--outline)', marginTop:8 }}>
          © 2024 NESH Cognitive Systems. All rights reserved.
        </p>
      </div>
      <div style={{ display:'flex', gap:36, flexWrap:'wrap' }}>
        {['Privacy Policy','Terms of Service','Help Center','API Status'].map(label => (
          <Link key={label} to="#"
            style={{ fontSize:11, fontWeight:800, letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--outline)', transition:'color 0.3s' }}
            onMouseEnter={e=>e.currentTarget.style.color='var(--primary)'}
            onMouseLeave={e=>e.currentTarget.style.color='var(--outline)'}>
            {label}
          </Link>
        ))}
      </div>
    </div>
  </footer>
);

export default Footer;
