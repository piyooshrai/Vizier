import { motion } from 'framer-motion';
import { Briefcase, Calendar, Mail, User } from 'lucide-react';
import type React from 'react';
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
    <div className="h-full overflow-y-auto">
      <div className="p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Profile Header */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-6 mb-6">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-black text-2xl font-bold">
                  {user.first_name?.[0]}
                  {user.last_name?.[0]}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{fullName}</h2>
                  <p className="text-gray-400">
                    {roleLabels[user.role] || user.role}
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Account Details
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-700/50 rounded-lg">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium text-white">{fullName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-700/50 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-white">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-700/50 rounded-lg">
                    <Briefcase className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Role</p>
                    <p className="font-medium text-white">
                      {roleLabels[user.role] || user.role}
                    </p>
                  </div>
                </div>

                {user.created_at && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-700/50 rounded-lg">
                      <Calendar className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Member Since</p>
                      <p className="font-medium text-white">
                        {formatDate(user.created_at)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Password Change */}
            <PasswordChangeForm />

            {/* Data & Privacy Section */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-6 mt-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Data & Privacy
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-700">
                  <div>
                    <p className="font-medium text-white">Data Retention</p>
                    <p className="text-sm text-gray-400">
                      Your uploaded data is securely stored and encrypted
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-white">Delete Account</p>
                    <p className="text-sm text-gray-400">
                      Permanently delete your account and all associated data
                    </p>
                  </div>
                  <button
                    type="button"
                    className="text-sm text-red-400 hover:text-red-300 font-medium"
                  >
                    Request deletion
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
