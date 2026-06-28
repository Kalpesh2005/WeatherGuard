import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { LoginPage } from './pages/LoginPage';
import { AuthCallbackPage } from './pages/AuthCallbackPage';
import { DashboardPage } from './pages/DashboardPage';
import { PendingRequestsPage } from './pages/PendingRequestsPage';
import { ApprovedUsersPage } from './pages/ApprovedUsersPage';
import { ProtectedRoute } from './components/common/ProtectedRoute';

const RootRedirect: React.FC = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return null;
  
  if (user) {
    if (user.role === 'admin') {
      return <Navigate to="/admin/pending" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/pending" 
            element={
              <ProtectedRoute roles={['admin']}>
                <PendingRequestsPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/approved" 
            element={
              <ProtectedRoute roles={['admin']}>
                <ApprovedUsersPage />
              </ProtectedRoute>
            } 
          />

          <Route path="/" element={<RootRedirect />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
