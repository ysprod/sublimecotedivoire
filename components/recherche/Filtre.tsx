'use client';
import { usePrincipale } from "@/hooks/datakwaba/commons/usePrincipale";
import { useFiltreForm } from "@/hooks/datakwaba/recherche/useFiltreForm";
import { useMenuData } from "@/hooks/datakwaba/recherche/useMenuData";
import { useRegions } from "@/hooks/datakwaba/recherche/useRegions";
import { DATA_LOADING, fadeInUp, REGIONS_COORDINATES } from "@/lib/libs/constants";
import { formatMoisFiltre, getCarteColor } from '@/lib/libs/functions';
import { CartoFiltre, ConfigSort, DataStatistique, FilterType, MenuItem } from '@/lib/libs/interface';
import { Input } from "antd";
import { motion } from "framer-motion";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { memo, useCallback, useEffect, useRef, useState } from "react";
import Map, { NavigationControl } from 'react-map-gl/mapbox';
import Bandeau from "../commons/Bandeau";
import Erreur from "../commons/Erreur";
import Reessayer from "../commons/Reessayer";
import SelectInput from "../commons/SelectInput";
import ValidateButton from "../commons/ValidateButton";
import HistoriqueLoader from "../commons/HistoriqueLoader";
import Legend from '../map/Legend';
import RegionFragment from '../map/RegionFragment';
import BackButton from "../commons/BackButton";
import MenuItemCard from "./MenuItemCard";
import { InteractiveMap } from "../map/InteractiveMap";


interface MenuDiambraProps {
    carto: CartoFiltre;
}

const EnteteFiltre = memo(({ carto }: MenuDiambraProps) => {
    const filterLabels = [
        { condition: carto.region, text: `Région/District : ${carto.region}` },
        { condition: carto.departement, text: `Département : ${carto.departement}` },
        { condition: carto.localite, text: `Commune : ${carto.localite}` },
        { condition: carto.annee, text: `Année : ${carto.annee}` },
        { condition: carto.mois, text: `Mois : ${formatMoisFiltre(carto.mois)}` },
    ];

    return (
        <motion.div
            className="p-2 max-w-6xl mx-auto text-center text-base md:text-lg font-medium space-y-2" {...fadeInUp}
        >
            {filterLabels.map(({ condition, text }, index) => condition ? (
                <motion.p
                    key={text}
                    className="capitalize" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 * index, duration: 0.4 }}
                >
                    <span className="font-semibold">{text.split(":")[0]}:</span>{text.split(":")[1]}
                </motion.p>
            ) : null)}
        </motion.div>
    );
});

interface MapCarteProps {
    data: DataStatistique[];
    filterType: FilterType;
    selectedRegion: DataStatistique | null;
    setSelectedRegion: (value: DataStatistique | null) => void;
    getColor: (total: number) => "#cccccc" | "#ffd700" | "#ffa500" | "#ff4500";
    getValue: (region: DataStatistique) => number;
    getFilteredAndSortedData: () => DataStatistique[];
}

interface CarteStatProps {
    data: DataStatistique[];
}

