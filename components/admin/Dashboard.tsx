
import React from 'react';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { UserRole } from '../../types.ts';
import SuperAdminDashboard from './dashboards/SuperAdminDashboard.tsx';
import FrontDeskDashboard from './dashboards/FrontDeskDashboard.tsx';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading user information...</div>;
  }

  switch (user.role) {
    case UserRole.SUPER_ADMIN:
    case UserRole.ADMIN:
      return <SuperAdminDashboard />;
    case UserRole.FRONT_DESK:
      return <FrontDeskDashboard />;
    default:
      return <div>Unknown role. Access denied.</div>;
  }
};

export default Dashboard;
