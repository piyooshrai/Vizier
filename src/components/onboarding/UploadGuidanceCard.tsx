// src/components/onboarding/UploadGuidanceCard.tsx

import { AlertCircle, CheckCircle, Download, FileText } from 'lucide-react';
import type React from 'react';
import { useAuth } from '../../hooks/useAuth';

export const UploadGuidanceCard: React.FC = () => {
  const { isDemoMode } = useAuth();

  const handleDownloadTemplate = () => {
    // Generate a sample CSV template
    const csvContent = `patient_id,encounter_id,encounter_date,diagnosis_code,diagnosis_name,age,gender
P001,E001,2024-01-15,I10,Essential Hypertension,65,M
P002,E002,2024-01-16,E11.9,Type 2 Diabetes,58,F
P003,E003,2024-01-17,J45.909,Asthma,42,M
P004,E004,2024-01-18,M81.0,Osteoporosis,71,F
P005,E005,2024-01-19,I25.10,Coronary Artery Disease,68,M`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = globalThis.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vizier-sample-template.csv';
    a.click();
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-200 shadow-lg p-6 mb-6">
      {isDemoMode && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-900 mb-1">
                You're in Demo Mode
              </p>
              <p className="text-sm text-amber-800">
                You're currently exploring sample data.{' '}
                <a href="/" className="underline font-semibold">
                  Create an account
                </a>{' '}
                to upload your own healthcare data.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Upload Guidelines</h3>
          <p className="text-gray-600">What files does Vizier accept?</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-gray-900">Supported Formats</p>
            <p className="text-sm text-gray-600">
              CSV, XLSX, XLS files from Epic, Cerner, Allscripts, or most EHR
              systems
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-gray-900">Common Columns</p>
            <p className="text-sm text-gray-600">
              patient_id, encounter_date, diagnosis_code, diagnosis_name, age,
              gender, encounter_type
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-gray-900">Data Privacy</p>
            <p className="text-sm text-gray-600">
              All data is encrypted in transit and at rest. HIPAA compliant
              infrastructure.
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleDownloadTemplate}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl transition-all"
      >
        <Download className="w-5 h-5" />
        Download Sample Template
      </button>

      <p className="text-xs text-gray-500 mt-4 text-center">
        Not sure what to upload? The template shows you the expected format.
      </p>
    </div>
  );
};
