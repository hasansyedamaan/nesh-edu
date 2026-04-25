import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email:'', password:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const user = await login(form.email, form.password);
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'instructor') navigate('/instructor/dashboard');
      else navigate('/dashboard');
    } catch(err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally { setLoading(false); }
  };

  const demoLogin = async (email, password) => {
    setForm({ email, password });
    setError(''); setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'instructor') navigate('/instructor/dashboard');
      else navigate('/dashboard');
    } catch { setError('Demo login failed.'); }
    finally { setLoading(false); }
  };

  const demoUsers = [
    ['admin@neshedu.com', 'admin123', 'Admin'],
    ['instructor@neshedu.com', 'instructor123', 'Instructor'],
    ['student@neshedu.com', 'student123', 'Student']
  ];

  return (
    <div style={{ minHeight:'100vh', background:'var(--background)', display:'flex', alignItems:'center',
      justifyContent:'center', padding:'40px 24px', position:'relative', overflow:'hidden' }}>
      {/* Background blobs */}
      <div style={{ position:'absolute', top:'-20%', right:'-10%', width:600, height:600, borderRadius:'50%',
        background:'radial-gradient(circle, rgba(152,219,198,0.15), transparent 70%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'-15%', left:'-10%', width:500, height:500, borderRadius:'50%',
        background:'radial-gradient(circle, rgba(206,201,255,0.12), transparent 70%)', pointerEvents:'none' }} />

      <div style={{ width:'100%', maxWidth:480, position:'relative', zIndex:2 }}>
        <Link to="/" style={{ display:'flex', justifyContent:'center', marginBottom:36 }}>
          <span style={{ fontSize:32, fontWeight:900, letterSpacing:'-0.04em', color:'var(--on-surface)' }}>NESHEDU</span>
        </Link>

        <div className="glass-card" style={{ borderRadius:32, padding:48 }}>
          <h1 style={{ fontSize:28, fontWeight:800, textAlign:'center', marginBottom:8 }}>Welcome back</h1>
          <p style={{ fontSize:15, color:'var(--outline)', textAlign:'center', marginBottom:36 }}>Sign in to your cognitive hub</p>

          {error && (
            <div style={{ background:'var(--error-container)', color:'var(--on-error-container)',
              padding:'14px 18px', borderRadius:12, marginBottom:24, fontSize:14, fontWeight:600 }}>
              {error}
            </div>
          )}

          <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:20 }}>
            <div>
              <label style={{ fontSize:13, fontWeight:700, color:'var(--on-surface-variant)',
                display:'block', marginBottom:8, letterSpacing:'0.02em' }}>Email</label>
              <input name="email" type="email" value={form.email} onChange={handle}
                className="input-field" placeholder="your@email.com" required />
            </div>
            <div>
              <label style={{ fontSize:13, fontWeight:700, color:'var(--on-surface-variant)',
                display:'block', marginBottom:8, letterSpacing:'0.02em' }}>Password</label>
              <input name="password" type="password" value={form.password} onChange={handle}
                className="input-field" placeholder="••••••••" required />
            </div>

            <button type="submit" disabled={loading}
              style={{ background:'var(--primary)', color:'white', padding:'16px', borderRadius:14,
                fontWeight:700, fontSize:15, marginTop:8, transition:'all 0.3s',
                opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
              onMouseEnter={e=>!loading && (e.currentTarget.style.transform='translateY(-2px)', e.currentTarget.style.boxShadow='0 8px 24px rgba(37,105,88,0.3)')}
              onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{ marginTop:28, paddingTop:28, borderTop:'1px solid var(--surface-container)' }}>
            <p style={{ fontSize:12, fontWeight:700, color:'var(--outline)', textAlign:'center',
              textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:16 }}>Quick Demo Access</p>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {demoUsers.map(([email, password, role]) => (
                <button key={role} onClick={() => demoLogin(email, password)}
                  style={{ padding:'11px', borderRadius:10, background:'var(--surface-container-low)',
                    border:'1px solid var(--outline-variant)', fontWeight:600, fontSize:13,
                    color:'var(--on-surface-variant)', cursor:'pointer', transition:'all 0.25s' }}
                  onMouseEnter={e=>{ e.currentTarget.style.background='var(--primary-container)'; e.currentTarget.style.color='var(--on-primary-container)'; e.currentTarget.style.borderColor='var(--primary-container)'; }}
                  onMouseLeave={e=>{ e.currentTarget.style.background='var(--surface-container-low)'; e.currentTarget.style.color='var(--on-surface-variant)'; e.currentTarget.style.borderColor='var(--outline-variant)'; }}>
                  Login as {role}
                </button>
              ))}
            </div>
          </div>

          <p style={{ textAlign:'center', marginTop:28, fontSize:14, color:'var(--outline)' }}>
            No account?{' '}
            <Link to="/register" style={{ color:'var(--primary)', fontWeight:700 }}>Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
