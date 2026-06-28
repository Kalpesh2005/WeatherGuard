import React from 'react';
import type { User } from '../../types/user.types';
import { ApproveButton } from './ApproveButton';

interface UserRowProps {
  user: User;
  onActionComplete?: (success: boolean, linkUrl?: string) => void;
  showActions: boolean;
}

export const UserRow: React.FC<UserRowProps> = ({ user, onActionComplete, showActions }) => {
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            {user.avatarUrl ? (
              <img className="h-10 w-10 rounded-full" src={user.avatarUrl} alt="" />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                {user.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{user.name}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          user.hasTelegramLinked ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {user.hasTelegramLinked ? 'Linked' : 'Not Linked'}
        </span>
      </td>
      {showActions && onActionComplete && (
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <ApproveButton userId={user.id} onActionComplete={onActionComplete} />
        </td>
      )}
    </tr>
  );
};
