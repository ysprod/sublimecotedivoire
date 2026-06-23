'use client';

import { defaultFiltre } from '@/lib/libs/constants';
import { getCarteColor } from '@/lib/libs/functions';
import { ConfigSort, DataStatistique, FilterType, Filtre } from '@/lib/libs/interface';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as React from 'react';
import MapCarte from './MapCarte';

// ============================================================================
// TYPES
// ============================================================================

interface CarteStatProps {
    data: DataStatistique[];
}

// ============================================================================
// COMPOSANT PRINCIPAL
// ============================================================================

const CarteStat: React.FC<CarteStatProps> = ({ data }) => {
    const [selectedRegion, setSelectedRegion] = React.useState<DataStatistique | null>(null);
    const [filterType, setFilterType] = React.useState<FilterType>('all');
    const [sortConfig, setSortConfig] = React.useState<ConfigSort | null>(null);
    const [filters, setFilters] = React.useState<Filtre>(defaultFiltre);

    // ============================================================================
    // FILTRAGE ET TRI DES DONNÉES
    // ============================================================================

    const getFilteredAndSortedData = React.useCallback(() => {
        let filteredData = [...data];

        // Application des filtres
        filteredData = filteredData.filter(region => 
            region.Total >= filters.minTotal &&
            region.Total <= filters.maxTotal &&
            region.Inscription >= filters.minInscription &&
            region.Inscription <= filters.maxInscription &&
            region.Radiation >= filters.minRadiation &&
            region.Radiation <= filters.maxRadiation &&
            region.Rectification >= filters.minRectification &&
            region.Rectification <= filters.maxRectification
        );

        // Application du tri
        if (sortConfig) {
            filteredData.sort((a, b) => {
                const aValue = a[sortConfig.key as keyof DataStatistique] as number;
                const bValue = b[sortConfig.key as keyof DataStatistique] as number;
                return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
            });
        }

        return filteredData;
    }, [data, filters, sortConfig]);

    // ============================================================================
    // RÉCUPÉRATION DE LA VALEUR SELON LE TYPE DE FILTRE
    // ============================================================================

    const getValue = React.useCallback((region: DataStatistique) => {
        switch (filterType) {
            case 'hotel': return region.Inscription;
            case 'residence': return region.Radiation;
            case 'maison hote': return region.Rectification;
            default: return region.Total;
        }
    }, [filterType]);

    // ============================================================================
    // RENDU
    // ============================================================================

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
};

// ============================================================================
// EXPORT
// ============================================================================

export default React.memo(CarteStat);