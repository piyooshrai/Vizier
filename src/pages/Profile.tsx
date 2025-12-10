import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { ProfileHeader, ProfileForm, DataManagement } from '../components/profile';
import { PasswordChangeForm } from '../components/auth';

export const Profile: React.FC = () => {
  const { user, isDemoMode } = useAuth();

  if (!user) {
    return null;
  }

  const handleExportData = async () => {
    // In a real app, this would call userService.exportData()
    const data = {
      user,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `vizier-data-export-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleDeleteAccount = async () => {
    if (isDemoMode) {
      localStorage.clear();
      window.location.href = '/login';
    }
    // In a real app, this would call userService.requestAccountDeletion()
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Profile Header with Avatar */}
        <ProfileHeader user={user} />

        {/* Editable Profile Form */}
        <ProfileForm user={user} disabled={isDemoMode} />

        {/* Password Change */}
        <PasswordChangeForm />

        {/* Data Management - Export & Delete */}
        <DataManagement
          onExportData={handleExportData}
          onDeleteAccount={handleDeleteAccount}
          disabled={isDemoMode}
        />
      </motion.div>
    </div>
  );
};

export default Profile;