const MapCarte = memo(({
    data,
    filterType,
    selectedRegion,
    setSelectedRegion,
    getColor,
    getValue,
    getFilteredAndSortedData
}: MapCarteProps) => {
    const mapRef = useRef<any>(null);

    useEffect(() => {
        if (mapRef.current && data?.length > 0) {
            const timer = setTimeout(() => {
                const bounds = new mapboxgl.LngLatBounds();
                data.forEach(region => {
                    const coordinates = REGIONS_COORDINATES[region.lib_reg.trim()];
                    if (coordinates) {
                        bounds.extend([coordinates[0], coordinates[1]]);
                    }
                });
                if (!bounds.isEmpty()) {
                    mapRef.current.fitBounds(bounds, {
                        padding: { top: 50, bottom: 50, left: 50, right: 50 },
                        maxZoom: 7,
                        duration: 1500,
                        easing: (t: number) => t * (2 - t)
                    });
                }
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [data]);

    const zoomToRegion = useCallback((regionName: string) => {
        const coordinates = REGIONS_COORDINATES[regionName.trim()];
        if (coordinates && mapRef.current) {
            mapRef.current.flyTo({
                center: [coordinates[0], coordinates[1]],
                zoom: 8,
                duration: 1500,
                essential: true
            });
        }
    }, []);

    return (
        <div style={{ height: '700px', width: '100%', position: 'relative' }}>
            <Map
                ref={mapRef}
                mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                initialViewState={{ longitude: -5.2769, latitude: 7.5400, zoom: 6.5 }}
                style={{ width: '100%', height: '100%' }}
                mapStyle="mapbox://styles/mapbox/streets-v12"
                onLoad={(event) => {
                    const map = event.target;
                    map.setLayoutProperty('country-label', 'text-field', [
                        'match',
                        ['get', 'name_en'],
                        'Ivory Coast',
                        'Côte d\'Ivoire',
                        ['get', 'name_en']
                    ]);
                }}
                minZoom={6}
                maxZoom={10}
                maxBounds={[[-8.6, 4.2], [-2.5, 10.7]]}
            >
                <NavigationControl position="top-right" />
                {getFilteredAndSortedData().map(region => {
                    const coordinates = REGIONS_COORDINATES[region.lib_reg.trim()];
                    if (!coordinates) return null;
                    const value = getValue(region);
                    const color = getColor(value);
                    return (
                        <RegionFragment
                            key={region.lib_reg}
                            filterType={filterType}
                            region={region}
                            selectedRegion={selectedRegion}
                            setSelectedRegion={setSelectedRegion}
                            coordinates={coordinates}
                            value={value}
                            color={color}
                            zoomToRegion={zoomToRegion}
                        />
                    );
                })}
            </Map>
            <Legend />
        </div>
    );
});

const CarteStat = memo(({ data }: CarteStatProps) => {
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

const Filtre = memo(() => {
    const { carto, departementOptions, regionOptions, loading, errorMessage, updateCarto, setShowfiltreconsulter } = usePrincipale();
    const { regions, loading: loadingRegions, error, refresh } = useRegions();
    const { handleUpdate, fieldStates } = useFiltreForm(carto, updateCarto);
    const { mainmenutitems } = useMenuData();

    const [showResults, setShowResults] = useState(false);

    const handleBack = useCallback(() => {
        setShowResults(false);
    }, []);

    const handleItemClick = useCallback((item: MenuItem) => {
        setShowfiltreconsulter(true);
        updateCarto({ tpsglobal: item.tpsglobal });
    }, [setShowfiltreconsulter, updateCarto]);

    const renderResults = useCallback(() => (
        <div className="grid grid-cols-1 gap-4 max-w-6xl mx-auto mt-1">
            <EnteteFiltre carto={carto} />

            <div className="flex flex-col justify-center items-center">
                <h3 className="text-xs font-semibold text-gray-800 text-center">
                    RAPPORT DES DONNÉES SUR LES ÉTABLISSEMENTS HÔTELIERS
                </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                {mainmenutitems.map((item) => (
                    <MenuItemCard
                        key={item.tpsglobal}
                        item={item}
                        onClick={() => handleItemClick(item)}
                        showTrend={true}
                    />
                ))}
            </div>
        </div>
    ), [carto, mainmenutitems, handleItemClick]);

    const handleValidate = useCallback(() => {
        setShowResults(true);
    }, []);

    const handleRegionClick = (region: any) => {
        console.log('Région sélectionnée:', region);
    };

    const handleDepartmentClick = (department: any) => {
        console.log('Département sélectionné:', department);
    };

    const handleCommuneClick = (commune: any) => {
        console.log('Commune sélectionnée:', commune);
        // Rediriger vers la page de résultats
        //  router.push(`/recherche/resultat?commune=${commune.id}`);
    };

    if (loading || loadingRegions) {
        return <HistoriqueLoader texte={DATA_LOADING} />;
    }

    if (error) {
        return <Reessayer error={error} refresh={refresh} />;
    }

    if (errorMessage) {
        return <Erreur message={errorMessage} />;
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            <Bandeau />
            <BackButton onClick={handleBack} />
            <CarteStat data={regions} />

            <h3 className="text-xxs font-bold mb-6 text-center text-gray-800 uppercase">
                📊 Consultation des données par région
            </h3>

            <InteractiveMap
                onRegionClick={handleRegionClick}
                onDepartmentClick={handleDepartmentClick}
                onCommuneClick={handleCommuneClick}
            />

            <div className="space-y-4">
                <SelectInput
                    label="Région / District Autonome"
                    value={carto.regionId || ''}
                    onChange={handleUpdate('regionId')}
                    options={regionOptions}
                    placeholder="Sélectionnez une région"
                />

                <SelectInput
                    label="Département"
                    value={carto.departementId || ''}
                    onChange={handleUpdate('departementId')}
                    disabled={fieldStates.isDepartementDisabled}
                    options={departementOptions}
                    placeholder={
                        fieldStates.isDepartementDisabled
                            ? "Sélectionnez d'abord une région"
                            : "Sélectionnez un département"
                    }
                />

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Localité/Commune
                    </label>
                    <Input
                        value={carto.localite || ''}
                        onChange={handleUpdate('localite')}
                        disabled={fieldStates.isCommuneDisabled}
                        placeholder="Localité/Commune"
                        className="w-full rounded-lg"
                    />
                </div>

                <div className="pt-4 flex justify-center">
                    <ValidateButton
                        onClick={handleValidate}
                        disabled={!fieldStates.isFormValid}
                    />
                </div>

                <div className="w-full p-4">
                    {renderResults()}
                </div>
            </div>
        </div>
    );
});

export default Filtre;