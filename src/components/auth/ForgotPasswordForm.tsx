import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { authService, getErrorMessage } from '../../services';
import { Button, Input } from '../common';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordFormProps {
  onSuccess?: (email: string) => void;
  onBack?: () => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSuccess,
  onBack,
}) => {
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setError(null);
    try {
      await authService.forgotPassword(data.email);
      onSuccess?.(data.email);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="p-4 bg-error-50 border border-error-200 rounded-lg">
          <p className="text-sm text-error-600">{error}</p>
        </div>
      )}

      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-6 h-6 text-primary-600" />
        </div>
        <h2 className="text-xl font-semibold text-neutral-900 mb-2">
          Forgot your password?
        </h2>
        <p className="text-sm text-neutral-600">
          Enter your email and we'll send you instructions to reset your
          password.
        </p>
      </div>

      <Input
        label="Email address"
        type="email"
        placeholder="you@hospital.com"
        icon={<Mail className="w-5 h-5" />}
        error={errors.email?.message}
        {...register('email')}
      />

      <Button type="submit" fullWidth loading={isSubmitting} size="lg">
        Send reset instructions
      </Button>

      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Back to sign in
        </button>
      )}
    </form>
  );
};

export default ForgotPasswordForm;
