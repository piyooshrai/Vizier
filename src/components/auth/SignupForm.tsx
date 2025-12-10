import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, User, Briefcase, Loader2 } from 'lucide-react';

const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  first_name: z.string().min(1, 'First name is required').max(50),
  last_name: z.string().min(1, 'Last name is required').max(50),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128)
    .regex(
      /^(?=.*[0-9])(?=.*[^A-Za-z0-9\s]).{8,}$/,
      'Password must include a number and a special character'
    ),
  role: z.string().min(1, 'Please select your role'),
});

type SignupFormData = z.infer<typeof signupSchema>;

const roleOptions = [
  { value: '', label: 'Select your role' },
  { value: 'hospital_administrator', label: 'Hospital Administrator' },
  { value: 'clinical_director', label: 'Clinical Director' },
  { value: 'quality_manager', label: 'Quality Manager' },
  { value: 'data_analyst', label: 'Data Analyst' },
  { value: 'organization_administrator', label: 'Organization Administrator' },
];

export const SignupForm: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: '',
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      setIsSubmitting(true);
      setError('');
      await signup(data);
      navigate('/upload'); // First-time users go to upload
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : '';
      setError(
        errorMessage ||
        "I couldn't create your account. This email may already be registered."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Name fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="first_name" className="block text-sm font-medium text-neutral-700 mb-2">
            First name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-neutral-400" />
            </div>
            <input
              id="first_name"
              type="text"
              placeholder="Jane"
              autoComplete="given-name"
              className={`
                w-full pl-11 pr-4 py-3
                border rounded-xl
                ${errors.first_name ? 'border-red-300' : 'border-neutral-300'}
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                transition-shadow
                bg-white
              `}
              {...register('first_name')}
            />
          </div>
          {errors.first_name && (
            <p className="mt-1 text-xs text-red-600">{errors.first_name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="last_name" className="block text-sm font-medium text-neutral-700 mb-2">
            Last name
          </label>
          <input
            id="last_name"
            type="text"
            placeholder="Smith"
            autoComplete="family-name"
            className={`
              w-full px-4 py-3
              border rounded-xl
              ${errors.last_name ? 'border-red-300' : 'border-neutral-300'}
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
              transition-shadow
              bg-white
            `}
            {...register('last_name')}
          />
          {errors.last_name && (
            <p className="mt-1 text-xs text-red-600">{errors.last_name.message}</p>
          )}
        </div>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
          Work email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-neutral-400" />
          </div>
          <input
            id="email"
            type="email"
            placeholder="you@hospital.com"
            autoComplete="email"
            className={`
              w-full pl-11 pr-4 py-3
              border rounded-xl
              ${errors.email ? 'border-red-300' : 'border-neutral-300'}
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
              transition-shadow
              bg-white
            `}
            {...register('email')}
          />
        </div>
        {errors.email && (
          <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Role */}
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-neutral-700 mb-2">
          Your role
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Briefcase className="h-5 w-5 text-neutral-400" />
          </div>
          <select
            id="role"
            className={`
              w-full pl-11 pr-4 py-3
              border rounded-xl
              ${errors.role ? 'border-red-300' : 'border-neutral-300'}
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
              transition-shadow
              appearance-none
              bg-white
            `}
            {...register('role')}
          >
            {roleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {/* Dropdown arrow */}
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {errors.role && (
          <p className="mt-2 text-sm text-red-600">{errors.role.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-neutral-400" />
          </div>
          <input
            id="password"
            type="password"
            placeholder="Create a strong password"
            autoComplete="new-password"
            className={`
              w-full pl-11 pr-4 py-3
              border rounded-xl
              ${errors.password ? 'border-red-300' : 'border-neutral-300'}
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
              transition-shadow
              bg-white
            `}
            {...register('password')}
          />
        </div>
        {errors.password && (
          <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
        )}
        <p className="mt-2 text-xs text-neutral-500">
          At least 8 characters with a number and special character
        </p>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="
          w-full py-3 px-6
          bg-primary-600 hover:bg-primary-700
          text-white font-semibold rounded-xl
          transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center justify-center gap-2
        "
      >
        {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
        {isSubmitting ? 'Creating account...' : 'Create my account'}
      </button>

      <p className="text-xs text-center text-neutral-500">
        By creating an account, you agree to our Terms of Service and Privacy Policy
      </p>
    </form>
  );
};

export default SignupForm;
