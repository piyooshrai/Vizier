import { motion } from 'framer-motion';
import { ArrowLeft, Home } from 'lucide-react';
import type React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/common';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-8xl font-bold text-primary-200 mb-4">404</div>
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
            <svg
              viewBox="0 0 24 24"
              className="w-10 h-10 text-primary-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M6 9L12 15L18 9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="6" r="1.5" fill="currentColor" />
            </svg>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-2xl font-bold text-neutral-900 mb-3">
          Page not found
        </h1>
        <p className="text-neutral-600 mb-8">
          Sorry, I couldn't find the page you're looking for. It might have been
          moved or doesn't exist.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/dashboard">
            <Button icon={<Home className="w-5 h-5" />}>Go to Dashboard</Button>
          </Link>
          <Button
            variant="secondary"
            onClick={() => navigate(-1)}
            icon={<ArrowLeft className="w-5 h-5" />}
          >
            Go Back
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
