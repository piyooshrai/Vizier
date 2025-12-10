import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { User as UserIcon, Mail, Save } from 'lucide-react';
import { Card, Button, Input, Select } from '../common';
import { User } from '../../types';
import { userService, getErrorMessage } from '../../services';

const profileSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(50),
  last_name: z.string().min(1, 'Last name is required').max(50),
  email: z.string().email('Please enter a valid email'),
  role: z.string().min(1, 'Role is required'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  user: User;
  onUpdate?: (user: User) => void;
  disabled?: boolean;
}

const roleOptions = [
  { value: 'platform_administrator', label: 'Platform Administrator' },
  { value: 'organization_owner', label: 'Organization Owner' },
  { value: 'organization_administrator', label: 'Organization Administrator' },
  { value: 'hospital_administrator', label: 'Hospital Administrator' },
  { value: 'data_analyst', label: 'Data Analyst' },
  { value: 'clinical_director', label: 'Clinical Director' },
  { value: 'quality_manager', label: 'Quality Manager' },
];

export const ProfileForm: React.FC<ProfileFormProps> = ({
  user,
  onUpdate,
  disabled = false,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    if (disabled) return;

    setError(null);
    setSuccess(false);

    try {
      const updatedUser = await userService.updateProfile(data);
      setSuccess(true);
      onUpdate?.(updatedUser);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card>
        <h3 className="text-lg font-semibold text-neutral-900 mb-6">
          Profile Information
        </h3>

        {error && (
          <div className="mb-4 p-4 bg-error-50 border border-error-200 rounded-lg">
            <p className="text-sm text-error-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-success-50 border border-success-200 rounded-lg">
            <p className="text-sm text-success-600">Profile updated successfully!</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First name"
              icon={<UserIcon className="w-5 h-5" />}
              error={errors.first_name?.message}
              disabled={disabled}
              {...register('first_name')}
            />
            <Input
              label="Last name"
              icon={<UserIcon className="w-5 h-5" />}
              error={errors.last_name?.message}
              disabled={disabled}
              {...register('last_name')}
            />
          </div>

          <Input
            label="Email"
            type="email"
            icon={<Mail className="w-5 h-5" />}
            error={errors.email?.message}
            disabled={disabled}
            {...register('email')}
          />

          <Select
            label="Role"
            options={roleOptions}
            error={errors.role?.message}
            disabled={disabled}
            {...register('role')}
          />

          {!disabled && (
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                loading={isSubmitting}
                disabled={!isDirty}
                className="inline-flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </div>
          )}
        </form>
      </Card>
    </motion.div>
  );
};

export default ProfileForm;
