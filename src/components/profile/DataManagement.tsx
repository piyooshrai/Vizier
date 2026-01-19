import { motion } from 'framer-motion';
import { AlertTriangle, Download, Shield } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { Button, Card, Modal } from '../common';

interface DataManagementProps {
  onExportData?: () => void;
  onDeleteAccount?: () => void;
  disabled?: boolean;
}

export const DataManagement: React.FC<DataManagementProps> = ({
  onExportData,
  onDeleteAccount,
  disabled = false,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const handleDeleteAccount = () => {
    if (deleteConfirmText === 'DELETE' && onDeleteAccount) {
      onDeleteAccount();
      setShowDeleteModal(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card>
        <h3 className="text-lg font-semibold text-neutral-900 mb-6">
          Data & Privacy
        </h3>

        <div className="space-y-4">
          {/* Data Security Info */}
          <div className="flex items-start gap-3 p-4 bg-success-50 rounded-lg">
            <Shield className="w-5 h-5 text-success-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-success-900">
                Your data is secure
              </p>
              <p className="text-sm text-success-700 mt-1">
                All uploaded data is encrypted at rest and in transit using
                industry-standard encryption (AES-256).
              </p>
            </div>
          </div>

          {/* Export Data */}
          <div className="flex items-center justify-between py-4 border-b border-neutral-100">
            <div>
              <p className="font-medium text-neutral-900">Export Your Data</p>
              <p className="text-sm text-neutral-500 mt-1">
                Download a copy of all your data and saved insights
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              disabled={disabled}
              onClick={onExportData}
              className="inline-flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>

          {/* Data Retention */}
          <div className="flex items-center justify-between py-4 border-b border-neutral-100">
            <div>
              <p className="font-medium text-neutral-900">Data Retention</p>
              <p className="text-sm text-neutral-500 mt-1">
                Your uploaded data is retained according to our data policy
              </p>
            </div>
            <span className="text-sm text-neutral-600">12 months</span>
          </div>

          {/* Delete Account */}
          <div className="flex items-center justify-between py-4">
            <div>
              <p className="font-medium text-neutral-900">Delete Account</p>
              <p className="text-sm text-neutral-500 mt-1">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              disabled={disabled}
              onClick={() => setShowDeleteModal(true)}
              className="text-error-600 hover:text-error-700 hover:bg-error-50"
            >
              Request Deletion
            </Button>
          </div>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteConfirmText('');
        }}
        title="Delete Account"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-error-50 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-error-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-error-900">
                This action cannot be undone
              </p>
              <p className="text-sm text-error-700 mt-1">
                All your data, saved insights, and account information will be
                permanently deleted.
              </p>
            </div>
          </div>

          <div>
            <label
              htmlFor="delete-confirm-input"
              className="block text-sm font-medium text-neutral-700 mb-2"
            >
              Type{' '}
              <span className="font-mono bg-neutral-100 px-1 rounded">
                DELETE
              </span>{' '}
              to confirm
            </label>
            <input
              id="delete-confirm-input"
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-error-500"
              placeholder="Type DELETE"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setShowDeleteModal(false);
                setDeleteConfirmText('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              disabled={deleteConfirmText !== 'DELETE'}
              onClick={handleDeleteAccount}
              className="bg-error-600 hover:bg-error-700"
            >
              Delete Account
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default DataManagement;
