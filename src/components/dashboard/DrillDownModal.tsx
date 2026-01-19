import {
  Activity,
  AlertTriangle,
  DollarSign,
  Download,
  Printer,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface DrillDownData {
  title: string;
  subtitle: string;
  totalCount: number;
  demographics: {
    avgAge: number;
    femalePercent: number;
    malePercent: number;
    ageDistribution: { range: string; count: number }[];
    genderSplit: { name: string; value: number }[];
  };
  metrics: {
    readmissionRate: string;
    avgCost: string;
    avgEncounters: string;
  };
  comorbidities: {
    name: string;
    count: number;
    percent: number;
  }[];
  highRiskPatients: {
    id: string;
    name: string;
    mrn: string;
    age: number;
    lastVisit: string;
    primaryMetric: string;
    riskScore: 'High' | 'Medium' | 'Low';
  }[];
}

interface DrillDownModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: DrillDownData;
  isDemoMode?: boolean;
}

// Gold color palette
const COLORS = ['#F59E0B', '#FB923C', '#FBBF24', '#FDE047', '#A855F7'];

export const DrillDownModal: React.FC<DrillDownModalProps> = ({
  isOpen,
  onClose,
  data,
  isDemoMode = true,
}) => {
  const [showPatientList, setShowPatientList] = useState(false);

  const getRiskScoreClass = (riskScore: string) => {
    switch (riskScore) {
      case 'High':
        return 'bg-red-500/20 text-red-400 border border-red-500/30';
      case 'Medium':
        return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
      default:
        return 'bg-green-500/20 text-green-400 border border-green-500/30';
    }
  };

  if (!isOpen) return null;

  const handleExport = () => {
    alert(
      'Export to Excel functionality - will be implemented with backend integration',
    );
  };

  const handlePrint = () => {
    globalThis.print();
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 overflow-auto">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 max-w-6xl w-full max-h-[95vh] overflow-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-5 flex items-start justify-between z-10">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-1">{data.title}</h2>
            <p className="text-gray-400 text-sm">{data.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0 ml-4"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* Demo Mode Warning */}
        {isDemoMode && (
          <div className="mx-5 mt-5 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-center gap-3">
            <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
            <div className="text-xs">
              <span className="text-yellow-400 font-semibold">DEMO MODE:</span>
              <span className="text-gray-300 ml-2">
                Synthetic patient data for demonstration purposes only.
              </span>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        <div className="p-5">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400" />
            Key Metrics
          </h3>
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <Users className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-xs text-gray-400 uppercase tracking-wide">
                  Total Patients
                </span>
              </div>
              <div className="text-xl font-bold text-white">
                {data.totalCount.toLocaleString()}
              </div>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-xs text-gray-400 uppercase tracking-wide">
                  Avg Age
                </span>
              </div>
              <div className="text-xl font-bold text-white">
                {data.demographics.avgAge} yrs
              </div>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <Activity className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-xs text-gray-400 uppercase tracking-wide">
                  Readmission
                </span>
              </div>
              <div className="text-xl font-bold text-white">
                {data.metrics.readmissionRate}
              </div>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-xs text-gray-400 uppercase tracking-wide">
                  Avg Cost
                </span>
              </div>
              <div className="text-xl font-bold text-white">
                {data.metrics.avgCost}
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="px-5 pb-5">
          <h3 className="text-sm font-semibold text-white mb-3">
            Demographics
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {/* Age Distribution */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
              <h4 className="text-xs font-semibold text-gray-300 mb-3">
                Age Distribution
              </h4>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data.demographics.ageDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="range"
                    stroke="#9CA3AF"
                    style={{ fontSize: '10px' }}
                  />
                  <YAxis stroke="#9CA3AF" style={{ fontSize: '10px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Gender Split */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
              <h4 className="text-xs font-semibold text-gray-300 mb-3">
                Gender Distribution
              </h4>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={data.demographics.genderSplit}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data.demographics.genderSplit.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Comorbidities */}
        <div className="px-5 pb-5">
          <h3 className="text-sm font-semibold text-white mb-3">
            Common Comorbidities
          </h3>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
            <div className="space-y-3">
              {data.comorbidities.map((condition) => (
                <div key={condition.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-300">
                      {condition.name}
                    </span>
                    <span className="text-xs font-semibold text-white">
                      {condition.percent}% ({condition.count.toLocaleString()})
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-orange-400 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${condition.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Patient List Section */}
        <div className="px-5 pb-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">
              High-Risk Patients
            </h3>
            <button
              type="button"
              onClick={() => setShowPatientList(!showPatientList)}
              className="px-3 py-1.5 bg-white hover:bg-gray-100 text-black font-semibold rounded-lg transition-colors text-xs"
            >
              {showPatientList ? 'Hide' : 'Show'} Patient List
            </button>
          </div>

          {showPatientList && data.highRiskPatients.length > 0 && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
              {/* Warning Banner */}
              {isDemoMode && (
                <div className="bg-yellow-500/10 border-b border-yellow-500/30 px-3 py-2 flex items-center gap-2">
                  <AlertTriangle className="w-3 h-3 text-yellow-400" />
                  <span className="text-xs text-yellow-400">
                    Synthetic patient data for demonstration only
                  </span>
                </div>
              )}

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800/80 border-b border-gray-700">
                    <tr>
                      <th className="text-left px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Patient
                      </th>
                      <th className="text-left px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        MRN
                      </th>
                      <th className="text-left px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Age
                      </th>
                      <th className="text-left px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Last Visit
                      </th>
                      <th className="text-left px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Metric
                      </th>
                      <th className="text-left px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Risk
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {data.highRiskPatients.map((patient) => (
                      <tr
                        key={patient.id}
                        className="hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="px-3 py-2 text-xs text-white font-medium">
                          {patient.name}
                        </td>
                        <td className="px-3 py-2 text-xs text-gray-400 font-mono">
                          {patient.mrn}
                        </td>
                        <td className="px-3 py-2 text-xs text-gray-400">
                          {patient.age}
                        </td>
                        <td className="px-3 py-2 text-xs text-gray-400">
                          {patient.lastVisit}
                        </td>
                        <td className="px-3 py-2 text-xs text-gray-400">
                          {patient.primaryMetric}
                        </td>
                        <td className="px-3 py-2">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${getRiskScoreClass(patient.riskScore)}`}
                          >
                            {patient.riskScore}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="bg-gray-800/80 border-t border-gray-700 px-3 py-2">
                <p className="text-xs text-gray-400">
                  Showing top {data.highRiskPatients.length} high-risk patients
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-gray-900 border-t border-gray-700 p-4 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleExport}
              className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium"
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium"
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </button>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-white hover:bg-gray-100 text-black font-semibold rounded-lg transition-colors text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DrillDownModal;
