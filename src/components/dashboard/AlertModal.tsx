import { Bell, Plus, Trash2, X } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';

interface Alert {
  id: string;
  metric: string;
  condition: string;
  value: string;
  email: boolean;
  sms: boolean;
  createdAt: Date;
}

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const metricOptions = [
  { value: 'readmission_rate', label: 'Readmission Rate', unit: '%' },
  { value: 'patient_satisfaction', label: 'Patient Satisfaction', unit: '%' },
  { value: 'avg_length_of_stay', label: 'Avg Length of Stay', unit: 'days' },
  { value: 'encounter_cost', label: 'Encounter Cost', unit: '$' },
  { value: 'total_patients', label: 'Total Patients', unit: '' },
  { value: 'no_show_rate', label: 'No-Show Rate', unit: '%' },
  { value: 'bed_occupancy', label: 'Bed Occupancy', unit: '%' },
];

const conditionOptions = [
  { value: 'greater_than', label: 'Greater than' },
  { value: 'less_than', label: 'Less than' },
  { value: 'equals', label: 'Equals' },
  { value: 'changes_by', label: 'Changes by' },
];

export const AlertModal: React.FC<AlertModalProps> = ({ isOpen, onClose }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [newAlert, setNewAlert] = useState({
    metric: 'readmission_rate',
    condition: 'greater_than',
    value: '',
    email: true,
    sms: false,
  });

  // Load saved alerts
  useEffect(() => {
    const saved = localStorage.getItem('vizier_alerts');
    if (saved) {
      setAlerts(JSON.parse(saved));
    }
  }, []);

  if (!isOpen) return null;

  const handleAddAlert = () => {
    if (!newAlert.value) return;

    const alert: Alert = {
      id: Date.now().toString(),
      ...newAlert,
      createdAt: new Date(),
    };

    const updated = [...alerts, alert];
    setAlerts(updated);
    localStorage.setItem('vizier_alerts', JSON.stringify(updated));

    setNewAlert({
      metric: 'readmission_rate',
      condition: 'greater_than',
      value: '',
      email: true,
      sms: false,
    });
  };

  const handleDeleteAlert = (id: string) => {
    const updated = alerts.filter((a) => a.id !== id);
    setAlerts(updated);
    localStorage.setItem('vizier_alerts', JSON.stringify(updated));
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
                    setNewAlert({ ...newAlert, metric: e.target.value })
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
                    setNewAlert({ ...newAlert, condition: e.target.value })
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
                  value={newAlert.value}
                  onChange={(e) =>
                    setNewAlert({ ...newAlert, value: e.target.value })
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
                  checked={newAlert.email}
                  onChange={(e) =>
                    setNewAlert({ ...newAlert, email: e.target.checked })
                  }
                  className="rounded border-gray-600 bg-gray-700"
                />{' '}
                Email notification
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newAlert.sms}
                  onChange={(e) =>
                    setNewAlert({ ...newAlert, sms: e.target.checked })
                  }
                  className="rounded border-gray-600 bg-gray-700"
                />{' '}
                SMS notification
              </label>
            </div>

            <button
              type="button"
              onClick={handleAddAlert}
              disabled={!newAlert.value || (!newAlert.email && !newAlert.sms)}
              className="w-full px-4 py-2.5 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Alert
            </button>
          </div>

          {/* Existing Alerts */}
          {alerts.length > 0 ? (
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
                          {alert.value}
                          {getMetricUnit(alert.metric)}
                        </span>
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Notify via: {alert.email && 'Email'}
                        {alert.email && alert.sms && ', '}
                        {alert.sms && 'SMS'}
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
          ) : (
            <div className="text-center py-8">
              <Bell className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No alerts configured yet</p>
              <p className="text-sm text-gray-500 mt-1">
                Create your first alert above
              </p>
            </div>
          )}
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
