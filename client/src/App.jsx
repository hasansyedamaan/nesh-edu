import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CurriculumPage from './pages/CurriculumPage';
import AnalyticsPage from './pages/AnalyticsPage';
import MentorsPage from './pages/MentorsPage';
import LibraryPage from './pages/LibraryPage';
import WelcomePage from './pages/WelcomePage';
import DemoCoursePage from './pages/DemoCoursePage';
import ContactPage from './pages/ContactPage';
import SettingsPage from './pages/Settings';
import StudentDashboard from './pages/student/Dashboard';
import StudentAssignments from './pages/student/Assignments';
import StudentCertificates from './pages/student/Certificates';
import CourseBrowser from './pages/student/CourseBrowser';
import CourseDetail from './pages/student/CourseDetail';
import LessonPlayer from './pages/student/LessonPlayer';
import InstructorDashboard from './pages/instructor/Dashboard';
import InstructorCourses from './pages/instructor/Courses';
import InstructorAssignments from './pages/instructor/Assignments';
import InstructorStudents from './pages/instructor/Students';
import CourseCreator from './pages/instructor/CourseCreator';
import CourseEditor from './pages/instructor/CourseEditor';
import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import AdminCourses from './pages/admin/CourseManagement';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { user, loading } = useAuth();

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'var(--background)' }}>
      <div className="spinner" />
    </div>
  );

  const redirectDashboard = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'instructor') return '/instructor/dashboard';
    return '/dashboard';
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={user ? <Navigate to={redirectDashboard()} /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to={redirectDashboard()} /> : <RegisterPage />} />
        <Route path="/curriculum" element={<CurriculumPage />} />
        <Route path="/analytics" element={<ProtectedRoute roles={['student','instructor','admin']}><AnalyticsPage /></ProtectedRoute>} />
        <Route path="/mentors" element={<MentorsPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/demo-course" element={<DemoCoursePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/courses" element={<CourseBrowser />} />
        <Route path="/courses/:id" element={<CourseDetail />} />

        {/* Student */}
        <Route path="/dashboard" element={<ProtectedRoute roles={['student']}><StudentDashboard /></ProtectedRoute>} />
        <Route path="/dashboard/assignments" element={<ProtectedRoute roles={['student']}><StudentAssignments /></ProtectedRoute>} />
        <Route path="/dashboard/certificates" element={<ProtectedRoute roles={['student']}><StudentCertificates /></ProtectedRoute>} />
        <Route path="/learn/:courseId/:lessonId" element={<ProtectedRoute roles={['student', 'admin']}><LessonPlayer /></ProtectedRoute>} />

        {/* Instructor */}
        <Route path="/instructor/dashboard" element={<ProtectedRoute roles={['instructor','admin']}><InstructorDashboard /></ProtectedRoute>} />
        <Route path="/instructor/courses" element={<ProtectedRoute roles={['instructor','admin']}><InstructorCourses /></ProtectedRoute>} />
        <Route path="/instructor/courses/create" element={<ProtectedRoute roles={['instructor','admin']}><CourseCreator /></ProtectedRoute>} />
        <Route path="/instructor/courses/:id/edit" element={<ProtectedRoute roles={['instructor','admin']}><CourseEditor /></ProtectedRoute>} />
        <Route path="/instructor/assignments" element={<ProtectedRoute roles={['instructor','admin']}><InstructorAssignments /></ProtectedRoute>} />
        <Route path="/instructor/students" element={<ProtectedRoute roles={['instructor','admin']}><InstructorStudents /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><UserManagement /></ProtectedRoute>} />
        <Route path="/admin/courses" element={<ProtectedRoute roles={['admin']}><AdminCourses /></ProtectedRoute>} />

        {/* Settings - all roles */}
        <Route path="/settings" element={<ProtectedRoute roles={['student','instructor','admin']}><SettingsPage /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
