import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../api/axios';

const ROLES = ['all','admin','instructor','student'];

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [updating, setUpdating] = useState('');
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit:15 });
      if (role !== 'all') params.set('role', role);
      if (search) params.set('search', search);
      const r = await api.get(`/users?${params}`);
      setUsers(r.data.users);
      setTotal(r.data.total);
      setPages(r.data.pages);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [page, role]);
  useEffect(() => { const t = setTimeout(load, 400); return ()=>clearTimeout(t); }, [search]);

  const changeRole = async (userId, newRole) => {
    setUpdating(userId);
    try {
      await api.put(`/users/${userId}/role`, { role:newRole });
      setUsers(p => p.map(u => u._id === userId ? { ...u, role:newRole } : u));
      showToast(`✅ Role updated to ${newRole}`);
    } catch { showToast('❌ Failed to update role.'); }
    finally { setUpdating(''); }
  };

  const deactivate = async (userId) => {
    if (!window.confirm('Deactivate this user?')) return;
    await api.delete(`/users/${userId}`);
    showToast('User deactivated.');
    load();
  };

  const roleColors = { admin:'var(--error)', instructor:'var(--secondary)', student:'var(--primary)' };
  const roleBg = { admin:'var(--error-container)', instructor:'var(--secondary-container)', student:'var(--primary-container)' };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        {toast && <div className="toast success">{toast}</div>}

        <div style={{ marginBottom:32 }}>
          <h1 style={{ fontSize:28, fontWeight:800, marginBottom:6 }}>User Management</h1>
          <p style={{ color:'var(--on-surface-variant)' }}>Manage all platform users and roles. Total: <b>{total}</b></p>
        </div>

        {/* Filters */}
        <div style={{ display:'flex', gap:12, marginBottom:28, flexWrap:'wrap', alignItems:'center' }}>
          <div style={{ position:'relative', flex:1, maxWidth:360 }}>
            <span className="material-symbols-outlined" style={{ position:'absolute', left:14, top:'50%',
              transform:'translateY(-50%)', color:'var(--outline)', fontSize:20, pointerEvents:'none' }}>search</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} className="input-field"
              placeholder="Search by name..." style={{ paddingLeft:46 }} />
          </div>
          {ROLES.map(r => (
            <button key={r} onClick={() => { setRole(r); setPage(1); }}
              style={{ padding:'10px 20px', borderRadius:9999, fontWeight:700, fontSize:13, cursor:'pointer',
                background: role===r ? 'var(--primary)' : 'white',
                color: role===r ? 'white' : 'var(--on-surface-variant)',
                border: role===r ? '2px solid var(--primary)' : '2px solid var(--outline-variant)',
                textTransform:'capitalize' }}>
              {r === 'all' ? 'All Roles' : r}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="glass-card" style={{ borderRadius:24, overflow:'hidden' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:14 }}>
            <thead>
              <tr style={{ background:'var(--surface-container-low)' }}>
                {['User','Email','Role','Joined','Actions'].map(h => (
                  <th key={h} style={{ padding:'14px 20px', textAlign:'left', fontSize:12,
                    fontWeight:800, color:'var(--outline)', letterSpacing:'0.06em', textTransform:'uppercase',
                    borderBottom:'1px solid var(--surface-container)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ textAlign:'center', padding:48 }}><div className="spinner" style={{ margin:'0 auto' }}/></td></tr>
              ) : users.map((u, i) => (
                <tr key={u._id} style={{ background: i%2===0 ? 'transparent' : 'rgba(247,249,251,0.5)',
                  transition:'background 0.2s' }}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(152,219,198,0.06)'}
                  onMouseLeave={e=>e.currentTarget.style.background=i%2===0?'transparent':'rgba(247,249,251,0.5)'}>
                  <td style={{ padding:'14px 20px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:36, height:36, borderRadius:'50%', background:roleBg[u.role]||'var(--surface-container)',
                        display:'flex', alignItems:'center', justifyContent:'center',
                        fontSize:14, fontWeight:800, color:roleColors[u.role], overflow:'hidden', flexShrink:0 }}>
                        {u.avatar ? <img src={u.avatar} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : u.name.charAt(0)}
                      </div>
                      <span style={{ fontWeight:700 }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ padding:'14px 20px', color:'var(--outline)' }}>{u.email}</td>
                  <td style={{ padding:'14px 20px' }}>
                    <select value={u.role} disabled={updating===u._id}
                      onChange={e => changeRole(u._id, e.target.value)}
                      style={{ padding:'6px 10px', borderRadius:8, border:`1px solid ${roleBg[u.role]}`,
                        background:roleBg[u.role], color:roleColors[u.role],
                        fontWeight:700, fontSize:12, cursor:'pointer', fontFamily:'Manrope', outline:'none' }}>
                      <option value="student">Student</option>
                      <option value="instructor">Instructor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td style={{ padding:'14px 20px', color:'var(--outline)', fontSize:13 }}>
                    {new Date(u.createdAt).toLocaleDateString('en-US',{ month:'short', day:'numeric', year:'numeric' })}
                  </td>
                  <td style={{ padding:'14px 20px' }}>
                    <button onClick={() => deactivate(u._id)}
                      style={{ padding:'6px 14px', borderRadius:8, background:'var(--error-container)',
                        color:'var(--on-error-container)', fontSize:12, fontWeight:700, cursor:'pointer' }}>
                      Deactivate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div style={{ display:'flex', justifyContent:'center', gap:10, marginTop:24 }}>
            {Array.from({ length:pages }, (_,i) => i+1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                style={{ width:38, height:38, borderRadius:10, fontWeight:700, fontSize:13, cursor:'pointer',
                  background: page===p ? 'var(--primary)' : 'white',
                  color: page===p ? 'white' : 'var(--on-surface)',
                  border: page===p ? '2px solid var(--primary)' : '2px solid var(--outline-variant)' }}>
                {p}
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default UserManagement;
