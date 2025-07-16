// import { Navigate, Outlet } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthContext';

// const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
//     const { user, loading } = useAuth();
//     if (loading) return <div>Loading...</div>; // Or a spinner
//     return user ? children : <Navigate to="/login" />;
// };

// export default ProtectedRoute;


import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>; // Or a spinner
    return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;