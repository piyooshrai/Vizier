import { motion } from 'framer-motion';
import { Bell, Building2, CreditCard, Globe, Plug, Shield } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { AuthModal } from '../components/auth/AuthModal';
import { PasswordChangeForm } from '../components/auth/PasswordChangeForm';
import { useAuth } from '../contexts/AuthContext';
import {
  authService,
  getErrorMessage,
  organizationsService,
  paymentService,
} from '../services';
import type { User } from '../types';

type SettingsTab = 'organization' | 'billing' | 'security' | 'integrations';

interface SettingsSection {
  id: SettingsTab;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const settingsSections: SettingsSection[] = [
  {
    id: 'organization',
    label: 'Organization',
    icon: <Building2 className="w-5 h-5" />,
    description: 'Manage your organization settings and preferences',
  },
  {
    id: 'billing',
    label: 'Billing',
    icon: <CreditCard className="w-5 h-5" />,
    description: 'Manage your subscription and payment methods',
  },
  {
    id: 'security',
    label: 'Security',
    icon: <Shield className="w-5 h-5" />,
    description: 'Configure security settings and access controls',
  },
  {
    id: 'integrations',
    label: 'Integrations',
    icon: <Plug className="w-5 h-5" />,
    description: 'Connect external systems and data sources',
  },
];

const memberRoleOptions = [
  'Platform Administrator',
  'Support Administrator',
  'Organization Owner',
  'Organization Administrator',
  'Executive',
  'Department Director',
  'Clinician/Provider',
  'Clinical Manager',
  'Quality/Compliance Officer',
  'Data Analyst',
  'Read-Only Analyst',
  'Revenue Cycle Director',
  'Billing Manager',
  'Auditor (External)',
  'Board Member',
];

export const Settings: React.FC = () => {
  const { isDemoMode } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>('organization');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [members, setMembers] = useState<User[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [membersError, setMembersError] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Data Analyst');
  const [inviteToken, setInviteToken] = useState('');
  const [inviteExpiresAt, setInviteExpiresAt] = useState('');
  const [inviteError, setInviteError] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [updatingMemberId, setUpdatingMemberId] = useState<string | null>(null);
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);
  const [billingError, setBillingError] = useState('');
  const [billingLoading, setBillingLoading] = useState(false);
  const [securityMessage, setSecurityMessage] = useState('');

  useEffect(() => {
    if (isDemoMode || activeTab !== 'organization') return;

    let isMounted = true;
    const loadMembers = async () => {
      setMembersLoading(true);
      setMembersError('');
      try {
        const response = await organizationsService.listMembers();
        if (isMounted) {
          setMembers(response);
        }
      } catch (error) {
        if (isMounted) {
          setMembersError(getErrorMessage(error));
        }
      } finally {
        if (isMounted) {
          setMembersLoading(false);
        }
      }
    };

    loadMembers();

    return () => {
      isMounted = false;
    };
  }, [activeTab, isDemoMode]);

  const handleInvite = async () => {
    if (!inviteEmail) return;
    setInviteError('');
    setIsInviting(true);
    try {
      const response = await organizationsService.inviteMember(
        inviteEmail,
        inviteRole,
      );
      setInviteToken(response.token);
      setInviteExpiresAt(response.expires_at);
      setInviteEmail('');
    } catch (error) {
      setInviteError(getErrorMessage(error));
    } finally {
      setIsInviting(false);
    }
  };

  const handleRoleChange = async (userId: string, role: string) => {
    setMembersError('');
    setUpdatingMemberId(userId);
    try {
      const updated = await organizationsService.updateMemberRole(userId, role);
      setMembers((prev) =>
        prev.map((member) => (member.id === userId ? updated : member)),
      );
    } catch (error) {
      setMembersError(getErrorMessage(error));
    } finally {
      setUpdatingMemberId(null);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    const confirmed = globalThis.confirm(
      'Remove this member? This will delete their account.',
    );
    if (!confirmed) return;

    setMembersError('');
    setRemovingMemberId(userId);
    try {
      await organizationsService.removeMember(userId);
      setMembers((prev) => prev.filter((member) => member.id !== userId));
    } catch (error) {
      setMembersError(getErrorMessage(error));
    } finally {
      setRemovingMemberId(null);
    }
  };

  const handleCheckout = async () => {
    setBillingError('');
    setBillingLoading(true);
    try {
      const response = await paymentService.createCheckoutSession();
      const redirectUrl =
        response.url || response.checkout_url || response.session_url;
      if (redirectUrl) {
        globalThis.location.href = redirectUrl;
        return;
      }
      setBillingError(
        'Checkout session created, but no redirect URL returned.',
      );
    } catch (error) {
      setBillingError(getErrorMessage(error));
    } finally {
      setBillingLoading(false);
    }
  };

  const handleRevokeAllSessions = async () => {
    setSecurityMessage('');
    try {
      await authService.revokeAllSessions();
      setSecurityMessage('All other sessions have been revoked.');
    } catch (error) {
      setSecurityMessage(getErrorMessage(error));
    }
  };

  const renderOrganizationSettings = () => (
    <div className="space-y-6">
      <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Organization Details
        </h3>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="org-name"
              className="block text-sm font-medium text-gray-400 mb-1"
            >
              Organization Name
            </label>
            <input
              id="org-name"
              type="text"
              defaultValue={isDemoMode ? 'Demo Healthcare System' : ''}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50"
              placeholder="Your organization name"
              disabled={isDemoMode}
            />
          </div>
          <div>
            <label
              htmlFor="org-type"
              className="block text-sm font-medium text-gray-400 mb-1"
            >
              Organization Type
            </label>
            <select
              id="org-type"
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50"
              defaultValue={isDemoMode ? 'hospital_system' : ''}
              disabled={isDemoMode}
            >
              <option value="hospital_system">Hospital System</option>
              <option value="clinic">Medical Clinic</option>
              <option value="practice">Medical Practice</option>
              <option value="health_plan">Health Plan</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-white">Email Notifications</p>
                <p className="text-sm text-gray-500">
                  Receive weekly insights and alerts via email
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                defaultChecked
                disabled={isDemoMode}
                aria-label="Toggle Email Notifications"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:ring-2 peer-focus:ring-white/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white"></div>
            </label>
          </div>
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-white">Timezone</p>
                <p className="text-sm text-gray-500">
                  Used for scheduling and report timestamps
                </p>
              </div>
            </div>
            <select
              className="px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/50"
              defaultValue="America/New_York"
              disabled={isDemoMode}
            >
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
            </select>
          </div>
        </div>
      </div>

      {!isDemoMode && (
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Team Members</h3>
              <p className="text-sm text-gray-400">
                Invite teammates and manage roles
              </p>
            </div>
          </div>

          <div className="mb-6 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="email"
                value={inviteEmail}
                onChange={(event) => setInviteEmail(event.target.value)}
                placeholder="email@organization.com"
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50"
              />
              <select
                value={inviteRole}
                onChange={(event) => setInviteRole(event.target.value)}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50"
              >
                {memberRoleOptions.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleInvite}
                disabled={!inviteEmail || isInviting}
                className="px-6 py-3 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold rounded-xl transition-all shadow-lg"
              >
                {isInviting ? 'Generating...' : 'Generate Invite'}
              </button>
            </div>

            {inviteToken && (
              <div className="rounded-xl border border-gray-700 bg-gray-900/50 p-4">
                <p className="text-sm text-gray-400">Invite token</p>
                <p className="text-white font-mono break-all mt-1">
                  {inviteToken}
                </p>
                {inviteExpiresAt && (
                  <p className="text-xs text-gray-500 mt-2">
                    Expires {new Date(inviteExpiresAt).toLocaleString()}
                  </p>
                )}
              </div>
            )}

            {inviteError && (
              <p className="text-sm text-red-400">{inviteError}</p>
            )}
          </div>

          {membersError && (
            <div className="mb-4 text-sm text-red-400">{membersError}</div>
          )}

          {membersLoading ? (
            <div className="text-gray-400 text-sm">Loading members...</div>
          ) : (
            <div className="space-y-3">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-gray-900/50 border border-gray-700 rounded-xl p-4"
                >
                  <div>
                    <p className="text-white font-medium">
                      {member.first_name} {member.last_name}
                    </p>
                    <p className="text-sm text-gray-400">{member.email}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <select
                      value={member.role}
                      onChange={(event) =>
                        handleRoleChange(member.id, event.target.value)
                      }
                      disabled={updatingMemberId === member.id}
                      className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50"
                    >
                      {memberRoleOptions.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(member.id)}
                      disabled={removingMemberId === member.id}
                      className="px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              {members.length === 0 && (
                <p className="text-sm text-gray-400">
                  No members found in your organization.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {!isDemoMode && (
        <div className="flex justify-end">
          <button
            type="button"
            className="px-6 py-3 bg-white hover:bg-gray-100 text-black font-semibold rounded-xl transition-all shadow-lg"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );

  const renderBillingSettings = () => (
    <div className="space-y-6">
      <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white">Current Plan</h3>
            <p className="text-gray-400 mt-1">
              {isDemoMode
                ? 'Demo Mode - No active subscription'
                : 'Manage your subscription'}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${isDemoMode ? 'bg-gray-500/20 text-gray-300' : 'bg-green-500/20 text-green-400'}`}
          >
            {isDemoMode ? 'Demo' : 'Active'}
          </span>
        </div>

        {isDemoMode ? (
          <div className="bg-gray-900/50 rounded-xl p-6 text-center">
            <p className="text-gray-400 mb-4">
              Create an account to access billing features and unlock full
              functionality.
            </p>
            <button
              type="button"
              onClick={() => setShowAuthModal(true)}
              className="px-6 py-3 bg-white hover:bg-gray-100 text-black font-semibold rounded-xl transition-all shadow-lg"
            >
              Upgrade to Full Account
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-700">
              <div>
                <p className="font-medium text-white">Professional Plan</p>
                <p className="text-sm text-gray-500">$199/month</p>
              </div>
              <button
                type="button"
                onClick={handleCheckout}
                disabled={billingLoading}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-all"
              >
                {billingLoading ? 'Processing...' : 'Change Plan'}
              </button>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-white">Payment Method</p>
                <p className="text-sm text-gray-500">**** **** **** 4242</p>
              </div>
              <button
                type="button"
                onClick={handleCheckout}
                disabled={billingLoading}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-all"
              >
                {billingLoading ? 'Processing...' : 'Update'}
              </button>
            </div>
            {billingError && (
              <p className="text-sm text-red-400">{billingError}</p>
            )}
          </div>
        )}
      </div>

      <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Usage This Month
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-gray-900/50 rounded-xl">
            <p className="text-2xl font-bold text-white">
              {isDemoMode ? '12,847' : '0'}
            </p>
            <p className="text-sm text-gray-500">Patients analyzed</p>
          </div>
          <div className="p-4 bg-gray-900/50 rounded-xl">
            <p className="text-2xl font-bold text-white">
              {isDemoMode ? '156' : '0'}
            </p>
            <p className="text-sm text-gray-500">Queries this month</p>
          </div>
          <div className="p-4 bg-gray-900/50 rounded-xl">
            <p className="text-2xl font-bold text-white">
              {isDemoMode ? '4' : '0'}
            </p>
            <p className="text-sm text-gray-500">Data uploads</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Authentication
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-700">
            <div>
              <p className="font-medium text-white">
                Two-Factor Authentication
              </p>
              <p className="text-sm text-gray-500">
                Add an extra layer of security to your account
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${isDemoMode ? 'bg-gray-700 text-gray-400' : 'bg-red-500/20 text-red-400'}`}
            >
              {isDemoMode ? 'Demo' : 'Not Enabled'}
            </span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-700">
            <div>
              <p className="font-medium text-white">Single Sign-On (SSO)</p>
              <p className="text-sm text-gray-500">
                Enable SSO with your identity provider
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-700 text-gray-400">
              Enterprise
            </span>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-white">Session Management</p>
              <p className="text-sm text-gray-500">
                View and manage active sessions
              </p>
            </div>
            <button
              type="button"
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isDemoMode}
              onClick={handleRevokeAllSessions}
            >
              Sign Out All Sessions
            </button>
          </div>
        </div>
        {securityMessage && (
          <p className="mt-3 text-sm text-gray-400">{securityMessage}</p>
        )}
      </div>

      <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Data Security</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3 py-3 border-b border-gray-700">
            <Shield className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium text-white">HIPAA Compliant</p>
              <p className="text-sm text-gray-500">
                All data is encrypted and stored in compliance with HIPAA
                regulations
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 py-3 border-b border-gray-700">
            <Shield className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium text-white">SOC 2 Type II Certified</p>
              <p className="text-sm text-gray-500">
                Audited security controls and practices
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 py-3">
            <Shield className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium text-white">256-bit Encryption</p>
              <p className="text-sm text-gray-500">
                Data encrypted at rest and in transit
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Section */}
      {!isDemoMode && (
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-6">
          <div className="max-w-md">
            <PasswordChangeForm />
          </div>
        </div>
      )}
    </div>
  );

  const renderIntegrationsSettings = () => (
    <div className="space-y-6">
      <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Available Integrations
        </h3>
        <div className="space-y-4">
          {[
            {
              name: 'Epic',
              description: 'Connect to Epic EHR system',
              status: 'available',
            },
            {
              name: 'Cerner',
              description: 'Connect to Cerner EHR system',
              status: 'available',
            },
            {
              name: 'Allscripts',
              description: 'Connect to Allscripts EHR',
              status: 'coming_soon',
            },
            {
              name: 'athenahealth',
              description: 'Connect to athenahealth',
              status: 'coming_soon',
            },
          ].map((integration) => (
            <div
              key={integration.name}
              className="flex items-center justify-between py-4 px-4 bg-gray-900/50 rounded-xl"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                  <Plug className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="font-medium text-white">{integration.name}</p>
                  <p className="text-sm text-gray-500">
                    {integration.description}
                  </p>
                </div>
              </div>
              {integration.status === 'available' ? (
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isDemoMode}
                >
                  Connect
                </button>
              ) : (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-700 text-gray-400">
                  Coming Soon
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">API Access</h3>
        <div className="bg-gray-900/50 rounded-xl p-6">
          <p className="text-gray-400 mb-4">
            API access is available on Enterprise plans. Contact our team to
            learn more.
          </p>
          <button
            type="button"
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isDemoMode}
          >
            Contact Sales
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'organization':
        return renderOrganizationSettings();
      case 'billing':
        return renderBillingSettings();
      case 'security':
        return renderSecuritySettings();
      case 'integrations':
        return renderIntegrationsSettings();
      default:
        return null;
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Header */}
            <div>
              <h1 className="text-2xl font-bold text-white">Settings</h1>
              <p className="text-gray-400 mt-1">
                Manage your account and organization settings
              </p>
            </div>

            {/* Settings Navigation */}
            <div className="grid md:grid-cols-4 gap-4">
              {settingsSections.map((section) => (
                <button
                  type="button"
                  key={section.id}
                  onClick={() => setActiveTab(section.id)}
                  className={`
                p-4 rounded-xl text-left transition-all
                ${
                  activeTab === section.id
                    ? 'bg-white/10 border-2 border-white'
                    : 'bg-gray-800/50 border border-gray-700 hover:border-gray-500'
                }
              `}
                >
                  <div
                    className={`
                w-10 h-10 rounded-lg flex items-center justify-center mb-3
                ${activeTab === section.id ? 'bg-white/20 text-white' : 'bg-gray-700/50 text-gray-400'}
              `}
                  >
                    {section.icon}
                  </div>
                  <p className="font-medium text-white">{section.label}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {section.description}
                  </p>
                </button>
              ))}
            </div>

            {/* Settings Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </motion.div>

          {/* Auth Modal for upgrading from demo */}
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            defaultMode="signup"
          />
        </div>
      </div>
    </div>
  );
};

export default Settings;
