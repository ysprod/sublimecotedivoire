// 'use client';
// import { usePrincipale } from "@/hooks/datakwaba/commons/usePrincipale";
// import { useFiltreForm } from "@/hooks/datakwaba/recherche/useFiltreForm";
// import { useRegions } from "@/hooks/datakwaba/recherche/useRegions";
// import { CATEGORY_STYLES, TREND_CONFIG, useVert } from "@/hooks/datakwaba/recherche/useVert";
// import { DATA_LOADING, PERIOD_SHORT, PERIODS, REGIONS_COORDINATES } from "@/lib/libs/constants";
// import { getCarteColor } from '@/lib/libs/functions';
// import { AllTrends, ConfigSort, DataStatistique, FilterType, MenuItem, TrendData } from '@/lib/libs/interface';
// import { Input } from "antd";
// import clsx from "clsx";
// import mapboxgl from 'mapbox-gl';
// import 'mapbox-gl/dist/mapbox-gl.css';
// import Image from "next/image";
// import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
// import Map, { NavigationControl } from 'react-map-gl/mapbox';
// import BackButton from "../commons/BackButton";
// import Bandeau from "../commons/Bandeau";
// import Erreur from "../commons/Erreur";
// import HistoriqueLoader from "../commons/HistoriqueLoader";
// import Loader from "../commons/Loader";
// import Reessayer from "../commons/Reessayer";
// import SelectInput from "../commons/SelectInput";
// import ValidateButton from "../commons/ValidateButton";
// import Legend from '../map/Legend';
// import RegionFragment from '../map/RegionFragment';

// const PERIOD_LABELS = {
//     day: 'Jour',
//     week: 'Sem.',
//     month: 'Mois',
//     year: 'Année'
// } as const;

// const TrendBadge = memo(({
//     trend,
//     period
// }: {
//     trend: TrendData;
//     period: keyof typeof PERIOD_SHORT;
// }) => {
//     const config = TREND_CONFIG[trend.direction];
//     const Icon = config.icon;

//     return (
//         <div className={clsx(
//             "flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-medium",
//             config.bgColor,
//             config.color
//         )}>
//             <span className="font-bold text-[8px]">{PERIOD_SHORT[period]}</span>
//             <Icon size={8} className="stroke-current" />
//             <span className="font-semibold">
//                 {trend.value > 0 ? '+' : ''}{trend.value}%
//             </span>
//         </div>
//     );
// });

// const TrendIndicator = memo(({ trend, size = 'md' }: { trend: TrendData; size?: 'sm' | 'md' }) => {
//     const config = TREND_CONFIG[trend.direction];
//     const Icon = config.icon;

//     const sizeClasses = size === 'md'
//         ? "px-3 py-1.5 text-xs"
//         : "px-2 py-1 text-[10px]";

//     return (
//         <div className="flex flex-col items-center gap-1 mt-2">
//             <div className={clsx(
//                 "flex items-center gap-1.5 rounded-full font-medium",
//                 sizeClasses,
//                 config.bgColor,
//                 config.color
//             )}>
//                 <Icon size={size === 'md' ? 14 : 12} className="stroke-current" />
//                 <span className="font-semibold">
//                     {trend.value > 0 ? '+' : ''}{trend.value}%
//                 </span>
//             </div>
//             <span className="text-[9px] text-gray-500 uppercase tracking-wider font-medium">
//                 {trend.label}
//             </span>
//         </div>
//     );
// });

// const PeriodGrid = memo(({ trends }: { trends: AllTrends }) => (
//     <div className="mt-4 w-full">
//         <div className="grid grid-cols-4 gap-2 mx-auto">
//             {PERIODS.map((period) => (
//                 <TrendBadge key={period} trend={trends[period]} period={period} />
//             ))}
//         </div>
//         <div className="grid grid-cols-4 gap-2 mx-auto mt-1">
//             {PERIODS.map((period) => (
//                 <span
//                     key={`label-${period}`}
//                     className="text-[6px] text-gray-400 text-center uppercase tracking-wider"
//                 >
//                     {PERIOD_LABELS[period]}
//                 </span>
//             ))}
//         </div>
//     </div>
// ));

// interface StatCardProps {
//     item: MenuItem;
//     onClick: (item: MenuItem) => void;
//     className?: string;
//     priority?: boolean;
// }

