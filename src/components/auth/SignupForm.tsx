import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '../../contexts/AuthContext';

const signupSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  first_name: z.string().min(1, 'First name is required').max(50),
  last_name: z.string().min(1, 'Last name is required').max(50),
  password: z
    .string()
    .min(8, 'At least 8 characters')
    .max(128)
    .regex(/[0-9]/, 'Include a number')
    .regex(/[^A-Za-z0-9\s]/, 'Include a special character'),
  role: z.string().min(1, 'Please select your role'),
});

type SignupFormData = z.infer<typeof signupSchema>;

const roleOptions = [
  { value: '', label: 'Select your role' },
  { value: 'hospital_administrator', label: 'Hospital Administrator' },
  { value: 'clinical_director', label: 'Clinical Director' },
  { value: 'quality_manager', label: 'Quality Manager' },
  { value: 'data_analyst', label: 'Data Analyst' },
  { value: 'organization_administrator', label: 'Organization Admin' },
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
    defaultValues: { role: '' },
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      setIsSubmitting(true);
      setError('');
      await signup(data);
      navigate('/upload');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : '';
      setError(
        errorMessage || 'Could not create account. Email may already exist.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (hasError: boolean) => `
    w-full px-3 py-2.5
    border rounded-lg
    text-slate-900 placeholder-slate-400
    ${hasError ? 'border-red-300 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'}
    focus:outline-none focus:ring-2 focus:border-transparent
    transition-shadow
  `;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Name fields */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="first_name"
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            First name
          </label>
          <input
            id="first_name"
            type="text"
            placeholder="Jane"
            autoComplete="given-name"
            className={inputClass(!!errors.first_name)}
            {...register('first_name')}
          />
          {errors.first_name && (
            <p className="mt-1 text-xs text-red-600">
              {errors.first_name.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="last_name"
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            Last name
          </label>
          <input
            id="last_name"
            type="text"
            placeholder="Smith"
            autoComplete="family-name"
            className={inputClass(!!errors.last_name)}
            {...register('last_name')}
          />
          {errors.last_name && (
            <p className="mt-1 text-xs text-red-600">
              {errors.last_name.message}
            </p>
          )}
        </div>
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-slate-700 mb-1.5"
        >
          Work email
        </label>
        <input
          id="email"
          type="email"
          placeholder="name@company.com"
          autoComplete="email"
          className={inputClass(!!errors.email)}
          {...register('email')}
        />
        {errors.email && (
          <p className="mt-1.5 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Role */}
      <div>
        <label
          htmlFor="role"
          className="block text-sm font-medium text-slate-700 mb-1.5"
        >
          Your role
        </label>
        <select
          id="role"
          className={inputClass(!!errors.role)}
          {...register('role')}
        >
          {roleOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.role && (
          <p className="mt-1.5 text-sm text-red-600">{errors.role.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-slate-700 mb-1.5"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Create a password"
          autoComplete="new-password"
          className={inputClass(!!errors.password)}
          {...register('password')}
        />
        {errors.password && (
          <p className="mt-1.5 text-sm text-red-600">
            {errors.password.message}
          </p>
        )}
        <p className="mt-1.5 text-xs text-slate-400">
          8+ characters with a number and special character
        </p>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="
          w-full py-2.5 px-4
          bg-blue-600 hover:bg-blue-700
          text-white font-medium rounded-lg
          transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center justify-center gap-2
        "
      >
        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
        {isSubmitting ? 'Creating account...' : 'Create account'}
      </button>

      <p className="text-xs text-center text-slate-400">
        By signing up, you agree to our Terms and Privacy Policy
      </p>
    </form>
  );
};

export default SignupForm;
