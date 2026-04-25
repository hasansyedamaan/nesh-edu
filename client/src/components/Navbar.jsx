import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isLanding = location.pathname === '/';

  const handleLogout = () => { logout(); navigate('/'); };

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'instructor') return '/instructor/dashboard';
    return '/dashboard';
  };

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      background: scrolled || !isLanding ? 'rgba(255,255,255,0.80)' : 'transparent',
      backdropFilter: scrolled || !isLanding ? 'blur(25px)' : 'none',
      borderBottom: scrolled || !isLanding ? '1px solid rgba(255,255,255,0.4)' : 'none',
      boxShadow: scrolled ? '0 4px 30px rgba(28,98,81,0.06)' : 'none',
      transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)'
    }}>
      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'18px 48px', maxWidth:1400, margin:'0 auto' }}>
        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap: 56 }}>
          <Link to="/" style={{ fontSize:28, fontWeight:800, letterSpacing:'-0.04em',
            color: isLanding && !scrolled ? 'white' : 'var(--on-surface)' }}>
            NESHEDU
          </Link>
          <div style={{ display:'flex', gap:36 }} className="nav-links">
            {[['Curriculum', '/curriculum'], ['Analytics', '/analytics'], ['Mentors', '/mentors'], ['Library', '/library']].map(([label, href]) => {
              const disabled = ['/analytics', '/library'].includes(href);
              return (
                <Link key={label} to={disabled ? '/welcome' : href} style={{
                  color: isLanding && !scrolled ? 'rgba(255,255,255,0.8)' : 'var(--on-surface-variant)',
                  fontWeight: 600, fontSize:15,
                  borderBottom: location.pathname === href ? '2px solid var(--primary-container)' : '2px solid transparent',
                  paddingBottom: 4, transition: 'color 0.3s'
                }}
                onMouseEnter={e => e.target.style.color = isLanding && !scrolled ? 'white' : 'var(--primary)'}
                onMouseLeave={e => e.target.style.color = isLanding && !scrolled ? 'rgba(255,255,255,0.8)' : 'var(--on-surface-variant)'}>
                  {label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display:'flex', alignItems:'center', gap:20 }}>
          {user ? (
            <>
              <span className="material-symbols-outlined"
                style={{ color: isLanding && !scrolled ? 'rgba(255,255,255,0.7)' : 'var(--outline)', cursor:'pointer', fontSize:22 }}>
                notifications
              </span>
              <div style={{ position:'relative' }}>
                <button onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer',
                    background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.3)',
                    borderRadius:9999, padding:'8px 16px 8px 8px', backdropFilter:'blur(10px)' }}>
                  <div style={{ width:32, height:32, borderRadius:'50%',
                    background: user.avatar ? 'transparent' : 'var(--primary-container)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontWeight:700, color:'var(--on-primary-container)', fontSize:14, overflow:'hidden' }}>
                    {user.avatar
                      ? <img src={user.avatar} alt={user.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                      : user.name.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontWeight:600, fontSize:14,
                    color: isLanding && !scrolled ? 'white' : 'var(--on-surface)' }}>
                    {user.name.split(' ')[0]}
                  </span>
                  <span className="material-symbols-outlined" style={{ fontSize:18,
                    color: isLanding && !scrolled ? 'rgba(255,255,255,0.7)' : 'var(--outline)' }}>
                    expand_more
                  </span>
                </button>
                {dropdownOpen && (
                  <div style={{ position:'absolute', right:0, top:'calc(100% + 12px)',
                    background:'white', borderRadius:16, boxShadow:'0 16px 48px rgba(0,0,0,0.12)',
                    border:'1px solid var(--outline-variant)', minWidth:200, overflow:'hidden', zIndex:300 }}>
                    <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--surface-container)' }}>
                      <p style={{ fontWeight:700, fontSize:14 }}>{user.name}</p>
                      <p style={{ fontSize:12, color:'var(--outline)', marginTop:2 }}>{user.email}</p>
                      <span style={{ fontSize:11, fontWeight:700, letterSpacing:'0.08em',
                        color:'var(--primary)', background:'var(--primary-container)',
                        padding:'3px 10px', borderRadius:9999, marginTop:8, display:'inline-block',
                        textTransform:'uppercase' }}>{user.role}</span>
                    </div>
                    {[
                      ['Dashboard', getDashboardLink(), 'dashboard'],
                      ['Settings', '/settings', 'settings'],
                    ].map(([label, href, icon]) => (
                      <Link key={label} to={href} onClick={() => setDropdownOpen(false)}
                        style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 20px',
                          fontSize:14, fontWeight:600, color:'var(--on-surface-variant)',
                          transition:'background 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.background='var(--surface-container-low)'}
                        onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                        <span className="material-symbols-outlined" style={{ fontSize:18 }}>{icon}</span>
                        {label}
                      </Link>
                    ))}
                    <button onClick={handleLogout}
                      style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 20px',
                        width:'100%', fontSize:14, fontWeight:600, color:'var(--error)',
                        borderTop:'1px solid var(--surface-container)', cursor:'pointer', background:'none' }}
                      onMouseEnter={e => e.currentTarget.style.background='var(--error-container)'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                      <span className="material-symbols-outlined" style={{ fontSize:18 }}>logout</span>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/welcome" style={{ fontWeight:700, fontSize:14,
                color: isLanding && !scrolled ? 'rgba(255,255,255,0.85)' : 'var(--on-surface-variant)',
                transition:'color 0.3s' }}>
                Sign In
              </Link>
              <Link to="/welcome" className="magnetic-btn"
                style={{ background:'var(--primary)', color:'white', padding:'12px 28px',
                  borderRadius:9999, fontWeight:700, fontSize:14, letterSpacing:'0.02em',
                  transition:'all 0.3s var(--reveal-ease)' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow='0 8px 24px rgba(37,105,88,0.4)'; e.currentTarget.style.transform='translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='translateY(0)'; }}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Click outside to close dropdown */}
      {dropdownOpen && (
        <div style={{ position:'fixed', inset:0, zIndex:200 }} onClick={() => setDropdownOpen(false)} />
      )}
    </header>
  );
};

export default Navbar;
