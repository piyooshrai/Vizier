import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { Button, Input } from '../common';
import { useAuth } from '../../contexts/AuthContext';
import { loginSchema, LoginFormData } from '../../utils/validators';

export const LoginForm: React.FC = () => {
  const { login, loginWithDemo } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [demoLoading, setDemoLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    }
  };

  const handleDemoLogin = async () => {
    setError(null);
    setDemoLoading(true);
    try {
      await loginWithDemo();
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Demo login failed. Please try again.');
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="p-4 bg-error-50 border border-error-200 rounded-lg">
          <p className="text-sm text-error-600">{error}</p>
        </div>
      )}

      <Input
        label="Email"
        type="email"
        placeholder="you@healthcare.org"
        icon={<Mail className="w-5 h-5" />}
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
        icon={<Lock className="w-5 h-5" />}
        showPasswordToggle
        error={errors.password?.message}
        {...register('password')}
      />

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm text-neutral-600">Remember me</span>
        </label>
        <button
          type="button"
          className="text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          Forgot password?
        </button>
      </div>

      <Button type="submit" fullWidth loading={isSubmitting} size="lg">
        Sign in to Vizier
      </Button>

      <p className="text-center text-sm text-neutral-600">
        New to Vizier?{' '}
        <Link to="/signup" className="font-medium text-primary-600 hover:text-primary-700">
          Create an account
        </Link>
      </p>

      {/* Demo Mode Section */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-neutral-500">Or</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleDemoLogin}
        disabled={demoLoading || isSubmitting}
        className="w-full py-3 px-4 border-2 border-primary-200 text-primary-600 rounded-lg font-medium hover:bg-primary-50 hover:border-primary-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {demoLoading ? 'Loading demo...' : 'Try Demo (No signup required)'}
      </button>

      <p className="mt-3 text-center text-sm text-neutral-500">
        Experience Vizier with sample healthcare data
      </p>

      {/* Demo Benefits */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">
          What's included in the demo:
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>Sample patient data from 12,847 encounters</li>
          <li>Full conversational AI capabilities</li>
          <li>Interactive healthcare dashboards</li>
          <li>All analytics features</li>
        </ul>
      </div>
    </form>
  );
};

export default LoginForm;