// const StatCard = memo(({
//     item,
//     onClick,
//     className,
//     priority = false
// }: StatCardProps) => {
//     const mainTrend = useMemo<TrendData>(() => item.trends!.week, [item.trends]);
//     const style = CATEGORY_STYLES[item.id === "etablissements" ? 'etablissements' : 'clients'];
//     const formattedCount = useMemo(() => item.count.toLocaleString("fr-FR"), [item.count]);

//     const handleClick = useCallback(() => {
//         onClick(item);
//     }, [onClick, item]);

//     return (
//         <button
//             onClick={handleClick}
//             className={clsx(
//                 "group relative overflow-hidden bg-white p-6 rounded-2xl",
//                 "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
//                 "flex flex-col items-center text-center",
//                 "shadow-sm hover:shadow-xl border border-gray-100",
//                 className
//             )}
//             aria-label={`Accéder à ${item.title}`}
//         >
//             <div
//                 className={clsx(
//                     "absolute inset-0 opacity-0 group-hover:opacity-5",
//                     "bg-gradient-to-br",
//                     style.gradient
//                 )}
//                 aria-hidden="true"
//             />

//             <div className="relative z-10 flex flex-col items-center w-full">
//                 <div className="flex items-center justify-center">
//                     <div className={clsx(
//                         "p-3 rounded-full",
//                         style.iconContainerBg
//                     )}>
//                         <Image
//                             src={item.iconSrc}
//                             alt={item.iconAlt || item.title}
//                             width={80}
//                             height={80}
//                             className="w-24 h-24 object-contain"
//                             priority={priority}
//                             loading={priority ? "eager" : "lazy"}
//                             sizes="(max-width: 768px) 80px, 96px"
//                         />
//                     </div>
//                 </div>

//                 <div className="space-y-2 text-center w-full">
//                     <div>
//                         <span className="text-3xl font-black text-gray-900 tabular-nums">
//                             {formattedCount}
//                         </span>
//                     </div>

//                     <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
//                         {item.title}
//                         <br />
//                         <span className="text-[10px] text-gray-400 font-normal">
//                             SUR TOUTE L'ETENDUE DU TERRITOIRE
//                         </span>
//                     </p>
//                 </div>

//                 <TrendIndicator trend={mainTrend} size="md" />
//                 <PeriodGrid trends={item.trends!} />
//             </div>
//         </button>
//     );
// });

// interface MapCarteProps {
//     data: DataStatistique[];
//     filterType: FilterType;
//     selectedRegion: DataStatistique | null;
//     setSelectedRegion: (value: DataStatistique | null) => void;
//     getColor: (total: number) => "#cccccc" | "#ffd700" | "#ffa500" | "#ff4500";
//     getValue: (region: DataStatistique) => number;
//     getFilteredAndSortedData: () => DataStatistique[];
// }

// interface CarteStatProps {
//     data: DataStatistique[];
// }

// const MapCarte = memo(({
//     data,
//     filterType,
//     selectedRegion,
//     setSelectedRegion,
//     getColor,
//     getValue,
//     getFilteredAndSortedData
// }: MapCarteProps) => {
//     const mapRef = useRef<any>(null);

//     useEffect(() => {
//         if (mapRef.current && data?.length > 0) {
//             const timer = setTimeout(() => {
//                 const bounds = new mapboxgl.LngLatBounds();
//                 data.forEach(region => {
//                     const coordinates = REGIONS_COORDINATES[region.lib_reg.trim()];
//                     if (coordinates) {
//                         bounds.extend([coordinates[0], coordinates[1]]);
//                     }
//                 });
//                 if (!bounds.isEmpty()) {
//                     mapRef.current.fitBounds(bounds, {
//                         padding: { top: 50, bottom: 50, left: 50, right: 50 },
//                         maxZoom: 7,
//                         duration: 1500,
//                         easing: (t: number) => t * (2 - t)
//                     });
//                 }
//             }, 500);
//             return () => clearTimeout(timer);
//         }
//     }, [data]);

//     const zoomToRegion = useCallback((regionName: string) => {
//         const coordinates = REGIONS_COORDINATES[regionName.trim()];
//         if (coordinates && mapRef.current) {
//             mapRef.current.flyTo({
//                 center: [coordinates[0], coordinates[1]],
//                 zoom: 8,
//                 duration: 1500,
//                 essential: true
//             });
//         }
//     }, []);

