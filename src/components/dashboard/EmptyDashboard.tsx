import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, ArrowRight, Upload, MessageSquare } from 'lucide-react';
import { Button } from '../common';

interface EmptyDashboardProps {
  isDemoMode?: boolean;
}

export const EmptyDashboard: React.FC<EmptyDashboardProps> = ({
  isDemoMode = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      {/* Icon */}
      <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mb-6">
        <LayoutDashboard className="w-10 h-10 text-primary-600" />
      </div>

      {/* Title */}
      <h2 className="text-2xl font-semibold text-neutral-900 mb-3 text-center">
        Your dashboard is empty
      </h2>

      {/* Description */}
      <p className="text-neutral-600 text-center max-w-md mb-8">
        {isDemoMode
          ? "Explore the insights page and save your favorite visualizations here for quick access."
          : "Save insights from your conversations to build your personalized dashboard."}
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {isDemoMode ? (
          <Link to="/insights">
            <Button className="inline-flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Start asking questions
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        ) : (
          <>
            <Link to="/upload">
              <Button className="inline-flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload data
              </Button>
            </Link>
            <Link to="/insights">
              <Button variant="secondary" className="inline-flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Ask questions
              </Button>
            </Link>
          </>
        )}
      </div>

      {/* Tips */}
      <div className="mt-12 p-6 bg-neutral-50 rounded-xl max-w-lg w-full">
        <h3 className="font-semibold text-neutral-900 mb-4 text-center">
          How to build your dashboard
        </h3>
        <div className="space-y-3">
          {[
            'Ask questions in the Insights page',
            'Click "Save to Dashboard" on any visualization',
            'Your saved insights will appear here',
          ].map((tip, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-primary-600">
                  {index + 1}
                </span>
              </div>
              <p className="text-sm text-neutral-700">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default EmptyDashboard;
