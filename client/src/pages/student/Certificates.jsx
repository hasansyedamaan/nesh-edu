import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../api/axios';

const Certificates = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/enrollments/my')
      .then(r => setEnrollments(r.data.filter(e => e.certificateIssued)))
      .finally(() => setLoading(false));
  }, []);

  const downloadCertificate = (enrollment) => {
    const cert = `
======================================
      NESHEDU EDUCATIONAL SOCIETY
        CERTIFICATE OF
        COMPLETION
======================================

This certifies that

        ${enrollment.student?.name || 'Student'}

has successfully completed the course

        ${enrollment.course?.title}

on ${new Date(enrollment.certificateIssuedAt).toLocaleDateString()}

======================================
    Certificate ID: ${enrollment._id}
======================================
    `;
    const blob = new Blob([cert], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NESHEDU-Certificate-${enrollment.course?.title?.replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><div className="spinner" /></div>;

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Certificates</h1>
        <p style={{ color: 'var(--on-surface-variant)', marginBottom: 40 }}>Your earned certificates of completion</p>

        {enrollments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--outline)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 64, marginBottom: 16, opacity: 0.3 }}>workspace_premium</span>
            <p>No certificates yet. Complete a course to earn one!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
            {enrollments.map(e => (
              <div key={e._id} className="glass-card" style={{ borderRadius: 24, padding: 28, background: 'linear-gradient(135deg, var(--primary-container) 0%, var(--surface) 100%)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 32, color: 'var(--primary)' }}>workspace_premium</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)', background: 'var(--surface)', padding: '4px 10px', borderRadius: 9999 }}>COMPLETED</span>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{e.course?.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--outline)', marginBottom: 16 }}>Instructor: {e.course?.instructor?.name}</p>
                <p style={{ fontSize: 12, color: 'var(--on-surface-variant)', marginBottom: 20 }}>Completed on {new Date(e.certificateIssuedAt).toLocaleDateString()}</p>
                <button onClick={() => downloadCertificate(e)} style={{ width: '100%', padding: '12px', background: 'var(--primary)', color: 'white', borderRadius: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>download</span>
                  Download Certificate
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Certificates;