//     return (
//         <div style={{ height: '700px', width: '100%', position: 'relative' }}>
//             <Map
//                 ref={mapRef}
//                 mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
//                 initialViewState={{ longitude: -5.2769, latitude: 7.5400, zoom: 6.5 }}
//                 style={{ width: '100%', height: '100%' }}
//                 mapStyle="mapbox://styles/mapbox/streets-v12"
//                 onLoad={(event) => {
//                     const map = event.target;
//                     map.setLayoutProperty('country-label', 'text-field', [
//                         'match',
//                         ['get', 'name_en'],
//                         'Ivory Coast',
//                         'Côte d\'Ivoire',
//                         ['get', 'name_en']
//                     ]);
//                 }}
//                 minZoom={6}
//                 maxZoom={10}
//                 maxBounds={[[-8.6, 4.2], [-2.5, 10.7]]}
//             >
//                 <NavigationControl position="top-right" />
//                 {getFilteredAndSortedData().map(region => {
//                     const coordinates = REGIONS_COORDINATES[region.lib_reg.trim()];
//                     if (!coordinates) return null;
//                     const value = getValue(region);
//                     const color = getColor(value);
//                     return (
//                         <RegionFragment
//                             key={region.lib_reg}
//                             filterType={filterType}
//                             region={region}
//                             selectedRegion={selectedRegion}
//                             setSelectedRegion={setSelectedRegion}
//                             coordinates={coordinates}
//                             value={value}
//                             color={color}
//                             zoomToRegion={zoomToRegion}
//                         />
//                     );
//                 })}
//             </Map>
//             <Legend />
//         </div>
//     );
// });

// const CarteStat = memo(({ data }: CarteStatProps) => {
//     const [selectedRegion, setSelectedRegion] = useState<DataStatistique | null>(null);
//     const [filterType] = useState<FilterType>('all');
//     const [sortConfig] = useState<ConfigSort | null>(null);

//     const getFilteredAndSortedData = useCallback(() => {
//         const filteredData = [...data];
//         if (sortConfig) {
//             filteredData.sort((a, b) => {
//                 const aValue = a[sortConfig.key as keyof DataStatistique] as number;
//                 const bValue = b[sortConfig.key as keyof DataStatistique] as number;
//                 return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
//             });
//         }
//         return filteredData;
//     }, [data, sortConfig]);

//     const getValue = useCallback((region: DataStatistique) => {
//         switch (filterType) {
//             case 'hotel': return region.Inscription;
//             case 'residence': return region.Radiation;
//             case 'maison hote': return region.Rectification;
//             default: return region.Total;
//         }
//     }, [filterType]);

//     return (
//         <div className="w-full m-0 p-1 bg-gray-100 justify-center mb-4 border border-gray-300 rounded-lg">
//             <MapCarte
//                 data={getFilteredAndSortedData()}
//                 filterType={filterType}
//                 selectedRegion={selectedRegion}
//                 setSelectedRegion={setSelectedRegion}
//                 getColor={getCarteColor}
//                 getValue={getValue}
//                 getFilteredAndSortedData={getFilteredAndSortedData}
//             />
//         </div>
//     );
// });

// const Filtre = memo(() => {
//     const { carto, departementOptions, regionOptions, loading, errorMessage, updateCarto } = usePrincipale();
//     const { regions, loading: loadingRegions, error, refresh } = useRegions();
//     const { handleUpdate, fieldStates } = useFiltreForm(carto, updateCarto);
//     const { isPending, dashboardData, handleCardClick } = useVert();
//     const [showResults, setShowResults] = useState(false);

//     const handleBack = useCallback(() => {
//         setShowResults(false);
//     }, []);

//     const handleValidate = useCallback(() => {
//         setShowResults(true);
//     }, []);

//     if (loading || loadingRegions) {
//         return <HistoriqueLoader texte={DATA_LOADING} />;
//     }

//     if (error) {
//         return <Reessayer error={error} refresh={refresh} />;
//     }



//     if (isPending) {
//         return (
//             <div className="flex flex-col items-center w-full mx-auto px-4 py-4 space-y-4">
//                 <Bandeau />
//                 <Loader />
//             </div>
//         );
//     }


//     if (errorMessage) {
//         return <Erreur message={errorMessage} />;
//     }

