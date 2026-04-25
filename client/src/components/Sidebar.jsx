import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const studentNav = [
  { icon:'dashboard', label:'Dashboard', to:'/dashboard' },
  { icon:'menu_book', label:'My Courses', to:'/courses' },
  { icon:'assignment', label:'Assignments', to:'/dashboard/assignments' },
  { icon:'emoji_events', label:'Certificates', to:'/dashboard/certificates' },
  { icon:'settings', label:'Settings', to:'/settings' },
];
const instructorNav = [
  { icon:'dashboard', label:'Dashboard', to:'/instructor/dashboard' },
  { icon:'school', label:'My Courses', to:'/instructor/courses' },
  { icon:'add_circle', label:'Create Course', to:'/instructor/courses/create' },
  { icon:'assignment', label:'Assignments', to:'/instructor/assignments' },
  { icon:'people', label:'Students', to:'/instructor/students' },
  { icon:'settings', label:'Settings', to:'/settings' },
];
const adminNav = [
  { icon:'dashboard', label:'Dashboard', to:'/admin/dashboard' },
  { icon:'manage_accounts', label:'Users', to:'/admin/users' },
  { icon:'library_books', label:'Courses', to:'/admin/courses' },
  { icon:'settings', label:'Settings', to:'/settings' },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems =
    user?.role === 'admin' ? adminNav :
    user?.role === 'instructor' ? instructorNav :
    studentNav;

  const roleColor = { admin:'var(--error)', instructor:'var(--secondary)', student:'var(--primary)' }[user?.role] || 'var(--primary)';
  const roleBg   = { admin:'var(--error-container)', instructor:'var(--secondary-container)', student:'var(--primary-container)' }[user?.role] || 'var(--primary-container)';

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div style={{ padding:'0 28px 32px', borderBottom:'1px solid var(--surface-container)' }}>
        <span style={{ fontSize:26, fontWeight:900, letterSpacing:'-0.04em', cursor:'pointer' }}
          onClick={() => navigate('/')}>NESH</span>
        <div style={{ marginTop:20, display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:40, height:40, borderRadius:'50%', background:roleBg,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontWeight:800, color:roleColor, fontSize:15, overflow:'hidden' }}>
            {user?.avatar
              ? <img src={user.avatar} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              : user?.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ overflow:'hidden' }}>
            <p style={{ fontWeight:700, fontSize:14, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
              {user?.name}
            </p>
            <span style={{ fontSize:11, fontWeight:700, color:roleColor, background:roleBg,
              padding:'2px 8px', borderRadius:9999, letterSpacing:'0.08em', textTransform:'uppercase' }}>
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:'24px 0', display:'flex', flexDirection:'column', gap:4 }}>
        {navItems.map(({ icon, label, to }) => (
          <NavLink key={label} to={to}
            className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}>
            <span className="material-symbols-outlined" style={{ fontSize:22 }}>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ padding:'24px 28px', borderTop:'1px solid var(--surface-container)' }}>
        <button onClick={() => { logout(); navigate('/'); }}
          style={{ display:'flex', alignItems:'center', gap:12, width:'100%',
            padding:'12px 16px', borderRadius:12, fontWeight:600, fontSize:14,
            color:'var(--outline)', transition:'all 0.25s', cursor:'pointer', background:'none' }}
          onMouseEnter={e=>{ e.currentTarget.style.background='var(--error-container)'; e.currentTarget.style.color='var(--on-error-container)'; }}
          onMouseLeave={e=>{ e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--outline)'; }}>
          <span className="material-symbols-outlined" style={{ fontSize:20 }}>logout</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
