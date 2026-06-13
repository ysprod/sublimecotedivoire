'use client';
import { useConsultationsByRubrique } from '@/hooks/consultations/doors/useConsultationsByRubrique';
import { Consultation } from '@/lib/interfaces';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export function useSlide4Section() {
  const router = useRouter();
  const { consultations, loading } = useConsultationsByRubrique();

  const handleSelect = useCallback(() => {
    router.push(`/star/profil/doors?r=${Date.now()}`);
  }, [router]);

  const choices = consultations as Consultation[];

  return { choices, loading, handleSelect, };
}