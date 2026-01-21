import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Lock } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useChangePasswordMutation } from '../../hooks/useAuthMutations';
import { getErrorMessage } from '../../services';
import {
  type PasswordChangeFormData,
  passwordChangeSchema,
} from '../../utils/validators';
import { Button, Card, Input } from '../common';

export const PasswordChangeForm: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const changePasswordMutation = useChangePasswordMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema),
  });

  const onSubmit = (data: PasswordChangeFormData) => {
    setError(null);
    setSuccess(false);

    changePasswordMutation.mutate(
      {
        current_password: data.current_password,
        new_password: data.new_password,
      },
      {
        onSuccess: () => {
          setSuccess(true);
          reset();
        },
        onError: (err) => {
          setError(getErrorMessage(err));
        },
      },
    );
  };

  return (
    <Card>
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">
        Change Password
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-4 bg-error-50 border border-error-200 rounded-lg">
            <p className="text-sm text-error-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-4 bg-success-50 border border-success-200 rounded-lg flex items-center gap-2">
            <Check className="w-5 h-5 text-success-600" />
            <p className="text-sm text-success-600">
              Password changed successfully!
            </p>
          </div>
        )}

        <Input
          label="Current password"
          type="password"
          placeholder="Enter your current password"
          icon={<Lock className="w-5 h-5" />}
          showPasswordToggle
          error={errors.current_password?.message}
          {...register('current_password')}
        />

        <Input
          label="New password"
          type="password"
          placeholder="Enter your new password"
          icon={<Lock className="w-5 h-5" />}
          showPasswordToggle
          error={errors.new_password?.message}
          hint="At least 8 characters with one number and special character"
          {...register('new_password')}
        />

        <Input
          label="Confirm new password"
          type="password"
          placeholder="Confirm your new password"
          icon={<Lock className="w-5 h-5" />}
          showPasswordToggle
          error={errors.confirm_password?.message}
          {...register('confirm_password')}
        />

        <div className="pt-2">
          <Button type="submit" loading={changePasswordMutation.isPending}>
            Update password
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default PasswordChangeForm;
