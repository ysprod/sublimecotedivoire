'use client';
import { lazy, Suspense, useMemo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import DiambraWrapper from '@/components/commons/DiambraWrapper';
import ErrorFallback from '@/components/commons/ErrorFallback';
import Loader from '@/components/commons/Loader';
import { handleLoadError } from '@/libs/functions';

const LazyAccueil = lazy(() => import('@/components/home/Accueil'));

const Principale = () => {

  const errorBoundaryHandler = useMemo(() => (error: Error, info: { componentStack: string }) => handleLoadError(error, info), []);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={() => errorBoundaryHandler}>
      <DiambraWrapper>
        <Suspense fallback={<Loader />}>
          <LazyAccueil />
        </Suspense>
      </DiambraWrapper>
    </ErrorBoundary>
  );
};

export default Principale;