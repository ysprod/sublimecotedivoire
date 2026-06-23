'use client';

import { defaultFiltre, REGIONS_COORDINATES } from '@/lib/libs/constants';
import { getCarteColor } from '@/lib/libs/functions';
import { ConfigSort, DataStatistique, FilterType, Filtre } from '@/lib/libs/interface';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as React from 'react';
import Map, { NavigationControl } from 'react-map-gl/mapbox';
import Legend from './Legend';
import RegionFragment from './RegionFragment';


interface Props {
    data: DataStatistique[];
    filterType: FilterType;
    selectedRegion: DataStatistique | null;
    setSelectedRegion: (value: DataStatistique | null) => void;
    getColor: (total: number) => "#cccccc" | "#ffd700" | "#ffa500" | "#ff4500";
    getValue: (region: DataStatistique) => number;
    getFilteredAndSortedData: () => DataStatistique[];
}

const MapCarte: React.FC<Props> = ({ data, filterType, selectedRegion, setSelectedRegion, getColor, getValue, getFilteredAndSortedData }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapRef = React.useRef<any>(null);

    React.useEffect(() => {
        if (mapRef.current && data?.length > 0) {
            const timer = setTimeout(() => {
                const bounds = new mapboxgl.LngLatBounds();
                data.forEach(region => {
                    const coordinates = REGIONS_COORDINATES[region.lib_reg.trim()];
                    if (coordinates) { bounds.extend([coordinates[0], coordinates[1]]); }
                });
                if (!bounds.isEmpty()) {
                    mapRef.current.fitBounds(bounds, {
                        padding: { top: 50, bottom: 50, left: 50, right: 50 },
                        maxZoom: 7, duration: 1500,
                        easing: (t: number) => t * (2 - t)
                    });
                }
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [data]);

    const zoomToRegion = (regionName: string) => {
        const coordinates = REGIONS_COORDINATES[regionName.trim()];
        if (coordinates && mapRef.current) {
            mapRef.current.flyTo({ center: [coordinates[0], coordinates[1]], zoom: 8, duration: 1500, essential: true });
        }
    };

    return (
        <>
            <div style={{ height: '700px', width: '100%', position: 'relative' }}>
                <Map
                    ref={mapRef}
                    mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                    initialViewState={{ longitude: -5.2769, latitude: 7.5400, zoom: 6.5 }}
                    style={{ width: '100%', height: '100%' }}
                    mapStyle="mapbox://styles/mapbox/streets-v12"
                    onLoad={(event) => {
                        const map = event.target;
                        map.setLayoutProperty('country-label', 'text-field', ['match', ['get', 'name_en'], 'Ivory Coast', 'Côte d\'Ivoire', ['get', 'name_en']]);
                    }}
                    minZoom={6}
                    maxZoom={10}
                    maxBounds={[[-8.6, 4.2], [-2.5, 10.7]]}
                >
                    <NavigationControl position="top-right" />
                    {getFilteredAndSortedData().map(region => {
                        const coordinates = REGIONS_COORDINATES[region.lib_reg.trim()];
                        if (!coordinates) { return null; }
                        const value = getValue(region);
                        const color = getColor(value);
                        return (
                            <RegionFragment key={region.lib_reg} filterType={filterType} region={region}
                                selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion}
                                coordinates={coordinates} value={value} color={color} zoomToRegion={zoomToRegion} />
                        );
                    })}
                </Map>

                <Legend />
            </div>
        </>
    );
};


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