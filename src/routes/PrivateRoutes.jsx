
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, roles, user }) => {
    
    if (!user) {
        return <Navigate to="/login" />;
    }
    if (!roles.includes(user.role)) {
        return <Navigate to="/" />;
    }
    return children;
};

export default PrivateRoute;
