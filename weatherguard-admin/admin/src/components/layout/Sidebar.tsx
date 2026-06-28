import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();

  if (user?.role !== 'admin') return null;

  return (
    <div className="w-60 flex-shrink-0 h-[calc(100vh-4rem)] flex flex-col pt-6 pb-4 overflow-y-auto"
      style={{ background: 'rgba(255,255,255,0.02)', borderRight: '1px solid rgba(255,255,255,0.07)' }}>

      <div className="px-4 mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Navigation</p>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        <NavLink
          to="/admin/pending"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'text-white'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`
          }
          style={({ isActive }) => isActive ? {
            background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.15))',
            border: '1px solid rgba(99,102,241,0.3)',
            boxShadow: '0 0 20px rgba(99,102,241,0.15)'
          } : {}}
        >
          {/* Clock icon */}
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Pending Requests
        </NavLink>

        <NavLink
          to="/admin/approved"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'text-white'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`
          }
          style={({ isActive }) => isActive ? {
            background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.15))',
            border: '1px solid rgba(99,102,241,0.3)',
            boxShadow: '0 0 20px rgba(99,102,241,0.15)'
          } : {}}
        >
          {/* Check circle icon */}
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Approved Users
        </NavLink>
      </nav>
    </div>
  );
};
