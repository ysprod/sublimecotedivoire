'use client';
import DiambraWrapper from '@/components/commons/DiambraWrapper';
import Loader from '@/components/commons/Loader';
import { lazy, Suspense } from 'react';

const LazyAccueil = lazy(() => import('@/components/home/Accueil'));

const Principale = () => {
 
  return (
       <DiambraWrapper>
        <Suspense fallback={<Loader />}>
          <LazyAccueil />
        </Suspense>
      </DiambraWrapper>
   );
};

export default Principale;