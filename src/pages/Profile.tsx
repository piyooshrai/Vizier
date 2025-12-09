import React from 'react';
import { motion } from 'framer-motion';
import { Mail, User, Briefcase, Calendar } from 'lucide-react';
import { Card, Avatar } from '../components/common';
import { PasswordChangeForm } from '../components/auth';
import { useAuth } from '../contexts/AuthContext';
import { formatDate } from '../utils/formatters';

const roleLabels: Record<string, string> = {
  administrator: 'Hospital Administrator',
  clinical_director: 'Clinical Director',
  quality_manager: 'Quality Manager',
  practice_manager: 'Practice Manager',
  analyst: 'Healthcare Analyst',
  other: 'Other',
};

export const Profile: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const fullName = `${user.first_name} ${user.last_name}`;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Profile Header */}
        <Card variant="elevated" padding="lg" className="mb-6">
          <div className="flex items-center gap-6">
            <Avatar name={fullName} size="xl" />
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">{fullName}</h2>
              <p className="text-neutral-600">
                {roleLabels[user.role] || user.role}
              </p>
            </div>
          </div>
        </Card>

        {/* Profile Details */}
        <Card className="mb-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            Account Details
          </h3>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-neutral-100 rounded-lg">
                <User className="w-5 h-5 text-neutral-500" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Full Name</p>
                <p className="font-medium text-neutral-900">{fullName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-neutral-100 rounded-lg">
                <Mail className="w-5 h-5 text-neutral-500" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Email</p>
                <p className="font-medium text-neutral-900">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-neutral-100 rounded-lg">
                <Briefcase className="w-5 h-5 text-neutral-500" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Role</p>
                <p className="font-medium text-neutral-900">
                  {roleLabels[user.role] || user.role}
                </p>
              </div>
            </div>

            {user.created_at && (
              <div className="flex items-center gap-3">
                <div className="p-2 bg-neutral-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-neutral-500" />
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Member Since</p>
                  <p className="font-medium text-neutral-900">
                    {formatDate(user.created_at)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Password Change */}
        <PasswordChangeForm />

        {/* Data & Privacy Section */}
        <Card className="mt-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            Data & Privacy
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-neutral-100">
              <div>
                <p className="font-medium text-neutral-900">Data Retention</p>
                <p className="text-sm text-neutral-500">
                  Your uploaded data is securely stored and encrypted
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-neutral-900">Delete Account</p>
                <p className="text-sm text-neutral-500">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <button className="text-sm text-error-600 hover:text-error-700 font-medium">
                Request deletion
              </button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Profile;
