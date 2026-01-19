import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Clock,
  Key,
  LogOut,
  Shield,
  Smartphone,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { Badge, Button, Card, Modal } from '../common';

interface Session {
  id: string;
  device: string;
  browser: string;
  location: string;
  lastActive: string;
  isCurrent?: boolean;
}

interface SecuritySettingsProps {
  twoFactorEnabled?: boolean;
  sessions?: Session[];
  lastPasswordChange?: string;
  onEnableTwoFactor?: () => void;
  onDisableTwoFactor?: () => void;
  onRevokeSession?: (sessionId: string) => void;
  onRevokeAllSessions?: () => void;
  disabled?: boolean;
}

const defaultSessions: Session[] = [
  {
    id: '1',
    device: 'MacBook Pro',
    browser: 'Chrome 120',
    location: 'San Francisco, CA',
    lastActive: 'Now',
    isCurrent: true,
  },
  {
    id: '2',
    device: 'iPhone 15',
    browser: 'Safari Mobile',
    location: 'San Francisco, CA',
    lastActive: '2 hours ago',
  },
  {
    id: '3',
    device: 'Windows PC',
    browser: 'Firefox 121',
    location: 'New York, NY',
    lastActive: '3 days ago',
  },
];

export const SecuritySettings: React.FC<SecuritySettingsProps> = ({
  twoFactorEnabled = false,
  sessions = defaultSessions,
  lastPasswordChange = '2024-01-15',
  onEnableTwoFactor,
  onDisableTwoFactor,
  onRevokeSession,
  onRevokeAllSessions,
  disabled = false,
}) => {
  const [showRevokeAllModal, setShowRevokeAllModal] = useState(false);

  const handleRevokeAll = () => {
    onRevokeAllSessions?.();
    setShowRevokeAllModal(false);
  };

  const daysSincePasswordChange = Math.floor(
    (Date.now() - new Date(lastPasswordChange).getTime()) /
      (1000 * 60 * 60 * 24),
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Security Overview */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Shield className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">
              Security Settings
            </h3>
            <p className="text-sm text-neutral-500">
              Manage your account security and active sessions
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Two-Factor Authentication */}
          <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg">
                <Smartphone className="w-5 h-5 text-neutral-600" />
              </div>
              <div>
                <p className="font-medium text-neutral-900">
                  Two-Factor Authentication
                </p>
                <p className="text-sm text-neutral-500">
                  Add an extra layer of security to your account
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={twoFactorEnabled ? 'success' : 'default'}>
                {twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </Badge>
              {!disabled && (
                <Button
                  variant={twoFactorEnabled ? 'secondary' : 'primary'}
                  size="sm"
                  onClick={
                    twoFactorEnabled ? onDisableTwoFactor : onEnableTwoFactor
                  }
                >
                  {twoFactorEnabled ? 'Disable' : 'Enable'}
                </Button>
              )}
            </div>
          </div>

          {/* Password Status */}
          <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg">
                <Key className="w-5 h-5 text-neutral-600" />
              </div>
              <div>
                <p className="font-medium text-neutral-900">Password</p>
                <p className="text-sm text-neutral-500">
                  Last changed {daysSincePasswordChange} days ago
                </p>
              </div>
            </div>
            {daysSincePasswordChange > 90 && (
              <Badge variant="warning">Update Recommended</Badge>
            )}
          </div>

          {/* Login Activity */}
          <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg">
                <Clock className="w-5 h-5 text-neutral-600" />
              </div>
              <div>
                <p className="font-medium text-neutral-900">Login Activity</p>
                <p className="text-sm text-neutral-500">
                  {sessions.length} active{' '}
                  {sessions.length === 1 ? 'session' : 'sessions'}
                </p>
              </div>
            </div>
            <Badge variant="primary">{sessions.length}</Badge>
          </div>
        </div>
      </Card>

      {/* Active Sessions */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-900">
            Active Sessions
          </h3>
          {!disabled && sessions.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowRevokeAllModal(true)}
              className="text-error-600 hover:text-error-700"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out All Other Devices
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`flex items-center justify-between p-4 rounded-lg border ${
                session.isCurrent
                  ? 'bg-primary-50 border-primary-200'
                  : 'bg-white border-neutral-200'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white rounded-lg border border-neutral-200">
                  <Smartphone className="w-5 h-5 text-neutral-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-neutral-900">
                      {session.device}
                    </p>
                    {session.isCurrent && (
                      <Badge variant="primary" size="sm">
                        Current
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-neutral-500">
                    {session.browser} • {session.location}
                  </p>
                  <p className="text-xs text-neutral-400 mt-1">
                    Last active: {session.lastActive}
                  </p>
                </div>
              </div>
              {!session.isCurrent && !disabled && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRevokeSession?.(session.id)}
                  className="text-error-600 hover:text-error-700"
                >
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </div>

        {sessions.length === 0 && (
          <div className="text-center py-8 text-neutral-500">
            No active sessions
          </div>
        )}
      </Card>

      {/* Revoke All Sessions Modal */}
      <Modal
        isOpen={showRevokeAllModal}
        onClose={() => setShowRevokeAllModal(false)}
        title="Sign Out All Devices"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-warning-50 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-warning-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-warning-900">
                You will be signed out everywhere
              </p>
              <p className="text-sm text-warning-700 mt-1">
                This will sign you out of all devices except this one. You'll
                need to sign in again on those devices.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setShowRevokeAllModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleRevokeAll}
              className="bg-error-600 hover:bg-error-700"
            >
              Sign Out All Devices
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default SecuritySettings;
