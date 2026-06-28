import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();

  if (user?.role !== 'admin') {
    return null;
  }

  const activeStyle = "bg-indigo-50 text-indigo-700 border-r-4 border-indigo-700 font-medium";
  const inactiveStyle = "text-gray-600 hover:bg-gray-50 hover:text-gray-900";

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 h-[calc(100vh-4rem)] flex-shrink-0">
      <div className="h-full flex flex-col pt-5 pb-4 overflow-y-auto">
        <nav className="mt-5 flex-1 px-2 space-y-1">
          <NavLink
            to="/admin/pending"
            className={({ isActive }) => `group flex items-center px-2 py-2 text-sm ${isActive ? activeStyle : inactiveStyle}`}
          >
            Pending Requests
          </NavLink>
          <NavLink
            to="/admin/approved"
            className={({ isActive }) => `group flex items-center px-2 py-2 text-sm ${isActive ? activeStyle : inactiveStyle}`}
          >
            Approved Users
          </NavLink>
        </nav>
      </div>
    </div>
  );
};
