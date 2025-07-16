import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Spinner from './components/ui/Spinner';
import DashboardLayout from './layouts/DashboardLayout';

// User Pages
import SubmitApplication from './pages/user/SubmitApplication';
import MyApplications from './pages/user/MyApplications';

// Admin Pages
import Statistics from './pages/admin/Statistics';
import ApplicationsList from './pages/admin/ApplicationsList';
import UsersList from './pages/admin/UsersList';
import CreateUser from './pages/admin/CreateUser';

// const GuestRoute = ({ children }: { children: JSX.Element }) => {
const GuestRoute = ({ children }: { children: React.ReactElement }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen"><Spinner /></div>;
  return user ? <Navigate to={user.role === 'admin' ? '/admin' : '/user'} /> : children;
};

const ProtectedRoute = ({ role }: { role: 'user' | 'admin' }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen"><Spinner /></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/user'} replace />;
  }

  return (
    // <DashboardLayout>
    //   <Outlet />
    // </DashboardLayout>
    <DashboardLayout children={<Outlet />} />
  );
};


function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        
        {/* User Routes */}
        <Route element={<ProtectedRoute role="user" />}>
          <Route path="/user" element={<Navigate to="/user/my-applications" replace />} />
          <Route path="/user/submit-application" element={<SubmitApplication />} />
          <Route path="/user/my-applications" element={<MyApplications />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="/admin" element={<Navigate to="/admin/stats" replace />} />
          <Route path="/admin/stats" element={<Statistics />} />
          <Route path="/admin/applications" element={<ApplicationsList />} />
          <Route path="/admin/users" element={<UsersList />} />
          <Route path="/admin/create-user" element={<CreateUser />} />
        </Route>
        
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;

