import React from 'react';
import type { User } from '../../types/user.types';
import { UserRow } from './UserRow';

interface UserTableProps {
  users: User[];
  showActions: boolean;
  onActionComplete?: (success: boolean, linkUrl?: string) => void;
}

export const UserTable: React.FC<UserTableProps> = ({ users, showActions, onActionComplete }) => {
  if (users.length === 0) {
    return (
      <div className="glass rounded-2xl flex flex-col items-center justify-center py-16 gap-3"
        style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="h-12 w-12 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
          <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <p className="text-slate-400 text-sm font-medium">No users found</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
      <table className="min-w-full">
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Joined</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Telegram</th>
            {showActions && (
              <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {users.map((user, idx) => (
            <UserRow
              key={user.id}
              user={user}
              showActions={showActions}
              onActionComplete={onActionComplete}
              isLast={idx === users.length - 1}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
