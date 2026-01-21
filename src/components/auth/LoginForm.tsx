import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import type React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { useLoginMutation } from '../../hooks/useAuthMutations';
import { getErrorMessage } from '../../services';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const loginMutation = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const error = loginMutation.error ? getErrorMessage(loginMutation.error) : '';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-slate-700 mb-1.5"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="name@company.com"
          autoComplete="email"
          className={`
            w-full px-3 py-2.5
            border rounded-lg
            text-slate-900 placeholder-slate-400
            ${errors.email ? 'border-red-300 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'}
            focus:outline-none focus:ring-2 focus:border-transparent
            transition-shadow
          `}
          {...register('email')}
        />
        {errors.email && (
          <p className="mt-1.5 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-700"
          >
            Password
          </label>
          <Link
            to="/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Forgot?
          </Link>
        </div>
        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          className={`
            w-full px-3 py-2.5
            border rounded-lg
            text-slate-900 placeholder-slate-400
            ${errors.password ? 'border-red-300 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'}
            focus:outline-none focus:ring-2 focus:border-transparent
            transition-shadow
          `}
          {...register('password')}
        />
        {errors.password && (
          <p className="mt-1.5 text-sm text-red-600">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={loginMutation.isPending}
        className="
          w-full py-2.5 px-4
          bg-blue-600 hover:bg-blue-700
          text-white font-medium rounded-lg
          transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center justify-center gap-2
        "
      >
        {loginMutation.isPending && (
          <Loader2 className="w-4 h-4 animate-spin" />
        )}
        {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
};

export default LoginForm;
