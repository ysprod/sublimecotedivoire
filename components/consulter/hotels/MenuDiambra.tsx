'use client';
import Loader from "@/app/loading";
import Charte from "@/components/charts/Charte";
import Bandeau from "@/components/commons/Bandeau";
import BackButton from "@/components/recherche/BackButton";
import { usePrincipale } from "@/hooks/datakwaba/hotels/usePrincipale";
import { memo, useCallback, useMemo, useState } from "react";
import { DetailedStats, ViewHotelsButton } from "./Features";
import InfoStat from "./InfoStat";
import PDFDownloadButton from "./ReportPDF";

const MenuDiambra = memo(() => {
  const {
    handleBackClick,
    submenutitems,
    tpsglobal,
    mainMenuItem,
    loading, subMenuItems, allMenuItems,
  } = usePrincipale();

  const [isViewHotelsLoading,] = useState(false);

  const clientItems = useMemo(() => {
    return submenutitems
  }, [submenutitems]);

  const handleBack = useCallback(() => {
    handleBackClick?.();
  }, [handleBackClick]);

const handleViewHotels = useCallback(() => {
  // Calcul du total des établissements
  const nbetablissements = allMenuItems.reduce((acc, item) => acc + (item.nbetablissements || 0), 0);
  
  // Construction de l'URL avec le paramètre
  const url = `/consulter/hotels/list?nbetablissements=${nbetablissements}`;
  
  // Navigation
  window.location.href = url;
}, [allMenuItems]);

  if (loading) { return <Loader />; }

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto p-4 space-y-6">
      <Bandeau />
      <BackButton onClick={handleBack} />

      <div className="flex justify-center flex-col items-center w-full mt-4 space-y-6">
        <div className="w-full max-w-md">
          <InfoStat
            item={mainMenuItem!}
            inverse
            tpsglobal={tpsglobal}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-3xl">
          {subMenuItems.map((item) => (
            <InfoStat
              key={`${item.title}-${item.tpsglobal}`}
              item={item}
              tpsglobal={tpsglobal}
            />
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-3xl">
          <ViewHotelsButton
            onClick={handleViewHotels}
            isLoading={isViewHotelsLoading}
          />
          <PDFDownloadButton
            mainItem={mainMenuItem}
            hotelItems={clientItems}
            subItems={submenutitems}
          />
        </div>

        <DetailedStats
          items={allMenuItems}
          title="Statistiques détaillées des clients"
          className="max-w-3xl"
        />

        <div className="w-full max-w-3xl space-y-6">
          <Charte menuItems={subMenuItems} />
        </div>
      </div>
    </div>
  );
});

export default MenuDiambra;