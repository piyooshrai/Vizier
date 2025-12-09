import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import { Button, Input } from '../common';
import { useAuth } from '../../contexts/AuthContext';
import { signupSchema, SignupFormData } from '../../utils/validators';

const roleOptions = [
  { value: 'administrator', label: 'Hospital Administrator' },
  { value: 'clinical_director', label: 'Clinical Director' },
  { value: 'quality_manager', label: 'Quality Manager' },
  { value: 'practice_manager', label: 'Practice Manager' },
  { value: 'analyst', label: 'Healthcare Analyst' },
  { value: 'other', label: 'Other' },
];

export const SignupForm: React.FC = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: 'administrator',
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    setError(null);
    try {
      await signup(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {error && (
        <div className="p-4 bg-error-50 border border-error-200 rounded-lg">
          <p className="text-sm text-error-600">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First name"
          placeholder="Jane"
          icon={<User className="w-5 h-5" />}
          error={errors.first_name?.message}
          {...register('first_name')}
        />

        <Input
          label="Last name"
          placeholder="Smith"
          error={errors.last_name?.message}
          {...register('last_name')}
        />
      </div>

      <Input
        label="Work email"
        type="email"
        placeholder="jane.smith@healthcare.org"
        icon={<Mail className="w-5 h-5" />}
        error={errors.email?.message}
        {...register('email')}
      />

      <div className="w-full">
        <label
          htmlFor="role"
          className="block text-sm font-medium text-neutral-700 mb-1.5"
        >
          Your role
        </label>
        <select
          id="role"
          className={`
            block w-full rounded-lg border bg-white
            px-4 py-2.5 text-neutral-900
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            ${
              errors.role
                ? 'border-error-500 focus:ring-error-500'
                : 'border-neutral-300 hover:border-neutral-400'
            }
          `}
          {...register('role')}
        >
          {roleOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.role && (
          <p className="mt-1.5 text-sm text-error-600">{errors.role.message}</p>
        )}
      </div>

      <Input
        label="Password"
        type="password"
        placeholder="Create a secure password"
        icon={<Lock className="w-5 h-5" />}
        showPasswordToggle
        error={errors.password?.message}
        hint="At least 8 characters with one number and special character"
        {...register('password')}
      />

      <div className="pt-2">
        <Button type="submit" fullWidth loading={isSubmitting} size="lg">
          Create my account
        </Button>
      </div>

      <p className="text-center text-sm text-neutral-600">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700">
          Sign in
        </Link>
      </p>

      <p className="text-center text-xs text-neutral-500 pt-2">
        By creating an account, you agree to our{' '}
        <button type="button" className="text-primary-600 hover:underline">
          Terms of Service
        </button>{' '}
        and{' '}
        <button type="button" className="text-primary-600 hover:underline">
          Privacy Policy
        </button>
      </p>
    </form>
  );
};

export default SignupForm;
