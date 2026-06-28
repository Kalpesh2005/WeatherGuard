import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { UserRole } from '../../types/user.types';
import { Loader } from './Loader';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
};
