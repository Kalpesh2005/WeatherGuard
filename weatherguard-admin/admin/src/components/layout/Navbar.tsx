import React from 'react';
import { useAuth } from '../../hooks/useAuth';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/8" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <span className="text-lg font-bold gradient-text">WeatherGuard</span>
            <span className="text-xs px-2 py-0.5 rounded-full text-indigo-300 font-medium"
              style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)' }}>
              Admin
            </span>
          </div>

          {/* User info */}
          {user && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                {user.avatarUrl ? (
                  <img className="h-8 w-8 rounded-full ring-2 ring-indigo-500/30" src={user.avatarUrl} alt={user.name} />
                ) : (
                  <div className="h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                    {user.name.charAt(0)}
                  </div>
                )}
                <div className="hidden sm:block">
                  <div className="text-sm font-medium text-white">{user.name}</div>
                  <div className="text-xs text-slate-400">{user.role}</div>
                </div>
              </div>
              <button
                onClick={logout}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white transition-all duration-200"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
