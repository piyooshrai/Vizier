import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Eye, EyeOff, Lock } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useChangePasswordMutation } from '../../hooks/useAuthMutations';
import { getErrorMessage } from '../../services';
import {
  type PasswordChangeFormData,
  passwordChangeSchema,
} from '../../utils/validators';
import { Button } from '../common';

export const PasswordChangeForm: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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

  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-3 bg-gray-900/50 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 ${
      hasError ? 'border-red-500' : 'border-gray-700'
    }`;

  return (
    <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-2 text-green-400 text-sm">
            <Check className="w-5 h-5" />
            <p>Password changed successfully!</p>
          </div>
        )}

        <div>
          <label
            htmlFor="current_password"
            className="block text-sm font-medium text-gray-400 mb-1.5"
          >
            Current password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Lock className="w-5 h-5" />
            </div>
            <input
              id="current_password"
              type={showCurrent ? 'text' : 'password'}
              placeholder="Enter your current password"
              className={`${inputClass(!!errors.current_password)} pl-10 pr-10`}
              {...register('current_password')}
            />
            <button
              type="button"
              onClick={() => setShowCurrent((prev) => !prev)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
              aria-label={showCurrent ? 'Hide password' : 'Show password'}
            >
              {showCurrent ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.current_password && (
            <p className="mt-1.5 text-sm text-red-400">
              {errors.current_password.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="new_password"
            className="block text-sm font-medium text-gray-400 mb-1.5"
          >
            New password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Lock className="w-5 h-5" />
            </div>
            <input
              id="new_password"
              type={showNew ? 'text' : 'password'}
              placeholder="Enter your new password"
              className={`${inputClass(!!errors.new_password)} pl-10 pr-10`}
              {...register('new_password')}
            />
            <button
              type="button"
              onClick={() => setShowNew((prev) => !prev)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
              aria-label={showNew ? 'Hide password' : 'Show password'}
            >
              {showNew ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.new_password && (
            <p className="mt-1.5 text-sm text-red-400">
              {errors.new_password.message}
            </p>
          )}
          {!errors.new_password && (
            <p className="mt-1.5 text-sm text-gray-500">
              At least 8 characters with one number and special character
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="confirm_password"
            className="block text-sm font-medium text-gray-400 mb-1.5"
          >
            Confirm new password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Lock className="w-5 h-5" />
            </div>
            <input
              id="confirm_password"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Confirm your new password"
              className={`${inputClass(!!errors.confirm_password)} pl-10 pr-10`}
              {...register('confirm_password')}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((prev) => !prev)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
            >
              {showConfirm ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.confirm_password && (
            <p className="mt-1.5 text-sm text-red-400">
              {errors.confirm_password.message}
            </p>
          )}
        </div>

        <div className="pt-2">
          <Button type="submit" loading={changePasswordMutation.isPending}>
            Update password
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PasswordChangeForm;
