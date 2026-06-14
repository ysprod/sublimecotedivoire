'use client';
import * as React from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ConfigSort, DataStatistique, FilterType } from '@/lib/libs/interface';
import { defaultFiltre } from '@/lib/libs/constants';
import CarteStatForm from './CarteStatForm';
import FiltreZone from './FiltreZone';
import LaCarte from './LaCarte';

interface Props {
    data: DataStatistique[];
}

const CarteStat: React.FC<Props> = ({ data }) => {
    const [selectedRegion, setSelectedRegion] = React.useState<DataStatistique | null>(null);
    const [filterType, setFilterType] = React.useState<FilterType>('all');
    const [isFilterModalOpen, setIsFilterModalOpen] = React.useState(false);
    const [sortConfig, setSortConfig] = React.useState<ConfigSort | null>(null);
    const [filters, setFilters] = React.useState(defaultFiltre);

    return (
        <div className="w-full m-0 p-1 bg-gray-100 justify-center mb-4 border border-gray-300 rounded-lg  ">
            <div className="mb-4">
                <div className="flex items-center justify-center mb-4 border-b border-gray-300 p-4">
                    <p className="text-lg  text-center font-semibold">Nombre total des clients par Région</p>
                </div>

                <FiltreZone setIsFilterModalOpen={setIsFilterModalOpen} filterType={filterType}
                    setSortConfig={setSortConfig} setFilterType={setFilterType}
                />
            </div>

            <CarteStatForm isFilterModalOpen={isFilterModalOpen}
                setIsFilterModalOpen={setIsFilterModalOpen} setFilters={setFilters}
            />

            <div className="grid grid-cols-1 lg:grid-cols-1">
                <LaCarte data={data} filterType={filterType} sortConfig={sortConfig}
                    filters={filters} setSelectedRegion={setSelectedRegion} selectedRegion={selectedRegion}
                />
            </div>
        </div>
    );
};

CarteStat.displayName = 'CarteStat';

export default React.memo(CarteStat);