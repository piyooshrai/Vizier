import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { Button, Input, Card } from '../components/common';
import { authService, getErrorMessage } from '../services';

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[0-9])(?=.*[^A-Za-z0-9\s]).{8,}$/,
      'Password must contain at least one number and one special character'
    ),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  // Check if token is present
  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card variant="elevated" padding="lg">
            <div className="text-center">
              <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-error-500" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                Invalid reset link
              </h2>
              <p className="text-neutral-600 mb-6">
                This password reset link is invalid or has expired.
                Please request a new one.
              </p>
              <div className="space-y-3">
                <Link to="/forgot-password" className="block">
                  <Button fullWidth>
                    Request new link
                  </Button>
                </Link>
                <Link
                  to="/login"
                  className="block text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Return to sign in
                </Link>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      setIsSubmitting(true);
      setError('');
      await authService.resetPassword(token, data.password);
      setIsSuccess(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card variant="elevated" padding="lg">
            <div className="text-center">
              <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-success-500" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                Password reset successful
              </h2>
              <p className="text-neutral-600 mb-6">
                Your password has been reset. You can now sign in with your new password.
              </p>
              <Button
                onClick={() => navigate('/login')}
                fullWidth
              >
                Sign in
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Back link */}
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to sign in
        </Link>

        <Card variant="elevated" padding="lg">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-neutral-900">
              Create new password
            </h2>
            <p className="mt-2 text-neutral-600">
              Enter a new password for your account
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-error-50 border border-error-200 rounded-lg">
              <p className="text-sm text-error-600">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="New password"
              type="password"
              placeholder="••••••••"
              hint="At least 8 characters with one number and special character"
              error={errors.password?.message}
              {...register('password')}
            />

            <Input
              label="Confirm new password"
              type="password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <Button
              type="submit"
              fullWidth
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Reset password
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
