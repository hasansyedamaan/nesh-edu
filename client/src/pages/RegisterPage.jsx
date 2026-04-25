import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'student' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const user = await register(form.name, form.email, form.password, form.role);
      if (user.role === 'instructor') navigate('/instructor/dashboard');
      else navigate('/dashboard');
    } catch(err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', background:'var(--background)', display:'flex',
      alignItems:'center', justifyContent:'center', padding:'40px 24px', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:'-10%', left:'-5%', width:500, height:500, borderRadius:'50%',
        background:'radial-gradient(circle, rgba(152,219,198,0.12), transparent 70%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'-15%', right:'-10%', width:600, height:600, borderRadius:'50%',
        background:'radial-gradient(circle, rgba(206,201,255,0.10), transparent 70%)', pointerEvents:'none' }} />

      <div style={{ width:'100%', maxWidth:480, position:'relative', zIndex:2 }}>
        <Link to="/" style={{ display:'flex', justifyContent:'center', marginBottom:36 }}>
          <span style={{ fontSize:32, fontWeight:900, letterSpacing:'-0.04em' }}>NESHEDU</span>
        </Link>

        <div className="glass-card" style={{ borderRadius:32, padding:48 }}>
          <h1 style={{ fontSize:28, fontWeight:800, textAlign:'center', marginBottom:8 }}>Initialize Connection</h1>
          <p style={{ fontSize:15, color:'var(--outline)', textAlign:'center', marginBottom:36 }}>Join the cognitive ecosystem</p>

          {error && (
            <div style={{ background:'var(--error-container)', color:'var(--on-error-container)',
              padding:'14px 18px', borderRadius:12, marginBottom:24, fontSize:14, fontWeight:600 }}>
              {error}
            </div>
          )}

          {/* Role picker */}
          <div style={{ marginBottom:24 }}>
            <label style={{ fontSize:13, fontWeight:700, color:'var(--on-surface-variant)',
              display:'block', marginBottom:10, letterSpacing:'0.02em' }}>I am a...</label>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              {[['student','Student','school'],['instructor','Instructor','cast_for_education']].map(([val,label,icon]) => (
                <button key={val} type="button" onClick={() => setForm(p => ({ ...p, role:val }))}
                  style={{ padding:'16px 12px', borderRadius:14, display:'flex', alignItems:'center',
                    gap:10, fontWeight:700, fontSize:14, cursor:'pointer', transition:'all 0.25s',
                    background: form.role===val ? 'var(--primary-container)' : 'var(--surface-container-low)',
                    color: form.role===val ? 'var(--on-primary-container)' : 'var(--on-surface-variant)',
                    border: form.role===val ? '2px solid var(--primary)' : '2px solid transparent' }}>
                  <span className="material-symbols-outlined" style={{ fontSize:20 }}>{icon}</span>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:20 }}>
            {[
              { name:'name', label:'Full Name', type:'text', placeholder:'Jordan Lee' },
              { name:'email', label:'Email', type:'email', placeholder:'your@email.com' },
              { name:'password', label:'Password', type:'password', placeholder:'Min. 6 characters' }
            ].map(({ name, label, type, placeholder }) => (
              <div key={name}>
                <label style={{ fontSize:13, fontWeight:700, color:'var(--on-surface-variant)',
                  display:'block', marginBottom:8 }}>{label}</label>
                <input name={name} type={type} value={form[name]} onChange={handle}
                  className="input-field" placeholder={placeholder} required minLength={name==='password' ? 6 : 1} />
              </div>
            ))}

            <button type="submit" disabled={loading}
              style={{ background:'var(--primary)', color:'white', padding:'16px', borderRadius:14,
                fontWeight:700, fontSize:15, marginTop:8, transition:'all 0.3s',
                opacity:loading ? 0.7 : 1, cursor:loading ? 'not-allowed' : 'pointer' }}
              onMouseEnter={e=>!loading && (e.currentTarget.style.transform='translateY(-2px)', e.currentTarget.style.boxShadow='0 8px 24px rgba(37,105,88,0.3)')}
              onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign:'center', marginTop:24, fontSize:14, color:'var(--outline)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color:'var(--primary)', fontWeight:700 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
