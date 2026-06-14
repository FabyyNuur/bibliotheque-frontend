import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireBibliothecaire?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireBibliothecaire = false,
}) => {
  const { user, isAuthenticated, isBibliothecaire, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="loading">Chargement...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (
    user?.mustChangePassword &&
    location.pathname !== '/change-password'
  ) {
    return <Navigate to="/change-password" replace />;
  }

  if (requireBibliothecaire && !isBibliothecaire) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
