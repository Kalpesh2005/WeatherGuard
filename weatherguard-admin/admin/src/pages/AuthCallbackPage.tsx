import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader } from '../components/common/Loader';

export const AuthCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      login(token);
    } else {
      navigate('/login');
    }
  }, [token, login, navigate]);

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin/pending');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);

  return <Loader />;
};
