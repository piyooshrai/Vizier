import { motion } from 'framer-motion';
import type React from 'react';
import { PasswordChangeForm } from '../auth';
import { Card } from '../common';

interface PasswordSectionProps {
  disabled?: boolean;
}

export const PasswordSection: React.FC<PasswordSectionProps> = ({
  disabled = false,
}) => {
  if (disabled) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            Password
          </h3>
          <p className="text-neutral-600 text-sm">
            Password changes are not available in demo mode.
          </p>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <PasswordChangeForm />
    </motion.div>
  );
};

export default PasswordSection;
