// app/recherche/components/CarteStat.tsx
'use client';

import { DataStatistique, FilterType, ConfigSort } from '@/lib/libs/interface';
import { getCarteColor } from '@/lib/libs/functions';
import { memo, useCallback, useState } from 'react';
import { MapCarte } from './MapCarte';

interface CarteStatProps {
  data: DataStatistique[];
}

export const CarteStat = memo(({ data }: CarteStatProps) => {
  const [selectedRegion, setSelectedRegion] = useState<DataStatistique | null>(null);
  const [filterType] = useState<FilterType>('all');
  const [sortConfig] = useState<ConfigSort | null>(null);

  const getFilteredAndSortedData = useCallback(() => {
    const filteredData = [...data];
    if (sortConfig) {
      filteredData.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof DataStatistique] as number;
        const bValue = b[sortConfig.key as keyof DataStatistique] as number;
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      });
    }
    return filteredData;
  }, [data, sortConfig]);

  const getValue = useCallback((region: DataStatistique) => {
    switch (filterType) {
      case 'hotel': return region.Inscription;
      case 'residence': return region.Radiation;
      case 'maison hote': return region.Rectification;
      default: return region.Total;
    }
  }, [filterType]);

  return (
    <div className="w-full m-0 p-1 bg-gray-100 justify-center mb-4 border border-gray-300 rounded-lg">
      <MapCarte
        data={getFilteredAndSortedData()}
        filterType={filterType}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        getColor={getCarteColor}
        getValue={getValue}
        getFilteredAndSortedData={getFilteredAndSortedData}
      />
    </div>
  );
});

CarteStat.displayName = "CarteStat";