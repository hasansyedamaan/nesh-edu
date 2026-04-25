import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../api/axios';

const StudentAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [submission, setSubmission] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/assignments/student')
      .then(r => setAssignments(r.data))
      .finally(() => setLoading(false));
  }, []);

  const submitAssignment = async (assignmentId) => {
    if (!submission.trim()) return;
    setSubmitting(true);
    try {
      await api.post(`/assignments/${assignmentId}/submit`, { content: submission });
      const r = await api.get('/assignments/student');
      setAssignments(r.data);
      setSelected(null);
      setSubmission('');
      alert('Submitted successfully!');
    } catch (e) { alert(e.response?.data?.message || 'Submission failed'); }
    finally { setSubmitting(false); }
  };

  const getStatus = (a) => {
    const now = new Date();
    const due = new Date(a.dueDate);
    const mySub = a.submissions?.find(s => s.student?._id);
    if (mySub?.score !== null && mySub?.score !== undefined) return 'Graded';
    if (mySub) return 'Submitted';
    if (now > due) return 'Overdue';
    return 'Pending';
  };

  const getGrade = (a) => {
    const mySub = a.submissions?.find(s => s.student?._id);
    return mySub?.score !== null && mySub?.score !== undefined ? `${mySub.score}/${a.maxScore}` : null;
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><div className="spinner" /></div>;

  const statusColors = {
    Graded: { bg: 'var(--primary-container)', color: 'var(--on-primary-container)' },
    Submitted: { bg: 'rgba(152,219,198,0.2)', color: 'var(--primary)' },
    Overdue: { bg: 'var(--error-container)', color: 'var(--on-error-container)' },
    Pending: { bg: 'var(--surface-container)', color: 'var(--on-surface-variant)' },
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Assignments</h1>
        <p style={{ color: 'var(--on-surface-variant)', marginBottom: 40 }}>View and submit your course assignments</p>

        {assignments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--outline)' }}>No assignments for your enrolled courses</div>
        ) : (
          <div style={{ display: 'grid', gap: 20 }}>
            {assignments.map(a => {
              const status = getStatus(a);
              const colors = statusColors[status];
              const grade = getGrade(a);
              const mySub = a.submissions?.find(s => s.student?._id);
              return (
                <div key={a._id} className="glass-card" style={{ borderRadius: 20, padding: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 700 }}>{a.title}</h3>
                      <p style={{ fontSize: 13, color: 'var(--outline)', marginTop: 4 }}>{a.course?.title}</p>
                    </div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      {grade && <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 14 }}>{grade}</span>}
                      <span style={{ padding: '4px 12px', borderRadius: 9999, fontSize: 12, fontWeight: 700, background: colors.bg, color: colors.color }}>{status}</span>
                    </div>
                  </div>
                  <p style={{ fontSize: 14, color: 'var(--on-surface-variant)', marginBottom: 16 }}>{a.description}</p>
                  <div style={{ fontSize: 13, color: 'var(--outline)', marginBottom: 16, display: 'flex', gap: 20 }}>
                    <span>Due: {new Date(a.dueDate).toLocaleDateString()}</span>
                    <span>Max Score: {a.maxScore}</span>
                    {mySub?.feedback && <span style={{ color: 'var(--primary)' }}>Feedback: {mySub.feedback}</span>}
                  </div>
                  {status !== 'Graded' && (
                    selected === a._id ? (
                      <div style={{ marginTop: 16, padding: 20, background: 'var(--surface-container)', borderRadius: 16 }}>
                        <textarea className="input-field" rows={4} placeholder="Enter your answer..." value={submission} onChange={e => setSubmission(e.target.value)} style={{ marginBottom: 12 }} />
                        <div style={{ display: 'flex', gap: 10 }}>
                          <button onClick={() => submitAssignment(a._id)} disabled={submitting} style={{ padding: '10px 20px', background: 'var(--primary)', color: 'white', borderRadius: 10, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer' }}>{submitting ? 'Submitting...' : 'Submit'}</button>
                          <button onClick={() => { setSelected(null); setSubmission(''); }} style={{ padding: '10px 20px', background: 'var(--surface-container-high)', borderRadius: 10, fontWeight: 700 }}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      status !== 'Submitted' && <button onClick={() => setSelected(a._id)} style={{ padding: '10px 20px', background: 'var(--primary)', color: 'white', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}>Submit Assignment</button>
                    )
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentAssignments;