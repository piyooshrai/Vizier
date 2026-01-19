import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Building2, Globe, MapPin, Phone, Save } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button, Card, Input, Select } from '../common';

const organizationSchema = z.object({
  name: z.string().min(1, 'Organization name is required').max(100),
  type: z.string().min(1, 'Organization type is required'),
  website: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .min(10, 'Please enter a valid phone number')
    .optional()
    .or(z.literal('')),
  address: z.string().max(200).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  zipCode: z.string().max(20).optional(),
  country: z.string().min(1, 'Country is required'),
});

type OrganizationFormData = z.infer<typeof organizationSchema>;

interface OrganizationSettingsProps {
  organization?: {
    name: string;
    type: string;
    website?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country: string;
  };
  onSave?: (data: OrganizationFormData) => void;
  disabled?: boolean;
}

const organizationTypes = [
  { value: 'hospital', label: 'Hospital' },
  { value: 'clinic', label: 'Clinic' },
  { value: 'health_system', label: 'Health System' },
  { value: 'medical_group', label: 'Medical Group' },
  { value: 'research_institution', label: 'Research Institution' },
  { value: 'other', label: 'Other' },
];

const countries = [
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'UK', label: 'United Kingdom' },
  { value: 'AU', label: 'Australia' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'OTHER', label: 'Other' },
];

export const OrganizationSettings: React.FC<OrganizationSettingsProps> = ({
  organization,
  onSave,
  disabled = false,
}) => {
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: organization?.name || '',
      type: organization?.type || '',
      website: organization?.website || '',
      phone: organization?.phone || '',
      address: organization?.address || '',
      city: organization?.city || '',
      state: organization?.state || '',
      zipCode: organization?.zipCode || '',
      country: organization?.country || 'US',
    },
  });

  const onSubmit = async (data: OrganizationFormData) => {
    if (disabled) return;

    try {
      onSave?.(data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save organization settings:', error);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Building2 className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">
              Organization Settings
            </h3>
            <p className="text-sm text-neutral-500">
              Manage your organization's profile and details
            </p>
          </div>
        </div>

        {success && (
          <div className="mb-4 p-4 bg-success-50 border border-success-200 rounded-lg">
            <p className="text-sm text-success-600">
              Organization settings saved successfully!
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-neutral-700 uppercase tracking-wider">
              Basic Information
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Organization Name"
                icon={<Building2 className="w-5 h-5" />}
                error={errors.name?.message}
                disabled={disabled}
                {...register('name')}
              />
              <Select
                label="Organization Type"
                options={organizationTypes}
                error={errors.type?.message}
                disabled={disabled}
                {...register('type')}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Website"
                icon={<Globe className="w-5 h-5" />}
                placeholder="https://example.com"
                error={errors.website?.message}
                disabled={disabled}
                {...register('website')}
              />
              <Input
                label="Phone"
                icon={<Phone className="w-5 h-5" />}
                placeholder="+1 (555) 000-0000"
                error={errors.phone?.message}
                disabled={disabled}
                {...register('phone')}
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-4 pt-4 border-t border-neutral-100">
            <h4 className="text-sm font-medium text-neutral-700 uppercase tracking-wider">
              Address
            </h4>

            <Input
              label="Street Address"
              icon={<MapPin className="w-5 h-5" />}
              error={errors.address?.message}
              disabled={disabled}
              {...register('address')}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="City"
                error={errors.city?.message}
                disabled={disabled}
                {...register('city')}
              />
              <Input
                label="State/Province"
                error={errors.state?.message}
                disabled={disabled}
                {...register('state')}
              />
              <Input
                label="ZIP/Postal Code"
                error={errors.zipCode?.message}
                disabled={disabled}
                {...register('zipCode')}
              />
            </div>

            <Select
              label="Country"
              options={countries}
              error={errors.country?.message}
              disabled={disabled}
              {...register('country')}
            />
          </div>

          {!disabled && (
            <div className="flex justify-end pt-4 border-t border-neutral-100">
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

export default OrganizationSettings;
