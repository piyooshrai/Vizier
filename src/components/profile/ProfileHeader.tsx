import React from 'react';
import { motion } from 'framer-motion';
import { Avatar, Badge } from '../common';
import { User } from '../../types';

interface ProfileHeaderProps {
  user: User;
  isDemoMode?: boolean;
}

const roleLabels: Record<string, string> = {
  platform_administrator: 'Platform Administrator',
  organization_owner: 'Organization Owner',
  organization_administrator: 'Organization Administrator',
  hospital_administrator: 'Hospital Administrator',
  data_analyst: 'Data Analyst',
  clinical_director: 'Clinical Director',
  quality_manager: 'Quality Manager',
  administrator: 'Hospital Administrator',
  analyst: 'Healthcare Analyst',
  practice_manager: 'Practice Manager',
  other: 'Other',
};

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  isDemoMode = false,
}) => {
  const fullName = `${user.first_name} ${user.last_name}`;
  const roleLabel = roleLabels[user.role] || user.role;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-neutral-200 p-6 shadow-card"
    >
      <div className="flex items-center gap-6">
        {/* Avatar */}
        <Avatar name={fullName} size="xl" />

        {/* User Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-2xl font-bold text-neutral-900">{fullName}</h2>
            {isDemoMode && (
              <Badge variant="warning">Demo</Badge>
            )}
          </div>
          <p className="text-neutral-600">{roleLabel}</p>
          <p className="text-sm text-neutral-500 mt-1">{user.email}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileHeader;
