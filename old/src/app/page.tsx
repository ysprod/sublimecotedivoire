"use client";
import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ErrorBoundary } from "react-error-boundary";
import dynamic from 'next/dynamic';
import { useAuth } from '@/context/AuthContext';
import Loader from '@/components/commons/Loader';
import ErrorFallback from '@/components/commons/ErrorFallback';
import React from 'react';
import { handleLoadError } from '@/libs/functions';

const DynamicLogin = dynamic(() => import('@/components/Login/Login'), { loading: () => <Loader />, ssr: false });

const Principale = () => {
  const router = useRouter();

  const { isAuthenticated } = useAuth();

  const errorBoundaryHandler = useMemo(() => (error: Error, info: { componentStack: string }) => handleLoadError(error, info), []);

  useEffect(() => { if (isAuthenticated) { router.replace('/home'); } }, [isAuthenticated, router]);

  if (isAuthenticated === null) { return <Loader />; }

  if (!isAuthenticated) {
    return (
      <ErrorBoundary FallbackComponent={ErrorFallback} onError={() => errorBoundaryHandler}>
        <DynamicLogin />
      </ErrorBoundary>
    );
  }

  return null;
};

export default React.memo(Principale);