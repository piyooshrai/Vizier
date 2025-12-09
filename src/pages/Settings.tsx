import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  CreditCard,
  Shield,
  Plug,
  Bell,
  Globe,
} from 'lucide-react';
import { Card, Button, Badge } from '../components/common';
import { useAuth } from '../contexts/AuthContext';

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

  const renderOrganizationSettings = () => (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
          Organization Details
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Organization Name
            </label>
            <input
              type="text"
              defaultValue={isDemoMode ? 'Demo Healthcare System' : ''}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Your organization name"
              disabled={isDemoMode}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Organization Type
            </label>
            <select
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
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
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
          Preferences
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-neutral-100">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-neutral-400" />
              <div>
                <p className="font-medium text-neutral-900">Email Notifications</p>
                <p className="text-sm text-neutral-500">
                  Receive weekly insights and alerts via email
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked disabled={isDemoMode} />
              <div className="w-11 h-6 bg-neutral-200 peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-neutral-400" />
              <div>
                <p className="font-medium text-neutral-900">Timezone</p>
                <p className="text-sm text-neutral-500">
                  Used for scheduling and report timestamps
                </p>
              </div>
            </div>
            <select
              className="px-3 py-2 border border-neutral-300 rounded-lg text-sm"
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
      </Card>

      {!isDemoMode && (
        <div className="flex justify-end">
          <Button>Save Changes</Button>
        </div>
      )}
    </div>
  );

  const renderBillingSettings = () => (
    <div className="space-y-6">
      <Card>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">
              Current Plan
            </h3>
            <p className="text-neutral-500 mt-1">
              {isDemoMode ? 'Demo Mode - No active subscription' : 'Manage your subscription'}
            </p>
          </div>
          <Badge variant={isDemoMode ? 'warning' : 'success'}>
            {isDemoMode ? 'Demo' : 'Active'}
          </Badge>
        </div>

        {isDemoMode ? (
          <div className="bg-neutral-50 rounded-lg p-6 text-center">
            <p className="text-neutral-600 mb-4">
              Create an account to access billing features and unlock full functionality.
            </p>
            <Button variant="secondary">Upgrade to Full Account</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-neutral-100">
              <div>
                <p className="font-medium text-neutral-900">Professional Plan</p>
                <p className="text-sm text-neutral-500">$199/month</p>
              </div>
              <Button variant="secondary" size="sm">Change Plan</Button>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-neutral-900">Payment Method</p>
                <p className="text-sm text-neutral-500">**** **** **** 4242</p>
              </div>
              <Button variant="secondary" size="sm">Update</Button>
            </div>
          </div>
        )}
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
          Usage This Month
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-neutral-50 rounded-lg">
            <p className="text-2xl font-bold text-neutral-900">
              {isDemoMode ? '12,847' : '0'}
            </p>
            <p className="text-sm text-neutral-500">Patients analyzed</p>
          </div>
          <div className="p-4 bg-neutral-50 rounded-lg">
            <p className="text-2xl font-bold text-neutral-900">
              {isDemoMode ? '156' : '0'}
            </p>
            <p className="text-sm text-neutral-500">Queries this month</p>
          </div>
          <div className="p-4 bg-neutral-50 rounded-lg">
            <p className="text-2xl font-bold text-neutral-900">
              {isDemoMode ? '4' : '0'}
            </p>
            <p className="text-sm text-neutral-500">Data uploads</p>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
          Authentication
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-neutral-100">
            <div>
              <p className="font-medium text-neutral-900">Two-Factor Authentication</p>
              <p className="text-sm text-neutral-500">
                Add an extra layer of security to your account
              </p>
            </div>
            <Badge variant={isDemoMode ? 'default' : 'error'}>
              {isDemoMode ? 'Demo' : 'Not Enabled'}
            </Badge>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-neutral-100">
            <div>
              <p className="font-medium text-neutral-900">Single Sign-On (SSO)</p>
              <p className="text-sm text-neutral-500">
                Enable SSO with your identity provider
              </p>
            </div>
            <Badge variant="default">Enterprise</Badge>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-neutral-900">Session Management</p>
              <p className="text-sm text-neutral-500">
                View and manage active sessions
              </p>
            </div>
            <Button variant="secondary" size="sm" disabled={isDemoMode}>
              View Sessions
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
          Data Security
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3 py-3 border-b border-neutral-100">
            <Shield className="w-5 h-5 text-success-500 mt-0.5" />
            <div>
              <p className="font-medium text-neutral-900">HIPAA Compliant</p>
              <p className="text-sm text-neutral-500">
                All data is encrypted and stored in compliance with HIPAA regulations
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 py-3 border-b border-neutral-100">
            <Shield className="w-5 h-5 text-success-500 mt-0.5" />
            <div>
              <p className="font-medium text-neutral-900">SOC 2 Type II Certified</p>
              <p className="text-sm text-neutral-500">
                Audited security controls and practices
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 py-3">
            <Shield className="w-5 h-5 text-success-500 mt-0.5" />
            <div>
              <p className="font-medium text-neutral-900">256-bit Encryption</p>
              <p className="text-sm text-neutral-500">
                Data encrypted at rest and in transit
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderIntegrationsSettings = () => (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
          Available Integrations
        </h3>
        <div className="space-y-4">
          {[
            { name: 'Epic', description: 'Connect to Epic EHR system', status: 'available' },
            { name: 'Cerner', description: 'Connect to Cerner EHR system', status: 'available' },
            { name: 'Allscripts', description: 'Connect to Allscripts EHR', status: 'coming_soon' },
            { name: 'athenahealth', description: 'Connect to athenahealth', status: 'coming_soon' },
          ].map((integration) => (
            <div
              key={integration.name}
              className="flex items-center justify-between py-4 px-4 bg-neutral-50 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <Plug className="w-5 h-5 text-neutral-400" />
                </div>
                <div>
                  <p className="font-medium text-neutral-900">{integration.name}</p>
                  <p className="text-sm text-neutral-500">{integration.description}</p>
                </div>
              </div>
              {integration.status === 'available' ? (
                <Button variant="secondary" size="sm" disabled={isDemoMode}>
                  Connect
                </Button>
              ) : (
                <Badge variant="default">Coming Soon</Badge>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
          API Access
        </h3>
        <div className="bg-neutral-50 rounded-lg p-6">
          <p className="text-neutral-600 mb-4">
            API access is available on Enterprise plans. Contact our team to learn more.
          </p>
          <Button variant="secondary" disabled={isDemoMode}>
            Contact Sales
          </Button>
        </div>
      </Card>
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
              <div className={`
                w-10 h-10 rounded-lg flex items-center justify-center mb-3
                ${activeTab === section.id ? 'bg-primary-100 text-primary-600' : 'bg-neutral-100 text-neutral-500'}
              `}>
                {section.icon}
              </div>
              <p className={`font-medium ${activeTab === section.id ? 'text-primary-700' : 'text-neutral-900'}`}>
                {section.label}
              </p>
              <p className="text-xs text-neutral-500 mt-1">
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
    </div>
  );
};

export default Settings;
