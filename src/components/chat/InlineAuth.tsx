// src/components/chat/InlineAuth.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../hooks/useAuth';

const authSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type AuthFormData = z.infer<typeof authSchema>;

interface InlineAuthProps {
  onComplete: () => void;
}

export const InlineAuth: React.FC<InlineAuthProps> = ({ onComplete }) => {
  const { signup } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  });

  const onSubmit = async (data: AuthFormData) => {
    try {
      setIsSubmitting(true);
      setError('');

      await signup({
        email: data.email,
        password: data.password,
        first_name: 'User', // Will be updated in profile
        last_name: 'User',
        role: 'hospital_administrator',
      });

      onComplete();
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Unable to create account');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 animate-slide-up">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <input
        type="email"
        placeholder="you@hospital.com"
        className={`w-full px-4 py-3 bg-white border-2 ${
          errors.email ? 'border-red-300' : 'border-gray-200'
        } rounded-xl focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 text-gray-900 placeholder-gray-400 transition-all`}
        {...register('email')}
      />
      {errors.email && (
        <p className="text-xs text-red-600">{errors.email.message}</p>
      )}

      <input
        type="password"
        placeholder="Create a password (min 8 characters)"
        className={`w-full px-4 py-3 bg-white border-2 ${
          errors.password ? 'border-red-300' : 'border-gray-200'
        } rounded-xl focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 text-gray-900 placeholder-gray-400 transition-all`}
        {...register('password')}
      />
      {errors.password && (
        <p className="text-xs text-red-600">{errors.password.message}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 disabled:opacity-50 text-black font-semibold rounded-xl transition-all shadow-md hover:shadow-lg"
      >
        {isSubmitting ? 'Creating account...' : 'Continue'}
      </button>
    </form>
  );
};
