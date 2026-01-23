import { motion } from 'framer-motion';
import {
  Bell,
  Building2,
  CreditCard,
  Download,
  FileText,
  Globe,
  Plug,
  RefreshCw,
  Shield,
} from 'lucide-react';
import type React from 'react';
import { Fragment, useEffect, useState } from 'react';
import { AuthModal } from '../components/auth/AuthModal';
import { PasswordChangeForm } from '../components/auth/PasswordChangeForm';
import { useAuth } from '../contexts/AuthContext';
import type { AuditLog } from '../services';
import {
  auditService,
  authService,
  getErrorMessage,
  organizationsService,
  paymentService,
} from '../services';
import type { User } from '../types';

type SettingsTab =
  | 'organization'
  | 'billing'
  | 'security'
  | 'integrations'
  | 'audit';

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
  {
    id: 'audit',
    label: 'Audit Logs',
    icon: <FileText className="w-5 h-5" />,
    description: 'Review system activity for compliance',
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
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);
  const [billingError, setBillingError] = useState('');
  const [billingLoading, setBillingLoading] = useState(false);
  const [securityMessage, setSecurityMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditError, setAuditError] = useState('');
  const [auditLimit, setAuditLimit] = useState(50);
  const [expandedAuditId, setExpandedAuditId] = useState<string | null>(null);
  const [auditSearch, setAuditSearch] = useState('');

  // Form State
  const [orgName, setOrgName] = useState('');
  const [orgType, setOrgType] = useState('hospital_system');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [timezone, setTimezone] = useState('America/New_York');
  const [pendingRoleUpdates, setPendingRoleUpdates] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    if (isDemoMode) {
      setOrgName('Demo Healthcare System');
      return;
    }
    // Initialize form with defaults (in a real app, load from user/org profile)
    setOrgName('');
  }, [isDemoMode]);

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

  useEffect(() => {
    if (activeTab !== 'audit' || isDemoMode) return;
    let isMounted = true;

    const loadAuditLogs = async () => {
      setAuditLoading(true);
      setAuditError('');
      try {
        const response = await auditService.getLogs(auditLimit);
        if (isMounted) {
          setAuditLogs(response);
        }
      } catch (error) {
        if (isMounted) {
          setAuditError(getErrorMessage(error));
        }
      } finally {
        if (isMounted) {
          setAuditLoading(false);
        }
      }
    };

    loadAuditLogs();

    return () => {
      isMounted = false;
    };
  }, [activeTab, auditLimit, isDemoMode]);

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

  const handleRoleChange = (userId: string, role: string) => {
    // Stage the change locally
    setPendingRoleUpdates((prev) => ({
      ...prev,
      [userId]: role,
    }));

    // Optimostically update the UI list
    setMembers((prev) =>
      prev.map((member) =>
        member.id === userId ? { ...member, role } : member,
      ),
    );
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    setMembersError('');

    try {
      // 1. Process Role Updates
      const updatePromises = Object.entries(pendingRoleUpdates).map(
        ([userId, role]) => organizationsService.updateMemberRole(userId, role),
      );

      if (updatePromises.length > 0) {
        await Promise.all(updatePromises);
        setPendingRoleUpdates({});
      }

      // 2. Note about other fields
      // The current API only supports role updates. Org Name/Timezone are local state only for now.
      if (
        (orgName && orgName !== 'Demo Healthcare System') ||
        timezone !== 'America/New_York'
      ) {
        console.warn(
          'Organization details and preferences are not yet supported by the backend API.',
        );
      }

      setSaveMessage({
        type: 'success',
        text: 'Changes saved successfully',
      });

      // Clear success message after 3 seconds
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      setSaveMessage({
        type: 'error',
        text: 'Failed to save changes. Please try again.',
      });
      setMembersError(getErrorMessage(error));
    } finally {
      setIsSaving(false);
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
      // Remove from pending updates if present
      if (pendingRoleUpdates[userId]) {
        const { [userId]: _, ...rest } = pendingRoleUpdates;
        setPendingRoleUpdates(rest);
      }
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

  const handleRefreshAuditLogs = async () => {
    if (auditLoading) return;
    setAuditError('');
    setAuditLoading(true);
    try {
      const response = await auditService.getLogs(auditLimit);
      setAuditLogs(response);
    } catch (error) {
      setAuditError(getErrorMessage(error));
    } finally {
      setAuditLoading(false);
    }
  };

  const handleDownloadAuditLogs = async () => {
    setAuditError('');
    try {
      const blob = await auditService.downloadCsv();
      const url = globalThis.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vizier-audit-logs-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`;
      a.click();
      globalThis.URL.revokeObjectURL(url);
    } catch (error) {
      setAuditError(getErrorMessage(error));
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
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
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
              value={orgType}
              onChange={(e) => setOrgType(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50"
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
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                disabled={isDemoMode}
                aria-label="Toggle Email Notifications"
              />
              <div className="w-12 h-6 bg-gray-700 rounded-full border border-gray-600 transition-all peer-focus:ring-2 peer-focus:ring-amber-400/40 peer-checked:bg-gradient-to-r peer-checked:from-amber-400 peer-checked:via-amber-300 peer-checked:to-yellow-300 peer-checked:border-amber-300/70 shadow-inner">
                <span className="absolute top-[2px] left-[2px] h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-200 ease-in-out peer-checked:translate-x-6 peer-checked:shadow-md" />
                <span className="absolute inset-0 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity">
                  <span className="absolute inset-0 rounded-full bg-amber-400/20 blur-sm" />
                </span>
              </div>
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
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/50"
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
                      className={`px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 ${
                        pendingRoleUpdates[member.id]
                          ? 'border-amber-500/50 bg-amber-500/10'
                          : ''
                      }`}
                    >
                      {memberRoleOptions.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                    {pendingRoleUpdates[member.id] && (
                      <span className="text-xs text-amber-400 font-medium px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                        Modified
                      </span>
                    )}
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
        <div className="flex items-center justify-end gap-3 sticky bottom-0 py-4 bg-gradient-to-t from-gray-900 via-gray-900 to-transparent">
          {saveMessage && (
            <div
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                saveMessage.type === 'success'
                  ? 'bg-green-500/10 text-green-400'
                  : 'bg-red-500/10 text-red-400'
              }`}
            >
              {saveMessage.text}
            </div>
          )}
          <button
            type="button"
            onClick={handleSaveChanges}
            disabled={
              isSaving ||
              (Object.keys(pendingRoleUpdates).length === 0 &&
                !orgName &&
                !emailNotifications)
            }
            className="px-6 py-3 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold rounded-xl transition-all shadow-lg"
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-600 border-t-gray-900 rounded-full animate-spin" />
                Saving...
              </span>
            ) : (
              'Save Changes'
            )}
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

  const renderAuditSettings = () => {
    const demoAuditLogs: AuditLog[] = [
      {
        id: 'demo-1',
        user_id: 'demo-user',
        user_email: 'demo@vizier.health',
        action: 'LOGIN_SUCCESS',
        endpoint: '/auth/login',
        status_code: 200,
        execution_time_ms: 123,
        user_agent: 'Chrome 120 / Windows',
        ip_address: '10.12.45.88',
        details: { method: 'password' },
        created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      },
      {
        id: 'demo-2',
        user_id: 'demo-user',
        user_email: 'demo@vizier.health',
        action: 'QUERY_EXECUTED',
        endpoint: '/vanna/ask',
        status_code: 200,
        execution_time_ms: 842,
        user_agent: 'Chrome 120 / Windows',
        ip_address: '10.12.45.88',
        details: { question: 'Show me patient age distribution' },
        created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      },
      {
        id: 'demo-3',
        user_id: 'demo-user',
        user_email: 'demo@vizier.health',
        action: 'CHART_PINNED',
        endpoint: '/charts/',
        status_code: 201,
        execution_time_ms: 215,
        user_agent: 'Chrome 120 / Windows',
        ip_address: '10.12.45.88',
        details: { chart_type: 'bar_chart' },
        created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
      },
    ];

    const logs = isDemoMode ? demoAuditLogs : auditLogs;
    const searchTerm = auditSearch.trim().toLowerCase();
    const filteredLogs = searchTerm
      ? logs.filter((log) => {
          const detailsText = log.details
            ? JSON.stringify(log.details).toLowerCase()
            : '';
          return (
            log.action.toLowerCase().includes(searchTerm) ||
            log.endpoint.toLowerCase().includes(searchTerm) ||
            (log.user_email || '').toLowerCase().includes(searchTerm) ||
            (log.user_agent || '').toLowerCase().includes(searchTerm) ||
            (log.ip_address || '').toLowerCase().includes(searchTerm) ||
            detailsText.includes(searchTerm)
          );
        })
      : logs;

    return (
      <div className="space-y-6">
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Audit Logs</h3>
              <p className="text-sm text-gray-400">
                Track access, security events, and key actions across the
                platform.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <label htmlFor="audit-search" className="text-xs text-gray-400">
                  Search
                </label>
                <input
                  id="audit-search"
                  type="text"
                  value={auditSearch}
                  onChange={(event) => setAuditSearch(event.target.value)}
                  placeholder="Action, user, endpoint…"
                  className="w-44 md:w-56 px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="audit-limit" className="text-xs text-gray-400">
                  Show
                </label>
                <select
                  id="audit-limit"
                  value={auditLimit}
                  onChange={(event) =>
                    setAuditLimit(Number(event.target.value))
                  }
                  className="px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                  disabled={isDemoMode}
                >
                  {[25, 50, 100, 200].map((limit) => (
                    <option key={limit} value={limit}>
                      {limit}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={handleRefreshAuditLogs}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-all inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={auditLoading || isDemoMode}
              >
                <RefreshCw
                  className={`w-4 h-4 ${auditLoading ? 'animate-spin' : ''}`}
                />
                Refresh
              </button>
              <button
                type="button"
                onClick={handleDownloadAuditLogs}
                className="px-4 py-2 bg-white hover:bg-gray-100 text-black text-sm font-semibold rounded-lg transition-all inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isDemoMode}
              >
                <Download className="w-4 h-4" />
                Download CSV
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-6">
          {auditError && (
            <div className="mb-4 text-sm text-red-400">{auditError}</div>
          )}

          {auditLoading && !isDemoMode ? (
            <div className="text-gray-400 text-sm">Loading audit logs...</div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-gray-400 text-sm">
              No audit logs match your search.
            </div>
          ) : (
            <div className="overflow-x-auto max-h-[60vh] lg:max-h-[70vh] overflow-y-auto pr-1">
              <table className="min-w-[860px] w-full text-sm text-left border-separate border-spacing-y-2">
                <thead className="text-xs uppercase tracking-wide text-gray-400">
                  <tr>
                    <th className="px-4 py-2">Action</th>
                    <th className="px-4 py-2 hidden md:table-cell">Endpoint</th>
                    <th className="px-4 py-2 hidden lg:table-cell">Status</th>
                    <th className="px-4 py-2 hidden lg:table-cell">Duration</th>
                    <th className="px-4 py-2 hidden xl:table-cell">User</th>
                    <th className="px-4 py-2 hidden xl:table-cell">IP</th>
                    <th className="px-4 py-2 text-right">Time</th>
                    <th className="px-4 py-2 text-right">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <Fragment key={log.id}>
                      <tr className="bg-gray-900/40 border border-gray-700 rounded-xl">
                        <td className="px-4 py-3 font-medium text-white">
                          {log.action.replaceAll('_', ' ')}
                        </td>
                        <td className="px-4 py-3 text-gray-400 hidden md:table-cell">
                          {log.endpoint}
                        </td>
                        <td className="px-4 py-3 text-gray-400 hidden lg:table-cell">
                          {log.status_code ?? '—'}
                        </td>
                        <td className="px-4 py-3 text-gray-400 hidden lg:table-cell">
                          {log.execution_time_ms
                            ? `${log.execution_time_ms} ms`
                            : '—'}
                        </td>
                        <td className="px-4 py-3 text-gray-400 hidden xl:table-cell">
                          {log.user_email || 'Unknown user'}
                        </td>
                        <td className="px-4 py-3 text-gray-400 hidden xl:table-cell">
                          {log.ip_address || 'Unknown IP'}
                        </td>
                        <td className="px-4 py-3 text-gray-300 text-right whitespace-nowrap">
                          {new Date(log.created_at).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {(log.details || log.user_agent) && (
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedAuditId(
                                  expandedAuditId === log.id ? null : log.id,
                                )
                              }
                              className="text-xs text-amber-300 hover:text-amber-200 transition-colors"
                            >
                              {expandedAuditId === log.id ? 'Hide' : 'View'}
                            </button>
                          )}
                        </td>
                      </tr>
                      {expandedAuditId === log.id && (
                        <tr>
                          <td
                            colSpan={8}
                            className="px-4 pb-4 pt-0 text-xs text-gray-300"
                          >
                            <div className="rounded-xl border border-gray-700 bg-gray-900/60 p-4 space-y-3">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-gray-400">
                                <div>
                                  <p className="text-[11px] uppercase tracking-wide text-gray-500">
                                    Endpoint
                                  </p>
                                  <p className="text-gray-300">
                                    {log.endpoint}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-[11px] uppercase tracking-wide text-gray-500">
                                    Status
                                  </p>
                                  <p className="text-gray-300">
                                    {log.status_code ?? '—'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-[11px] uppercase tracking-wide text-gray-500">
                                    Duration
                                  </p>
                                  <p className="text-gray-300">
                                    {log.execution_time_ms
                                      ? `${log.execution_time_ms} ms`
                                      : '—'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-[11px] uppercase tracking-wide text-gray-500">
                                    User
                                  </p>
                                  <p className="text-gray-300">
                                    {log.user_email || 'Unknown user'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-[11px] uppercase tracking-wide text-gray-500">
                                    IP Address
                                  </p>
                                  <p className="text-gray-300">
                                    {log.ip_address || 'Unknown IP'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-[11px] uppercase tracking-wide text-gray-500">
                                    User Agent
                                  </p>
                                  <p className="text-gray-300">
                                    {log.user_agent || '—'}
                                  </p>
                                </div>
                              </div>
                              {log.details && (
                                <pre className="text-xs text-gray-300 bg-gray-900/70 border border-gray-700 rounded-lg p-3 overflow-x-auto">
                                  {JSON.stringify(log.details, null, 2)}
                                </pre>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

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
      case 'audit':
        return renderAuditSettings();
      default:
        return null;
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
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
