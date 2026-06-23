'use client';
import Charte from "@/components/charts/Charte";
import Bandeau from "@/components/commons/Bandeau";
import BackButton from "@/components/commons/BackButton";
import { usePrincipale } from "@/hooks/datakwaba/clients/type/usePrincipale";
import { Building2 } from "lucide-react";
import { memo } from "react";
import { PeriodButtons } from "./Feature";
import InfoStat from "./InfoStat";
import PDFDownloadButton from "./ReportPDF";

const StatsCategorySection = memo(({
  title,
  items,
  tpsglobal,
  periodMultiplier,
  onClick,
  icon: Icon,
  columns = 3
}: {
  title: string;
  items: any[];
  tpsglobal: number;
  periodMultiplier: number;
  onClick: (item: any) => void;
  icon: React.ElementType;
  columns?: 3 | 4;
}) => {
  if (items.length === 0) return null;

  const colClasses = columns === 4
    ? "grid-cols-3 sm:grid-cols-4"
    : "grid-cols-3 sm:grid-cols-3";

  return (
    <div className="w-full max-w-3xl bg-white  p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Icon size={18} className="text-gray-500" />
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
          {title}
        </h3>
      </div>
      <div className={`grid ${colClasses} gap-4`}>
        {items.map((item) => (
          <InfoStat
            key={`${item.title}-${item.tpsglobal}`}
            item={{
              ...item,
              nbetablissements: Math.round(item.nbetablissements * periodMultiplier),
            }}
            tpsglobal={tpsglobal}
            onClick={onClick}
          />
        ))}
      </div>
    </div>
  );
});

const MenuDiambra = memo(() => {
  const {
    handleClick, setActivePeriod, handleBack, activeType,
    periodMultiplier, submenutitems, tpsglobal, mainMenuItem, filteredTypeItems, activePeriod,
  } = usePrincipale();

  return (
    <div className="flex flex-col items-center w-full mx-auto max-w-5xl p-4 space-y-6">
      <Bandeau />
      <BackButton onClick={handleBack} />

      <h1 className="text-xl uppercase font-bold text-gray-800 text-center">
        Statistiques des clients au plan national
      </h1>
      
      <PeriodButtons
        activePeriod={activePeriod}
        onPeriodChange={setActivePeriod}
      />

      {mainMenuItem && (
        <div className="w-full max-w-md flex justify-center">
          <InfoStat
            item={{
              ...mainMenuItem,
              nbetablissements: Math.round(mainMenuItem.nbetablissements * periodMultiplier),
            }}
            inverse
            tpsglobal={tpsglobal}
            onClick={handleClick}
          />
        </div>
      )}

      <StatsCategorySection
        title={`Par Type d'établissement ${activeType ? `- ${activeType.charAt(0).toUpperCase() + activeType.slice(1)}` : ''}`}
        items={filteredTypeItems}
        tpsglobal={tpsglobal}
        periodMultiplier={periodMultiplier}
        onClick={handleClick}
        icon={Building2}
      />

      {submenutitems.length > 0 && (
        <div className="w-full max-w-3xl flex justify-center">
          <Charte menuItems={submenutitems} />
        </div>
      )}

      <div className="w-full max-w-3xl flex justify-center">
        <PDFDownloadButton
          mainItem={mainMenuItem}
          hotelItems={submenutitems}
          subItems={submenutitems}
        />
      </div>
    </div>
  );
});

export default MenuDiambra;