export type UserRole =
  | 'platform_administrator'
  | 'organization_owner'
  | 'organization_administrator'
  | 'hospital_administrator'
  | 'data_analyst'
  | 'clinical_director'
  | 'quality_manager';

export interface UserRoleInfo {
  value: UserRole;
  label: string;
  description: string;
  permissions: string[];
}

export const USER_ROLES: UserRoleInfo[] = [
  {
    value: 'platform_administrator',
    label: 'Platform Administrator',
    description: 'Full system access and configuration',
    permissions: ['all'],
  },
  {
    value: 'organization_owner',
    label: 'Organization Owner',
    description: 'Organization-level administration',
    permissions: ['manage_org', 'manage_users', 'view_all_data', 'export_data'],
  },
  {
    value: 'organization_administrator',
    label: 'Organization Administrator',
    description: 'Organization management without billing',
    permissions: ['manage_users', 'view_all_data', 'export_data'],
  },
  {
    value: 'hospital_administrator',
    label: 'Hospital Administrator',
    description: 'Hospital-level data access and management',
    permissions: ['view_hospital_data', 'upload_data', 'export_data'],
  },
  {
    value: 'data_analyst',
    label: 'Data Analyst',
    description: 'Data analysis and reporting capabilities',
    permissions: ['view_assigned_data', 'run_queries', 'export_data'],
  },
  {
    value: 'clinical_director',
    label: 'Clinical Director',
    description: 'Clinical data access for quality improvement',
    permissions: ['view_clinical_data', 'run_queries'],
  },
  {
    value: 'quality_manager',
    label: 'Quality Manager',
    description: 'Quality metrics and compliance reporting',
    permissions: ['view_quality_data', 'run_queries', 'export_reports'],
  },
];

export interface Organization {
  id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'health_system' | 'medical_group' | 'research_institution' | 'other';
  website?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UserSession {
  id: string;
  userId: string;
  device: string;
  browser: string;
  os: string;
  ipAddress: string;
  location?: {
    city: string;
    region: string;
    country: string;
  };
  createdAt: string;
  lastActiveAt: string;
  isCurrent: boolean;
}

export interface ActivityLogEntry {
  id: string;
  userId: string;
  action: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}

export interface NotificationPreferences {
  email: {
    enabled: boolean;
    insights: boolean;
    systemUpdates: boolean;
    securityAlerts: boolean;
    weeklyDigest: boolean;
  };
  push: {
    enabled: boolean;
    insights: boolean;
    processingComplete: boolean;
  };
  inApp: {
    enabled: boolean;
    showBadge: boolean;
  };
}
