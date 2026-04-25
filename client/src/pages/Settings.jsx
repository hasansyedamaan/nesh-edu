import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const SettingsPage = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [profile, setProfile] = useState({ name: '', bio: '', avatar: '' });
  const [passwords, setPasswords] = useState({ current: '', new: '' });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (user) setProfile({ name: user.name || '', bio: user.bio || '', avatar: user.avatar || '' });
  }, [user]);

  const handleAvatar = e => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setProfile(p => ({ ...p, avatarFile: file }));
    }
  };

  const saveProfile = async e => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      const fd = new FormData();
      fd.append('name', profile.name);
      fd.append('bio', profile.bio);
      if (profile.avatarFile) fd.append('avatar', profile.avatarFile);
      const r = await api.put('/auth/profile', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setUser(r.data);
      setMsg('Profile updated!');
    } catch (e) { setMsg(e.response?.data?.message || 'Update failed'); }
    finally { setLoading(false); }
  };

  const changePassword = async e => {
    e.preventDefault();
    if (passwords.new.length < 6) { setMsg('Password must be at least 6 characters'); return; }
    setLoading(true);
    setMsg('');
    try {
      await api.put('/auth/change-password', { currentPassword: passwords.current, newPassword: passwords.new });
      setMsg('Password changed!');
      setPasswords({ current: '', new: '' });
    } catch (e) { setMsg(e.response?.data?.message || 'Password change failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Settings</h1>
        <p style={{ color: 'var(--on-surface-variant)', marginBottom: 40 }}>Manage your account settings</p>

        {msg && <div style={{ background: msg.includes('!') ? 'var(--primary-container)' : 'var(--error-container)',
          color: msg.includes('!') ? 'var(--on-primary-container)' : 'var(--on-error-container)',
          padding: '14px 18px', borderRadius: 12, marginBottom: 24, fontSize: 14, fontWeight: 600 }}>{msg}</div>}

        <div style={{ display: 'grid', gap: 32, maxWidth: 600 }}>
          {/* Profile */}
          <div className="glass-card" style={{ borderRadius: 24, padding: 28 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Profile</h2>
            <form onSubmit={saveProfile}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden',
                  background: 'var(--primary-container)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {preview || profile.avatar ? <img src={preview || profile.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> :
                    <span style={{ fontSize: 28, fontWeight: 800, color: 'var(--on-primary-container)' }}>{user?.name?.charAt(0)}</span>}
                </div>
                <label style={{ cursor: 'pointer', padding: '10px 20px', borderRadius: 12, background: 'var(--surface-container)',
                  fontWeight: 600, fontSize: 14, transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-container-high)'} onMouseLeave={e => e.currentTarget.style.background = 'var(--surface-container)'}>
                  Change Photo
                  <input type="file" accept="image/*" onChange={handleAvatar} style={{ display: 'none' }} />
                </label>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--on-surface-variant)', marginBottom: 8 }}>Full Name</label>
                <input className="input-field" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} required />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--on-surface-variant)', marginBottom: 8 }}>Bio</label>
                <textarea className="input-field" rows={3} value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} placeholder="Tell us about yourself..." />
              </div>
              <button type="submit" disabled={loading} style={{ padding: '14px 28px', background: 'var(--primary)', color: 'white', borderRadius: 12, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>Save Changes</button>
            </form>
          </div>

          {/* Password */}
          <div className="glass-card" style={{ borderRadius: 24, padding: 28 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Change Password</h2>
            <form onSubmit={changePassword}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--on-surface-variant)', marginBottom: 8 }}>Current Password</label>
                <input className="input-field" type="password" value={passwords.current} onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))} required />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--on-surface-variant)', marginBottom: 8 }}>New Password</label>
                <input className="input-field" type="password" value={passwords.new} onChange={e => setPasswords(p => ({ ...p, new: e.target.value }))} required minLength={6} />
              </div>
              <button type="submit" disabled={loading} style={{ padding: '14px 28px', background: 'var(--secondary)', color: 'white', borderRadius: 12, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>Update Password</button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;