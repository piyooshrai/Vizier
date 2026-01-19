import type React from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
}) => {
  return <div className="space-y-6">{children}</div>;
};

export default DashboardLayout;
