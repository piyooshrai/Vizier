import { Bell, Plus, Trash2, X } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { alertsService, getErrorMessage } from '../../services';
import type { AlertCondition, AlertMetric, AlertPublic } from '../../types';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const metricOptions = [
  { value: 'Readmission Rate (%)', label: 'Readmission Rate', unit: '%' },
  {
    value: 'Average Length of Stay (Days)',
    label: 'Average Length of Stay',
    unit: 'days',
  },
  {
    value: 'High Risk Patient Rate (%)',
    label: 'High Risk Patient Rate',
    unit: '%',
  },
  { value: 'Care Gap Rate (%)', label: 'Care Gap Rate', unit: '%' },
];

const conditionOptions = [
  { value: 'Greater than', label: 'Greater than' },
  { value: 'Less than', label: 'Less than' },
  { value: 'Equal to', label: 'Equal to' },
];

const normalizeStoredAlert = (
  stored: Record<string, unknown>,
): AlertPublic | null => {
  const metric =
    typeof stored.metric === 'string' ? stored.metric : metricOptions[0].value;

  const condition =
    typeof stored.condition === 'string'
      ? stored.condition
      : conditionOptions[0].value;

  let rawThreshold = Number.NaN;
  if (typeof stored.threshold_value === 'number') {
    rawThreshold = stored.threshold_value;
  } else if (typeof stored.value === 'number') {
    rawThreshold = stored.value;
  } else if (typeof stored.value === 'string') {
    rawThreshold = Number(stored.value);
  }

  if (Number.isNaN(rawThreshold)) return null;

  const id =
    typeof stored.id === 'string'
      ? stored.id
      : `demo-${Date.now()}-${Math.random()}`;

  const userId =
    typeof stored.user_id === 'string' ? stored.user_id : 'demo-user';

  const emailNotification =
    typeof stored.email_notification === 'boolean'
      ? stored.email_notification
      : Boolean(stored.email);

  const smsNotification =
    typeof stored.sms_notification === 'boolean'
      ? stored.sms_notification
      : Boolean(stored.sms);

  let createdAt = new Date().toISOString();
  if (typeof stored.created_at === 'string') {
    createdAt = stored.created_at;
  } else if (typeof stored.createdAt === 'string') {
    createdAt = stored.createdAt;
  }

  return {
    id,
    user_id: userId,
    metric: metric as AlertMetric,
    condition: condition as AlertCondition,
    threshold_value: rawThreshold,
    email_notification: emailNotification,
    sms_notification: smsNotification,
    is_triggered: Boolean(stored.is_triggered),
    created_at: createdAt,
    last_triggered_at:
      typeof stored.last_triggered_at === 'string'
        ? stored.last_triggered_at
        : null,
  };
};

