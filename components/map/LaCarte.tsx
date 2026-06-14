'use client';
import * as React from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { DataStatistique, FilterType, Filtre } from '@/lib/libs/interface';
import { getCarteColor } from '@/lib/libs/functions';
import MapCarte from './MapCarte';

interface Props {
    data: DataStatistique[];
    filterType: FilterType;
    sortConfig: { key: string; direction: "asc" | "desc"; } | null;
    filters: Filtre;
    selectedRegion: DataStatistique | null;
    setSelectedRegion: (value: DataStatistique | null) => void;
}

const LaCarte: React.FC<Props> = ({ data, filterType, sortConfig, filters, selectedRegion, setSelectedRegion }) => {
    const getFilteredAndSortedData = React.useCallback(() => {
        let filteredData = [...data];
        filteredData = filteredData.filter(region => {
            return (
                region.Total >= filters.minTotal &&
                region.Total <= filters.maxTotal &&
                region.Inscription >= filters.minInscription &&
                region.Inscription <= filters.maxInscription &&
                region.Radiation >= filters.minRadiation &&
                region.Radiation <= filters.maxRadiation &&
                region.Rectification >= filters.minRectification &&
                region.Rectification <= filters.maxRectification
            );
        });

        if (sortConfig) {
            filteredData.sort((a, b) => {
                const aValue = a[sortConfig.key as keyof DataStatistique] as number;
                const bValue = b[sortConfig.key as keyof DataStatistique] as number;
                return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
            });
        }
        return filteredData;
    }, [data, filters, sortConfig]);

    const getValue = (region: DataStatistique) => {
        switch (filterType) {
            case 'hotel': return region.Inscription;
            case 'residence': return region.Radiation;
            case 'maison hote': return region.Rectification;
            default: return region.Total;
        }
    };

    return (
        <MapCarte
            data={getFilteredAndSortedData()}
            filterType={filterType}
            selectedRegion={selectedRegion}
            setSelectedRegion={setSelectedRegion}
            getColor={getCarteColor}
            getValue={getValue}
            getFilteredAndSortedData={getFilteredAndSortedData} />
    );
};

LaCarte.displayName = 'LaCarte';

export default React.memo(LaCarte);