import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../api/axios';

const InstructorStudents = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/courses/mine')
      .then(r => {
        setCourses(r.data);
        if (r.data.length > 0) setSelectedCourse(r.data[0]._id);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      api.get(`/enrollments/course/${selectedCourse}/students`)
        .then(r => setEnrollments(r.data))
        .catch(() => setEnrollments([]));
    }
  }, [selectedCourse]);

  const getProgress = (e) => {
    if (!e.course) return 0;
    const total = e.course.modules?.reduce((a, m) => a + (m.lessons?.length || 0), 0) || 0;
    return total > 0 ? Math.round((e.completedLessons?.length || 0) / total * 100) : 0;
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><div className="spinner" /></div>;

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>My Students</h1>
        <p style={{ color: 'var(--on-surface-variant)', marginBottom: 32 }}>Manage students enrolled in your courses</p>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--on-surface-variant)', marginBottom: 8 }}>Select Course</label>
          <select className="input-field" style={{ maxWidth: 400 }} value={selectedCourse || ''} onChange={e => setSelectedCourse(e.target.value)}>
            {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
          </select>
        </div>

        {enrollments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--outline)' }}>No students enrolled in this course yet</div>
        ) : (
          <div className="glass-card" style={{ borderRadius: 20, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--surface-container)' }}>
                  <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--outline)', textTransform: 'uppercase' }}>Student</th>
                  <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--outline)', textTransform: 'uppercase' }}>Enrolled</th>
                  <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--outline)', textTransform: 'uppercase' }}>Progress</th>
                  <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--outline)', textTransform: 'uppercase' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map(e => (
                  <tr key={e._id} style={{ borderBottom: '1px solid var(--surface-container-low)' }}>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary-container)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--on-primary-container)' }}>
                          {e.student?.avatar ? <img src={e.student.avatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : e.student?.name?.charAt(0)}
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, fontSize: 14 }}>{e.student?.name}</p>
                          <p style={{ fontSize: 12, color: 'var(--outline)' }}>{e.student?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: 13, color: 'var(--on-surface-variant)' }}>{new Date(e.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div className="progress-track" style={{ flex: 1, height: 6 }}><div className="progress-fill" style={{ width: `${getProgress(e)}%` }} /></div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>{getProgress(e)}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      {e.certificateIssued ? (
                        <span style={{ padding: '4px 10px', borderRadius: 9999, fontSize: 11, fontWeight: 700, background: 'var(--primary-container)', color: 'var(--on-primary-container)' }}>Completed</span>
                      ) : (
                        <span style={{ padding: '4px 10px', borderRadius: 9999, fontSize: 11, fontWeight: 700, background: 'var(--surface-container)', color: 'var(--on-surface-variant)' }}>In Progress</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default InstructorStudents;