export const AlertModal: React.FC<AlertModalProps> = ({ isOpen, onClose }) => {
  const [alerts, setAlerts] = useState<AlertPublic[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newAlert, setNewAlert] = useState({
    metric: metricOptions[0].value as AlertMetric,
    condition: conditionOptions[0].value as AlertCondition,
    threshold_value: '',
    email_notification: true,
    sms_notification: false,
  });
  const isDemoMode = localStorage.getItem('is_demo') === 'true';

  // Load saved alerts
  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;

    // normalizeStoredAlert extracted outside

    const loadAlerts = async () => {
      setError('');
      setIsLoading(true);
      try {
        if (isDemoMode) {
          const saved = localStorage.getItem('vizier_alerts');
          const parsed = saved
            ? (JSON.parse(saved) as Record<string, unknown>[])
            : [];
          const normalized = parsed
            .map((item) => normalizeStoredAlert(item))
            .filter((item): item is AlertPublic => item !== null);
          if (isMounted) {
            setAlerts(normalized);
          }
          return;
        }

        const response = await alertsService.getAlerts();
        if (isMounted) {
          setAlerts(response);
        }
      } catch (err) {
        if (isMounted) {
          setError(getErrorMessage(err));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadAlerts();

    return () => {
      isMounted = false;
    };
  }, [isOpen, isDemoMode]);

  if (!isOpen) return null;

  const handleAddAlert = async () => {
    if (!newAlert.threshold_value) return;
    const thresholdValue = Number(newAlert.threshold_value);
    if (Number.isNaN(thresholdValue)) return;

    setError('');
    setIsSaving(true);
    try {
      if (isDemoMode) {
        const alert: AlertPublic = {
          id: `demo-${Date.now()}`,
          user_id: 'demo-user',
          metric: newAlert.metric,
          condition: newAlert.condition,
          threshold_value: thresholdValue,
          email_notification: newAlert.email_notification,
          sms_notification: newAlert.sms_notification,
          is_triggered: false,
          created_at: new Date().toISOString(),
          last_triggered_at: null,
        };

        const updated = [...alerts, alert];
        setAlerts(updated);
        localStorage.setItem('vizier_alerts', JSON.stringify(updated));
      } else {
        const created = await alertsService.createAlert({
          metric: newAlert.metric,
          condition: newAlert.condition,
          threshold_value: thresholdValue,
          email_notification: newAlert.email_notification,
          sms_notification: newAlert.sms_notification,
        });
        setAlerts((prev) => [...prev, created]);
      }

      setNewAlert({
        metric: metricOptions[0].value as AlertMetric,
        condition: conditionOptions[0].value as AlertCondition,
        threshold_value: '',
        email_notification: true,
        sms_notification: false,
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAlert = async (id: string) => {
    setError('');
    try {
      if (isDemoMode) {
        const updated = alerts.filter((a) => a.id !== id);
        setAlerts(updated);
        localStorage.setItem('vizier_alerts', JSON.stringify(updated));
        return;
      }

      await alertsService.deleteAlert(id);
      setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const getMetricLabel = (value: string) => {
    return metricOptions.find((m) => m.value === value)?.label || value;
  };

  const getConditionLabel = (value: string) => {
    return conditionOptions.find((c) => c.value === value)?.label || value;
  };

  const getMetricUnit = (value: string) => {
    return metricOptions.find((m) => m.value === value)?.unit || '';
  };

  const renderAlertsContent = () => {
    if (isLoading) {
      return (
        <div className="text-center py-6 text-gray-400 text-sm">
          Loading alerts...
        </div>
      );
    }

    if (alerts.length === 0) {
      return (
        <div className="text-center py-8">
          <Bell className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No alerts configured yet</p>
          <p className="text-sm text-gray-500 mt-1">
            Create your first alert above
          </p>
        </div>
      );
    }

    return (
      <div>
        <h3 className="text-white font-semibold mb-3">
          Active Alerts ({alerts.length})
        </h3>
        <div className="space-y-2">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-center justify-between bg-gray-800 rounded-lg p-4"
            >
              <div className="flex-1">
                <p className="text-white text-sm font-medium">
                  {getMetricLabel(alert.metric)}{' '}
                  <span className="text-gray-400">
                    {getConditionLabel(alert.condition).toLowerCase()}
                  </span>{' '}
                  <span className="text-white">
                    {alert.threshold_value}
                    {getMetricUnit(alert.metric)}
                  </span>
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Notify via: {alert.email_notification && 'Email'}
                  {alert.email_notification && alert.sms_notification && ', '}
                  {alert.sms_notification && 'SMS'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteAlert(alert.id)}
                className="p-2 hover:bg-red-500/10 rounded-lg transition-colors ml-4"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-3xl max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Alert Me When</h2>
              <p className="text-sm text-gray-400">
                Set up conditional notifications
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* New Alert Form */}
          <div className="bg-gray-800 rounded-xl p-4 mb-6">
            <h3 className="text-white font-semibold mb-4">Create New Alert</h3>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label
                  htmlFor="metric"
                  className="block text-xs text-gray-400 mb-1"
                >
                  Metric
                </label>
                <select
                  id="metric"
                  value={newAlert.metric}
                  onChange={(e) =>
                    setNewAlert({
                      ...newAlert,
                      metric: e.target.value as AlertMetric,
                    })
                  }
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-white"
                >
                  {metricOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="condition"
                  className="block text-xs text-gray-400 mb-1"
                >
                  Condition
                </label>
                <select
                  id="condition"
                  value={newAlert.condition}
                  onChange={(e) =>
                    setNewAlert({
                      ...newAlert,
                      condition: e.target.value as AlertCondition,
                    })
                  }
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-white"
                >
                  {conditionOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="value"
                  className="block text-xs text-gray-400 mb-1"
                >
                  Value{' '}
                  {getMetricUnit(newAlert.metric) &&
                    `(${getMetricUnit(newAlert.metric)})`}
                </label>
                <input
                  id="value"
                  type="number"
                  value={newAlert.threshold_value}
                  onChange={(e) =>
                    setNewAlert({
                      ...newAlert,
                      threshold_value: e.target.value,
                    })
                  }
                  placeholder="Enter value"
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-6 mb-4">
              <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newAlert.email_notification}
                  onChange={(e) =>
                    setNewAlert({
                      ...newAlert,
                      email_notification: e.target.checked,
                    })
                  }
                  className="rounded border-gray-600 bg-gray-700"
                />{' '}
                Email notification
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newAlert.sms_notification}
                  onChange={(e) =>
                    setNewAlert({
                      ...newAlert,
                      sms_notification: e.target.checked,
                    })
                  }
                  className="rounded border-gray-600 bg-gray-700"
                />{' '}
                SMS notification
              </label>
            </div>

            <button
              type="button"
              onClick={handleAddAlert}
              disabled={
                !newAlert.threshold_value ||
                (!newAlert.email_notification && !newAlert.sms_notification) ||
                isSaving
              }
              className="w-full px-4 py-2.5 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Add Alert'}
            </button>

            {error && <p className="mt-3 text-xs text-red-400">{error}</p>}
          </div>

          {/* Existing Alerts */}
          {/* Existing Alerts */}
          {renderAlertsContent()}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
