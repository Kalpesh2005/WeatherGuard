import React from 'react';
import type { User } from '../../types/user.types';
import { ApproveButton } from './ApproveButton';

interface UserRowProps {
  user: User;
  onActionComplete?: (success: boolean, linkUrl?: string) => void;
  showActions: boolean;
  isLast?: boolean;
}

export const UserRow: React.FC<UserRowProps> = ({ user, onActionComplete, showActions, isLast }) => {
  return (
    <tr
      className="transition-colors duration-150 hover:bg-white/[0.02]"
      style={!isLast ? { borderBottom: '1px solid rgba(255,255,255,0.05)' } : {}}
    >
      {/* User info */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          {user.avatarUrl ? (
            <img className="h-9 w-9 rounded-xl ring-1 ring-white/10" src={user.avatarUrl} alt="" />
          ) : (
            <div className="h-9 w-9 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              {user.name.charAt(0)}
            </div>
          )}
          <div>
            <div className="text-sm font-semibold text-white">{user.name}</div>
            <div className="text-xs text-slate-500">{user.email}</div>
          </div>
        </div>
      </td>

      {/* Joined date */}
      <td className="px-6 py-4">
        <div className="text-sm text-slate-400">
          {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      </td>

      {/* Telegram status */}
      <td className="px-6 py-4">
        {user.hasTelegramLinked ? (
          <span className="badge-linked">✓ Linked</span>
        ) : (
          <span className="badge-pending">Not linked</span>
        )}
      </td>

      {/* Actions */}
      {showActions && onActionComplete && (
        <td className="px-6 py-4 text-right">
          <ApproveButton userId={user.id} onActionComplete={onActionComplete} />
        </td>
      )}
    </tr>
  );
};
