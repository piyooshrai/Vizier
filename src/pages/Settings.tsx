import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, CreditCard, Shield, Plug } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import {
  OrganizationSettings,
  BillingSection,
  SecuritySettings,
  IntegrationSettings,
} from '../components/settings';

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

export const Settings: React.FC = () => {
  const { isDemoMode } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>('organization');

  const handleOrganizationSave = (data: unknown) => {
    console.log('Saving organization settings:', data);
    // In production, this would call an API
  };

  const handleUpgrade = () => {
    console.log('Upgrade plan clicked');
    // In production, this would open billing portal
  };

  const handleManagePayment = () => {
    console.log('Manage payment clicked');
    // In production, this would open payment management
  };

  const handleEnableTwoFactor = () => {
    console.log('Enable 2FA clicked');
    // In production, this would start 2FA setup flow
  };

  const handleDisableTwoFactor = () => {
    console.log('Disable 2FA clicked');
    // In production, this would disable 2FA
  };

  const handleRevokeSession = (sessionId: string) => {
    console.log('Revoke session:', sessionId);
    // In production, this would revoke the session
  };

  const handleRevokeAllSessions = () => {
    console.log('Revoke all sessions');
    // In production, this would revoke all sessions
  };

  const handleConnect = (integrationId: string) => {
    console.log('Connect integration:', integrationId);
    // In production, this would start OAuth flow
  };

  const handleDisconnect = (integrationId: string) => {
    console.log('Disconnect integration:', integrationId);
    // In production, this would disconnect the integration
  };

  const handleRegenerateApiKey = () => {
    console.log('Regenerate API key');
    // In production, this would generate a new API key
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'organization':
        return (
          <OrganizationSettings
            organization={{
              name: isDemoMode ? 'Demo Healthcare System' : '',
              type: isDemoMode ? 'health_system' : '',
              website: isDemoMode ? 'https://demo.vizier.health' : '',
              phone: isDemoMode ? '+1 (555) 123-4567' : '',
              address: isDemoMode ? '123 Healthcare Ave' : '',
              city: isDemoMode ? 'San Francisco' : '',
              state: isDemoMode ? 'CA' : '',
              zipCode: isDemoMode ? '94105' : '',
              country: 'US',
            }}
            onSave={handleOrganizationSave}
            disabled={isDemoMode}
          />
        );
      case 'billing':
        return (
          <BillingSection
            currentPlan={{
              name: isDemoMode ? 'Demo' : 'Professional',
              price: 299,
              interval: 'month',
              features: [
                'Unlimited data uploads',
                'Advanced AI insights',
                'Custom dashboards',
                'Priority support',
                'API access',
              ],
              isCurrentPlan: true,
            }}
            paymentMethod={
              isDemoMode
                ? undefined
                : {
                    type: 'card',
                    last4: '4242',
                    brand: 'Visa',
                    expiryMonth: 12,
                    expiryYear: 2025,
                  }
            }
            onUpgrade={handleUpgrade}
            onManagePayment={handleManagePayment}
            disabled={isDemoMode}
          />
        );
      case 'security':
        return (
          <SecuritySettings
            twoFactorEnabled={false}
            lastPasswordChange="2024-01-15"
            onEnableTwoFactor={handleEnableTwoFactor}
            onDisableTwoFactor={handleDisableTwoFactor}
            onRevokeSession={handleRevokeSession}
            onRevokeAllSessions={handleRevokeAllSessions}
            disabled={isDemoMode}
          />
        );
      case 'integrations':
        return (
          <IntegrationSettings
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
            onRegenerateApiKey={handleRegenerateApiKey}
            disabled={isDemoMode}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Settings</h1>
          <p className="text-neutral-600 mt-1">
            Manage your account and organization settings
          </p>
        </div>

        {/* Settings Navigation */}
        <div className="grid md:grid-cols-4 gap-4">
          {settingsSections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveTab(section.id)}
              className={`
                p-4 rounded-lg text-left transition-all
                ${
                  activeTab === section.id
                    ? 'bg-primary-50 border-2 border-primary-500'
                    : 'bg-white border border-neutral-200 hover:border-primary-300'
                }
              `}
            >
              <div
                className={`
                w-10 h-10 rounded-lg flex items-center justify-center mb-3
                ${activeTab === section.id ? 'bg-primary-100 text-primary-600' : 'bg-neutral-100 text-neutral-500'}
              `}
              >
                {section.icon}
              </div>
              <p
                className={`font-medium ${activeTab === section.id ? 'text-primary-700' : 'text-neutral-900'}`}
              >
                {section.label}
              </p>
              <p className="text-xs text-neutral-500 mt-1">{section.description}</p>
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
    </div>
  );
};

export default Settings;
