import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, MessageSquare, ArrowRight, Database } from 'lucide-react';
import { Card, Button } from '../components/common';
import { VizierAvatar } from '../components/conversation';
import { useAuth } from '../contexts/AuthContext';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // For now, show empty state since we don't have data tracking yet
  const hasData = false;

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

  // Future: populated dashboard with stats and recent insights
  return null;
};

export default Dashboard;
