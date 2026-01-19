import { motion } from 'framer-motion';
import {
  Activity,
  Check,
  Cloud,
  Copy,
  Database,
  Eye,
  EyeOff,
  FileSpreadsheet,
  Key,
  Plug,
  RefreshCw,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { Badge, Button, Card, Modal } from '../common';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'connected' | 'disconnected' | 'pending';
  connectedAt?: string;
}

interface IntegrationSettingsProps {
  integrations?: Integration[];
  apiKey?: string;
  onConnect?: (integrationId: string) => void;
  onDisconnect?: (integrationId: string) => void;
  onRegenerateApiKey?: () => void;
  disabled?: boolean;
}

const defaultIntegrations: Integration[] = [
  {
    id: 'epic',
    name: 'Epic EHR',
    description: 'Connect to Epic electronic health records system',
    icon: <Database className="w-5 h-5" />,
    status: 'connected',
    connectedAt: '2024-01-10',
  },
  {
    id: 'cerner',
    name: 'Cerner',
    description: 'Integrate with Cerner healthcare platform',
    icon: <Activity className="w-5 h-5" />,
    status: 'disconnected',
  },
  {
    id: 'aws',
    name: 'AWS HealthLake',
    description: 'Connect to AWS HealthLake for FHIR data',
    icon: <Cloud className="w-5 h-5" />,
    status: 'pending',
  },
  {
    id: 'excel',
    name: 'Microsoft Excel',
    description: 'Import data from Excel spreadsheets',
    icon: <FileSpreadsheet className="w-5 h-5" />,
    status: 'connected',
    connectedAt: '2024-02-01',
  },
];

export const IntegrationSettings: React.FC<IntegrationSettingsProps> = ({
  integrations = defaultIntegrations,
  apiKey = 'vz_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  onConnect,
  onDisconnect,
  onRegenerateApiKey,
  disabled = false,
}) => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);

  const copyApiKey = async () => {
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy API key:', error);
    }
  };

  const handleRegenerate = () => {
    onRegenerateApiKey?.();
    setShowRegenerateModal(false);
  };

  const getStatusBadge = (status: Integration['status']) => {
    switch (status) {
      case 'connected':
        return <Badge variant="success">Connected</Badge>;
      case 'disconnected':
        return <Badge variant="default">Disconnected</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* API Key Section */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Key className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">
              API Access
            </h3>
            <p className="text-sm text-neutral-500">
              Use your API key to integrate Vizier with your applications
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                readOnly
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg font-mono text-sm text-neutral-900 pr-24"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="p-2 hover:bg-neutral-200 rounded-lg transition-colors"
                  title={showApiKey ? 'Hide API key' : 'Show API key'}
                >
                  {showApiKey ? (
                    <EyeOff className="w-4 h-4 text-neutral-600" />
                  ) : (
                    <Eye className="w-4 h-4 text-neutral-600" />
                  )}
                </button>
                <button
                  onClick={copyApiKey}
                  className="p-2 hover:bg-neutral-200 rounded-lg transition-colors"
                  title="Copy API key"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-success-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-neutral-600" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-warning-50 rounded-lg">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-warning-600" />
              <div>
                <p className="text-sm font-medium text-warning-900">
                  Need a new API key?
                </p>
                <p className="text-sm text-warning-700">
                  Regenerating will invalidate your current key
                </p>
              </div>
            </div>
            {!disabled && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowRegenerateModal(true)}
              >
                Regenerate Key
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Integrations */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Plug className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">
              Integrations
            </h3>
            <p className="text-sm text-neutral-500">
              Connect Vizier with your existing healthcare systems
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {integrations.map((integration) => (
            <div
              key={integration.id}
              className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-lg ${
                    integration.status === 'connected'
                      ? 'bg-success-100 text-success-600'
                      : integration.status === 'pending'
                        ? 'bg-warning-100 text-warning-600'
                        : 'bg-neutral-200 text-neutral-600'
                  }`}
                >
                  {integration.icon}
                </div>
                <div>
                  <p className="font-medium text-neutral-900">
                    {integration.name}
                  </p>
                  <p className="text-sm text-neutral-500">
                    {integration.description}
                  </p>
                  {integration.connectedAt && (
                    <p className="text-xs text-neutral-400 mt-1">
                      Connected since{' '}
                      {new Date(integration.connectedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(integration.status)}
                {!disabled && (
                  <Button
                    variant={
                      integration.status === 'connected'
                        ? 'secondary'
                        : 'primary'
                    }
                    size="sm"
                    onClick={() =>
                      integration.status === 'connected'
                        ? onDisconnect?.(integration.id)
                        : onConnect?.(integration.id)
                    }
                  >
                    {integration.status === 'connected'
                      ? 'Disconnect'
                      : 'Connect'}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {integrations.length === 0 && (
          <div className="text-center py-8 text-neutral-500">
            No integrations available
          </div>
        )}
      </Card>

      {/* Regenerate API Key Modal */}
      <Modal
        isOpen={showRegenerateModal}
        onClose={() => setShowRegenerateModal(false)}
        title="Regenerate API Key"
      >
        <div className="space-y-4">
          <p className="text-neutral-600">
            Are you sure you want to regenerate your API key? This action will:
          </p>
          <ul className="list-disc list-inside space-y-1 text-neutral-600">
            <li>Invalidate your current API key immediately</li>
            <li>Generate a new API key</li>
            <li>Break any existing integrations using the old key</li>
          </ul>
          <p className="text-sm text-warning-600 font-medium">
            You will need to update your API key in all applications that use
            it.
          </p>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setShowRegenerateModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleRegenerate}
              className="bg-warning-600 hover:bg-warning-700"
            >
              Regenerate Key
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default IntegrationSettings;
