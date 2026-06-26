 

// app/consulter/hotes/page.tsx
'use client';

import BackButton from '@/components/commons/BackButton';
import Bandeau from '@/components/commons/Bandeau';
import { usePrincipale } from "@/hooks/datakwaba/residences/usePrincipale";
import { memo, useCallback, useState } from 'react';
 
import Loader from '@/app/loading';
import Charte from '@/components/charts/Charte';
import { InfoStat } from '../commons/InfoStat';
import { DetailedStats, ViewHotelsButton } from './Features';
import PDFDownloadButton from './ReportPDF';

// ============================================================================
// COMPOSANT PRINCIPAL
// ============================================================================

const MenuDiambra = memo(function MenuDiambra() {
  const {
    handleBackClick,
    submenutitems,
    tpsglobal,
    mainMenuItem,
    loading,
    subMenuItems,
    allMenuItems,
  } = usePrincipale();

  const [isViewHotelsLoading, setIsViewHotelsLoading] = useState(false);

  const handleBack = useCallback(() => {
    handleBackClick?.();
  }, [handleBackClick]);

  const handleViewHotels = useCallback(() => {
    setIsViewHotelsLoading(true);
    window.location.href = '/consulter/hotes/list';
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col space-y-6 p-4">
      <Bandeau />
      <BackButton onClick={handleBack} />

      <div className="mt-4 flex w-full flex-col items-center space-y-6">
        {/* Section des sous-menus */}
        <div className="grid w-full max-w-3xl grid-cols-2 gap-4 sm:grid-cols-2">
          {subMenuItems.map((item) => (
            <InfoStat
              key={`${item.title}-${item.tpsglobal}`}
              item={item}
              tpsglobal={tpsglobal}
              onClick={() => {}}
            />
          ))}
        </div>

        {/* Boutons d'action */}
        <div className="flex w-full max-w-3xl flex-col items-center gap-4 sm:flex-row">
          <ViewHotelsButton
            onClick={handleViewHotels}
            isLoading={isViewHotelsLoading}
          />
          <PDFDownloadButton
            mainItem={mainMenuItem}
            hotelItems={submenutitems}
            subItems={submenutitems}
          />
        </div>

        {/* Statistiques détaillées */}
        <DetailedStats
          items={allMenuItems}
          title="Statistiques détaillées des clients"
          className="max-w-3xl"
        />

        {/* Graphique */}
        {subMenuItems.length > 0 && (
          <div className="w-full max-w-3xl">
            <Charte menuItems={subMenuItems} />
          </div>
        )}
      </div>
    </div>
  );
});

MenuDiambra.displayName = 'MenuDiambra';

export default MenuDiambra;