//     return (
//         <div className="max-w-2xl mx-auto p-4">
//             <Bandeau />
//             <BackButton onClick={handleBack} />
//             <CarteStat data={regions} />

//             <h3 className="text-xxs font-bold mb-6 text-center text-gray-800 uppercase">
//                 📊 Consultation des données par cartographie
//             </h3>

//             <div className="space-y-4">
//                 <SelectInput
//                     label="Région / District Autonome"
//                     value={carto.regionId || ''}
//                     onChange={handleUpdate('regionId')}
//                     options={regionOptions}
//                     placeholder="Sélectionnez une région"
//                 />

//                 <SelectInput
//                     label="Département"
//                     value={carto.departementId || ''}
//                     onChange={handleUpdate('departementId')}
//                     disabled={fieldStates.isDepartementDisabled}
//                     options={departementOptions}
//                     placeholder={
//                         fieldStates.isDepartementDisabled
//                             ? "Sélectionnez d'abord une région"
//                             : "Sélectionnez un département"
//                     }
//                 />

//                 <div className="space-y-1">
//                     <label className="block text-sm font-medium text-gray-700">
//                         Localité/Commune
//                     </label>
//                     <Input
//                         value={carto.localite || ''}
//                         onChange={handleUpdate('localite')}
//                         disabled={fieldStates.isCommuneDisabled}
//                         placeholder="Localité/Commune"
//                         className="w-full rounded-lg"
//                     />
//                 </div>

//                 <div className="pt-4 flex justify-center">
//                     <ValidateButton
//                         onClick={handleValidate}
//                         disabled={!fieldStates.isFormValid}
//                     />
//                 </div>

//                 <div className="flex flex-col items-center w-full mx-auto px-2 py-2 space-y-2">


//                     <div className="w-full max-w-4xl">
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                             {dashboardData.map((item, index) => (
//                                 <StatCard
//                                     key={item.id}
//                                     item={item}
//                                     onClick={handleCardClick}
//                                     priority={index === 0}
//                                 />
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// });

// export default Filtre;


// app/recherche/Filtre.tsx (Client Component)
'use client';

import { usePrincipale } from "@/hooks/datakwaba/commons/usePrincipale";
import { useFiltreForm } from "@/hooks/datakwaba/recherche/useFiltreForm";
import { useRegions } from "@/hooks/datakwaba/recherche/useRegions";
import { DATA_LOADING } from "@/lib/libs/constants";
import { memo, useCallback, useState } from "react";
import Bandeau from "../commons/Bandeau";
import BackButton from "../commons/BackButton";
import Erreur from "../commons/Erreur";
import HistoriqueLoader from "../commons/HistoriqueLoader";
import Reessayer from "../commons/Reessayer";
import { CarteSection } from "./CarteSection";
import { FiltreForm } from "./FiltreForm";
import { StatsDashboard } from "./StatsDashboard";
 
const Filtre = memo(() => {
  const { carto, departementOptions, regionOptions, loading, errorMessage, updateCarto } = usePrincipale();
  const { regions, loading: loadingRegions, error, refresh } = useRegions();
  const { handleUpdate, fieldStates } = useFiltreForm(carto, updateCarto);
  const [showResults, setShowResults] = useState(false);

  const handleBack = useCallback(() => {
    setShowResults(false);
  }, []);

  const handleValidate = useCallback(() => {
    setShowResults(true);
  }, []);

  // États de chargement
  if (loading || loadingRegions) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <Bandeau />
        <HistoriqueLoader texte={DATA_LOADING} />
      </div>
    );
  }

  // États d'erreur
  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <Bandeau />
        <Reessayer error={error} refresh={refresh} />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <Bandeau />
        <Erreur message={errorMessage} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Bandeau />
      <BackButton onClick={handleBack} />

      <CarteSection regions={regions} />

      <h3 className="text-xs font-bold mb-6 text-center text-gray-800 uppercase">
        📊 Consultation des données par cartographie
      </h3>

      <FiltreForm
        carto={carto}
        regionOptions={regionOptions}
        departementOptions={departementOptions}
        fieldStates={fieldStates}
        onUpdate={handleUpdate}
        onValidate={handleValidate}
      />

    <StatsDashboard />

      {/* {showResults && <StatsDashboard />} */}
    </div>
  );
});

Filtre.displayName = "Filtre";

export default Filtre;