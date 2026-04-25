import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../api/axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/users/admin/stats'),
      api.get('/users?limit=5')
    ]).then(([sR, uR]) => {
      setStats(sR.data);
      setUsers(uR.data.users);
    }).finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { icon:'group', label:'Total Users', value:stats.totalUsers, color:'var(--primary)', bg:'var(--primary-container)' },
    { icon:'school', label:'Students', value:stats.totalStudents, color:'var(--secondary)', bg:'var(--secondary-container)' },
    { icon:'cast_for_education', label:'Instructors', value:stats.totalInstructors, color:'var(--tertiary)', bg:'var(--tertiary-container)' },
    { icon:'library_books', label:'Total Courses', value:stats.totalCourses, color:'var(--primary)', bg:'rgba(152,219,198,0.2)' },
    { icon:'published_with_changes', label:'Published', value:stats.publishedCourses, color:'var(--secondary)', bg:'rgba(206,201,255,0.2)' },
    { icon:'how_to_reg', label:'Enrollments', value:stats.totalEnrollments, color:'var(--tertiary)', bg:'rgba(245,195,179,0.2)' },
  ] : [];

  const roleColors = { admin:'var(--error)', instructor:'var(--secondary)', student:'var(--primary)' };
  const roleBg = { admin:'var(--error-container)', instructor:'var(--secondary-container)', student:'var(--primary-container)' };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <div style={{ marginBottom:40 }}>
          <h1 style={{ fontSize:28, fontWeight:800, marginBottom:6 }}>Admin Control Center</h1>
          <p style={{ color:'var(--on-surface-variant)', fontSize:16 }}>Platform overview and management.</p>
        </div>

        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', padding:60 }}><div className="spinner"/></div>
        ) : (
          <>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20, marginBottom:48 }}>
              {statCards.map(({ icon, label, value, color, bg }) => (
                <div key={label} className="stat-card">
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                    <div>
                      <p style={{ fontSize:13, fontWeight:700, color:'var(--outline)', marginBottom:12 }}>{label}</p>
                      <p style={{ fontSize:36, fontWeight:900, color:'var(--on-surface)' }}>{value?.toLocaleString()}</p>
                    </div>
                    <div style={{ width:52, height:52, borderRadius:16, background:bg,
                      display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <span className="material-symbols-outlined" style={{ color, fontSize:26 }}>{icon}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Platform Health */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:28, marginBottom:48 }}>
              <div className="glass-card" style={{ borderRadius:24, padding:28 }}>
                <h2 style={{ fontSize:18, fontWeight:700, marginBottom:6 }}>Platform Health</h2>
                <p style={{ fontSize:13, color:'var(--outline)', marginBottom:24 }}>Key performance indicators</p>
                {[
                  { label:'Course Publishing Rate', value: stats.totalCourses > 0 ? Math.round(stats.publishedCourses/stats.totalCourses*100) : 0, color:'var(--primary)' },
                  { label:'Student-to-Instructor Ratio', value: stats.totalInstructors > 0 ? Math.round(stats.totalStudents/stats.totalInstructors) : 0, suffix:':1', color:'var(--secondary)' },
                  { label:'Avg Enrollments per Course', value: stats.totalCourses > 0 ? Math.round(stats.totalEnrollments/stats.totalCourses) : 0, color:'var(--tertiary)' },
                ].map(({ label, value, suffix='%', color }) => (
                  <div key={label} style={{ marginBottom:20 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                      <span style={{ fontSize:13, fontWeight:600, color:'var(--on-surface-variant)' }}>{label}</span>
                      <span style={{ fontSize:14, fontWeight:800, color }}>{value}{suffix}</span>
                    </div>
                    {suffix === '%' && (
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width:`${Math.min(value,100)}%`, background:color }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="glass-card" style={{ borderRadius:24, padding:28 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
                  <h2 style={{ fontSize:18, fontWeight:700 }}>Recent Users</h2>
                  <a href="/admin/users" style={{ fontSize:13, fontWeight:700, color:'var(--primary)' }}>View all →</a>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  {users.map(u => (
                    <div key={u._id} style={{ display:'flex', alignItems:'center', gap:12,
                      padding:'10px 0', borderBottom:'1px solid var(--surface-container-low)' }}>
                      <div style={{ width:36, height:36, borderRadius:'50%',
                        background:roleBg[u.role]||'var(--surface-container)',
                        display:'flex', alignItems:'center', justifyContent:'center',
                        fontSize:14, fontWeight:800, color:roleColors[u.role]||'var(--outline)', overflow:'hidden', flexShrink:0 }}>
                        {u.avatar ? <img src={u.avatar} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : u.name.charAt(0)}
                      </div>
                      <div style={{ flex:1 }}>
                        <p style={{ fontWeight:700, fontSize:14 }}>{u.name}</p>
                        <p style={{ fontSize:12, color:'var(--outline)' }}>{u.email}</p>
                      </div>
                      <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:9999,
                        background:roleBg[u.role]||'var(--surface-container)',
                        color:roleColors[u.role]||'var(--outline)', textTransform:'uppercase', letterSpacing:'0.05em' }}>
                        {u.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
