'use client';
import { useAuth } from '@/context/AuthContext';
import dynamic from 'next/dynamic';
import React from 'react';

const UserDropdown = dynamic(() => import('./UserDropdownButton'), { ssr: false });

const LogoutButton = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) { return null; }

  return (<UserDropdown user={user!} />);
};

export default React.memo(LogoutButton);