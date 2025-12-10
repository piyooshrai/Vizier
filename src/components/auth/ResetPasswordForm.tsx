import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, CheckCircle } from 'lucide-react';
import { Button, Input } from '../common';
import { authService, getErrorMessage } from '../../services';

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[0-9])(?=.*[^A-Za-z0-9\s]).{8,}$/,
        'Password must contain at least one number and one special character'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
  token: string;
  onSuccess?: () => void;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  token,
  onSuccess,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setError(null);
    try {
      await authService.resetPassword(token, data.password);
      setIsSuccess(true);
      onSuccess?.();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-success-500" />
        </div>
        <h2 className="text-xl font-semibold text-neutral-900 mb-2">
          Password reset successful
        </h2>
        <p className="text-sm text-neutral-600 mb-6">
          Your password has been reset. You can now sign in with your new password.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="p-4 bg-error-50 border border-error-200 rounded-lg">
          <p className="text-sm text-error-600">{error}</p>
        </div>
      )}

      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-6 h-6 text-primary-600" />
        </div>
        <h2 className="text-xl font-semibold text-neutral-900 mb-2">
          Create new password
        </h2>
        <p className="text-sm text-neutral-600">
          Enter a new password for your account.
        </p>
      </div>

      <Input
        label="New password"
        type="password"
        placeholder="Enter new password"
        icon={<Lock className="w-5 h-5" />}
        showPasswordToggle
        error={errors.password?.message}
        hint="At least 8 characters with one number and special character"
        {...register('password')}
      />

      <Input
        label="Confirm password"
        type="password"
        placeholder="Confirm new password"
        icon={<Lock className="w-5 h-5" />}
        showPasswordToggle
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      <Button type="submit" fullWidth loading={isSubmitting} size="lg">
        Reset password
      </Button>
    </form>
  );
};

export default ResetPasswordForm;
