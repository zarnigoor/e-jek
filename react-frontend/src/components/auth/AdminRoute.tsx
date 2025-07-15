import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminRoute = ({ children }: { children: JSX.Element }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>; // Or a spinner
    return user && user.role === 'admin' ? children : <Navigate to="/login" />;
};

export default AdminRoute;