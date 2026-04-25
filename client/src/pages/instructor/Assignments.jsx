import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../api/axios';

const InstructorAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', courseId: '', dueDate: '', maxScore: 100 });

  useEffect(() => {
    Promise.all([
      api.get('/courses/mine'),
      api.get('/assignments/instructor'),
    ]).then(([c, a]) => {
      setCourses(c.data);
      setAssignments(a.data);
    }).finally(() => setLoading(false));
  }, []);

  const createAssignment = async e => {
    e.preventDefault();
    try {
      await api.post('/assignments', form);
      const r = await api.get('/assignments/instructor');
      setAssignments(r.data);
      setShowForm(false);
      setForm({ title: '', description: '', courseId: '', dueDate: '', maxScore: 100 });
    } catch (e) { alert(e.response?.data?.message || 'Failed to create'); }
  };

  const grade = async (assignmentId, studentId, score, feedback) => {
    try {
      await api.put(`/assignments/${assignmentId}/grade/${studentId}`, { score, feedback });
      const r = await api.get('/assignments/instructor');
      setAssignments(r.data);
    } catch (e) { alert(e.response?.data?.message || 'Grading failed'); }
  };

  const getStatus = d => {
    const now = new Date();
    const due = new Date(d);
    return now > due ? 'Overdue' : 'Active';
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><div className="spinner" /></div>;

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Assignments</h1>
            <p style={{ color: 'var(--on-surface-variant)' }}>Manage course assignments</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} style={{ padding: '12px 24px', background: 'var(--primary)', color: 'white', borderRadius: 12, fontWeight: 700, cursor: 'pointer' }}>
            + New Assignment
          </button>
        </div>

        {showForm && (
          <div className="glass-card" style={{ borderRadius: 24, padding: 28, marginBottom: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Create Assignment</h2>
            <form onSubmit={createAssignment} style={{ display: 'grid', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--on-surface-variant)', marginBottom: 8 }}>Title</label>
                <input className="input-field" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--on-surface-variant)', marginBottom: 8 }}>Description</label>
                <textarea className="input-field" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--on-surface-variant)', marginBottom: 8 }}>Course</label>
                  <select className="input-field" value={form.courseId} onChange={e => setForm(f => ({ ...f, courseId: e.target.value }))} required>
                    <option value="">Select course</option>
                    {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--on-surface-variant)', marginBottom: 8 }}>Due Date</label>
                  <input className="input-field" type="datetime-local" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--on-surface-variant)', marginBottom: 8 }}>Max Score</label>
                  <input className="input-field" type="number" value={form.maxScore} onChange={e => setForm(f => ({ ...f, maxScore: e.target.value }))} min={1} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="submit" style={{ padding: '12px 24px', background: 'var(--primary)', color: 'white', borderRadius: 12, fontWeight: 700 }}>Create</button>
                <button type="button" onClick={() => setShowForm(false)} style={{ padding: '12px 24px', background: 'var(--surface-container)', borderRadius: 12, fontWeight: 700 }}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {assignments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--outline)' }}>No assignments yet</div>
        ) : (
          <div style={{ display: 'grid', gap: 20 }}>
            {assignments.map(a => (
              <div key={a._id} className="glass-card" style={{ borderRadius: 20, padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700 }}>{a.title}</h3>
                    <p style={{ fontSize: 13, color: 'var(--outline)', marginTop: 4 }}>{a.course?.title}</p>
                  </div>
                  <span style={{ padding: '4px 12px', borderRadius: 9999, fontSize: 12, fontWeight: 700,
                    background: getStatus(a.dueDate) === 'Overdue' ? 'var(--error-container)' : 'var(--primary-container)',
                    color: getStatus(a.dueDate) === 'Overdue' ? 'var(--on-error-container)' : 'var(--on-primary-container)' }}>
                    {getStatus(a.dueDate)}
                  </span>
                </div>
                <p style={{ fontSize: 14, color: 'var(--on-surface-variant)', marginBottom: 16 }}>{a.description}</p>
                <div style={{ fontSize: 13, color: 'var(--outline)', marginBottom: 16 }}>
                  Due: {new Date(a.dueDate).toLocaleDateString()} | Max Score: {a.maxScore} | Submissions: {a.submissions?.length || 0}
                </div>
                {a.submissions?.length > 0 && (
                  <div style={{ borderTop: '1px solid var(--surface-container)', paddingTop: 16 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Submissions</h4>
                    {a.submissions.map((s, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--surface-container-low)' }}>
                        <div>
                          <p style={{ fontWeight: 600, fontSize: 14 }}>{s.student?.name || 'Student'}</p>
                          <p style={{ fontSize: 12, color: 'var(--outline)' }}>{s.content?.substring(0, 60)}...</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          {s.score !== null ? (
                            <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{s.score}/{a.maxScore}</span>
                          ) : (
                            <input type="number" placeholder="Score" id={`score-${a._id}-${i}`} style={{ width: 60, padding: '6px 10px', borderRadius: 8, border: '1px solid var(--outline)' }} />
                          )}
                          <button onClick={() => {
                            const score = document.getElementById(`score-${a._id}-${i}`).value;
                            const feedback = prompt('Feedback (optional):') || '';
                            grade(a._id, s.student._id, score, feedback);
                          }} style={{ padding: '6px 14px', background: 'var(--primary)', color: 'white', borderRadius: 8, fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>
                            {s.score !== null ? 'Update' : 'Grade'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default InstructorAssignments;