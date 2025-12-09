import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, MessageSquare, ArrowRight, Database, Users, Activity, TrendingDown, BarChart3 } from 'lucide-react';
import { Card, Button } from '../components/common';
import { VizierAvatar } from '../components/conversation';
import { useAuth } from '../contexts/AuthContext';
import { mockHealthcareData } from '../data/mockData';
import { formatNumber } from '../utils/formatters';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isDemoMode } = useAuth();

  // Show demo data when in demo mode
  const hasData = isDemoMode;

  if (!hasData) {
    return (
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Welcome Header */}
          <div className="text-center space-y-4">
            <VizierAvatar size="lg" state="idle" />
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">
                Welcome to Vizier{user?.first_name ? `, ${user.first_name}` : ''}
              </h1>
              <p className="mt-2 text-neutral-600 max-w-lg mx-auto">
                I'm your intelligent healthcare analytics assistant. Let's get started by
                analyzing your data.
              </p>
            </div>
          </div>

          {/* Getting Started Card */}
          <Card variant="elevated" padding="lg">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto">
                <Database className="w-8 h-8 text-primary-600" />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-neutral-900">
                  Let's start by analyzing your data
                </h2>
                <p className="mt-2 text-neutral-600">
                  Upload your healthcare CSV files and I'll help you discover insights about
                  your patients, encounters, and outcomes.
                </p>
              </div>

              <Button
                onClick={() => navigate('/upload')}
                size="lg"
                icon={<ArrowRight className="w-5 h-5" />}
                iconPosition="right"
              >
                Upload healthcare data
              </Button>
            </div>
          </Card>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card
              hover
              onClick={() => navigate('/upload')}
              className="cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary-50 rounded-lg">
                  <Upload className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">Upload Data</h3>
                  <p className="text-sm text-neutral-600 mt-1">
                    Share CSV exports from your EHR system
                  </p>
                </div>
              </div>
            </Card>

            <Card
              hover
              onClick={() => navigate('/insights')}
              className="cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-success-50 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-success-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">Ask Questions</h3>
                  <p className="text-sm text-neutral-600 mt-1">
                    Get instant answers about your healthcare data
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* What You Can Ask */}
          <Card>
            <h3 className="font-semibold text-neutral-900 mb-4">
              Questions I can help you answer:
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                'What are my top diagnoses by patient volume?',
                'Show me readmission rates by condition',
                'Which patients have the highest costs?',
                'What are my patient demographics?',
                'Show me encounter trends over time',
                'Which providers see the most patients?',
              ].map((question, index) => (
                <button
                  key={index}
                  onClick={() =>
                    navigate('/insights', { state: { initialQuestion: question } })
                  }
                  className="
                    text-left text-sm px-4 py-3 rounded-lg
                    bg-neutral-50 text-neutral-700
                    hover:bg-neutral-100 transition-colors
                  "
                >
                  "{question}"
                </button>
              ))}
            </div>
          </Card>

          {/* Future Dashboard Notice */}
          <div className="text-center py-4">
            <p className="text-sm text-neutral-500">
              Your personalized dashboard will appear here once you've uploaded data and
              asked a few questions. I'll learn what insights matter most to you.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Demo mode dashboard with sample data
  const { summary } = mockHealthcareData;

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">
              Welcome back{user?.first_name ? `, ${user.first_name}` : ''}
            </h1>
            <p className="mt-1 text-neutral-600">
              Here's an overview of your healthcare analytics
            </p>
          </div>
          <Button
            onClick={() => navigate('/insights')}
            icon={<MessageSquare className="w-4 h-4" />}
          >
            Ask Vizier
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-neutral-500">Total Patients</p>
                <p className="text-2xl font-bold text-neutral-900 mt-1">
                  {formatNumber(summary.totalPatients)}
                </p>
              </div>
              <div className="p-2 bg-primary-50 rounded-lg">
                <Users className="w-5 h-5 text-primary-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-neutral-500">Total Encounters</p>
                <p className="text-2xl font-bold text-neutral-900 mt-1">
                  {formatNumber(summary.totalEncounters)}
                </p>
              </div>
              <div className="p-2 bg-success-50 rounded-lg">
                <Activity className="w-5 h-5 text-success-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-neutral-500">Readmission Rate</p>
                <p className="text-2xl font-bold text-neutral-900 mt-1">
                  {summary.readmissionRate}%
                </p>
                <p className="text-xs text-success-600 mt-1">Below national avg</p>
              </div>
              <div className="p-2 bg-amber-50 rounded-lg">
                <TrendingDown className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-neutral-500">Avg Encounter Cost</p>
                <p className="text-2xl font-bold text-neutral-900 mt-1">
                  ${formatNumber(summary.averageEncounterCost)}
                </p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Top Conditions and Age Distribution */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card padding="lg">
            <h3 className="font-semibold text-neutral-900 mb-4">Top 5 Conditions</h3>
            <div className="space-y-3">
              {summary.topConditions.map((condition, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 text-center">
                    <span className="text-sm font-medium text-neutral-500">#{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-neutral-900 truncate">
                        {condition.name}
                      </span>
                      <span className="text-sm text-neutral-500 ml-2">
                        {formatNumber(condition.count)}
                      </span>
                    </div>
                    <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 rounded-full"
                        style={{ width: `${condition.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate('/insights', { state: { initialQuestion: 'What are my top diagnoses?' } })}
              className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View all diagnoses →
            </button>
          </Card>

          <Card padding="lg">
            <h3 className="font-semibold text-neutral-900 mb-4">Patient Age Distribution</h3>
            <div className="space-y-3">
              {summary.ageDistribution.map((group, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-16">
                    <span className="text-sm font-medium text-neutral-700">{group.range}</span>
                  </div>
                  <div className="flex-1">
                    <div className="h-6 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-success-500 rounded-full flex items-center justify-end pr-2"
                        style={{ width: `${group.percentage * 3}%` }}
                      >
                        <span className="text-xs text-white font-medium">
                          {group.percentage}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="w-16 text-right">
                    <span className="text-sm text-neutral-500">{formatNumber(group.count)}</span>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate('/insights', { state: { initialQuestion: 'Show me patient demographics' } })}
              className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View demographics →
            </button>
          </Card>
        </div>

        {/* Quick Questions */}
        <Card>
          <h3 className="font-semibold text-neutral-900 mb-4">
            Ask Vizier a question
          </h3>
          <div className="grid md:grid-cols-3 gap-3">
            {[
              'What are my top diagnoses?',
              'Show me readmission trends',
              'Which patients have highest costs?',
              'Show me encounter patterns',
              'Which providers see the most patients?',
              'What is my average length of stay?',
            ].map((question, index) => (
              <button
                key={index}
                onClick={() =>
                  navigate('/insights', { state: { initialQuestion: question } })
                }
                className="
                  text-left text-sm px-4 py-3 rounded-lg
                  bg-neutral-50 text-neutral-700
                  hover:bg-primary-50 hover:text-primary-700 hover:border-primary-200
                  border border-transparent transition-colors
                "
              >
                "{question}"
              </button>
            ))}
          </div>
        </Card>

        {/* Data Range */}
        <div className="text-center py-4">
          <p className="text-sm text-neutral-500">
            Analyzing data from {summary.dateRange.start} to {summary.dateRange.end}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
